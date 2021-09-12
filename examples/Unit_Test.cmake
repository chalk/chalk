"####
# Unit_Test.cmake:
#
# Testing does not properly handle unit test dependencies in some versions of CMake. Therefore,
# we follow a standard workaround from CMake users and create a "check" target used to run the
# tests while rolling-up the dependencies properly. Thus tests may be run using `make check` as
# opposed to the standard CMake call. The CMake test support functions are still used.
#
####
# Bail if not testing
if (NOT CMAKE_BUILD_TYPE STREQUAL "TESTING" )
    return()
endif()

set(MEM_TEST_CLI_OPTIONS '--leak-check=full --error-exitcode=100 --show-leak-kinds=all -v')

# Enable testing, setup CTest, etc.
enable_testing()
include( CTest )
add_custom_target(check
            COMMAND ${CMAKE_COMMAND} -E chdir ${CMAKE_BINARY_DIR} find . -name "*.gcda" -delete
            COMMAND ${CMAKE_CTEST_COMMAND})
add_custom_target(check_leak
            COMMAND ${CMAKE_COMMAND} -E chdir ${CMAKE_BINARY_DIR} find . -name "*.gcda" -delete
            COMMAND ${CMAKE_CTEST_COMMAND}
                  --overwrite MemoryCheckCommand=/usr/bin/valgrind
                  --overwrite MemoryCheckCommandOptions=${MEM_TEST_CLI_OPTIONS}
                  -T MemCheck)

####
# Function `unit_test_component_autocoder`:
#
# Performs registration of the autocoder step for the generation of GTestBase.hpp, GTestBase.cpp,
# TesterBase.cpp, and TesterBase.hpp. These autocoding steps automate, and keep up-to-date the
# above files saving time.
#
# - **EXE_NAME:** name of exe (unit test exe)
# - **SOURCE_FILES:** source files to provide for autocoding
####
function(unit_test_component_autocoder EXE_NAME SOURCE_FILES INCLUDE_GTEST)
  # Search for component xml files
  foreach(TEST_SOURCE ${SOURCE_FILES})
    string(REGEX MATCH "([./a-zA-Z0-9\-_]+)ComponentAi.xml" COMPONENT_XML ${TEST_SOURCE})
    if(NOT ${COMPONENT_XML} STREQUAL "")
      # Extract component name
      string(REGEX REPLACE "([a-zA-Z0-9\-_]+)(ComponentAi.xml)" "\\1" COMPONENT_NAME ${COMPONENT_XML})
      get_filename_component(RAW_XML ${COMPONENT_XML} NAME)

      set(AUTOCODE_DIR "${CMAKE_CURRENT_BINARY_DIR}/Autocode")
      #TODO: fix once the autocoder does break on build-root
      set(TMP_AC_DIR "${CMAKE_CURRENT_SOURCE_DIR}/Autocode")
      get_module_name("${TMP_AC_DIR}")
      set(AC_TMP_MOD "${MODULE_NAME}_clean")

      # This creates the temporary Autocoder directory. Since this is used by multiple generations
      # it must be created on the fly, and cleaned up afterword. The clean-up step here "generates"
      # a fake source
      # Add a custom command to make the directory
      add_custom_command(
        OUTPUT ${TMP_AC_DIR}
        COMMAND ${CMAKE_COMMAND} -E make_directory ${TMP_AC_DIR}
      )

      set(GTEST_SOURCE "${AUTOCODE_DIR}/GTestBase.cpp")
      set(BASE_SOURCE "${AUTOCODE_DIR}/TesterBase.cpp")
      set(GTEST_HEADER "${AUTOCODE_DIR}/GTestBase.hpp")
      set(BASE_HEADER "${AUTOCODE_DIR}/TesterBase.hpp")
      target_include_directories(${EXE_NAME} PUBLIC ${AUTOCODE_DIR})
      string(REPLACE ";" ":" FPRIME_BUILD_LOCATIONS_SEP "${FPRIME_BUILD_LOCATIONS}")
      add_custom_command(
        OUTPUT ${GTEST_SOURCE} ${BASE_SOURCE} ${GTEST_HEADER} ${BASE_HEADER}
        COMMAND ${CMAKE_COMMAND} -E copy ${TEST_SOURCE} ${TMP_AC_DIR}
        COMMAND ${CMAKE_COMMAND} -E chdir ${TMP_AC_DIR} ${CMAKE_COMMAND} -E env pwd
        COMMAND ${CMAKE_COMMAND} -E chdir ${TMP_AC_DIR}
        ${CMAKE_COMMAND} -E env PYTHONPATH=${PYTHON_AUTOCODER_DIR}/src:${PYTHON_AUTOCODER_DIR}/utils BUILD_ROOT="${FPRIME_BUILD_LOCATIONS_SEP}"
        FPRIME_AC_CONSTANTS_FILE="${FPRIME_AC_CONSTANTS_FILE}"
        PYTHON_AUTOCODER_DIR=${PYTHON_AUTOCODER_DIR} DICTIONARY_DIR=${DICTIONARY_DIR}
        ${PYTHON_AUTOCODER_DIR}/bin/codegen.py -p ${TMP_AC_DIR} --build_root ${RAW_XML}
        COMMAND ${CMAKE_COMMAND} -E chdir ${TMP_AC_DIR}
        ${CMAKE_COMMAND} -E env PYTHONPATH=${PYTHON_AUTOCODER_DIR}/src:${PYTHON_AUTOCODER_DIR}/utils BUILD_ROOT="${FPRIME_BUILD_LOCATIONS_SEP}"
        FPRIME_AC_CONSTANTS_FILE="${FPRIME_AC_CONSTANTS_FILE}"
        PYTHON_AUTOCODER_DIR=${PYTHON_AUTOCODER_DIR} DICTIONARY_DIR=${DICTIONARY_DIR}
        ${PYTHON_AUTOCODER_DIR}/bin/codegen.py -p ${TMP_AC_DIR} --build_root -u ${RAW_XML}
        COMMAND ${CMAKE_COMMAND} -E remove ${TMP_AC_DIR}/Tester.hpp ${TMP_AC_DIR}/Tester.cpp
        COMMAND ${CMAKE_COMMAND} -E copy_directory ${TMP_AC_DIR} ${AUTOCODE_DIR}
        COMMAND ${CMAKE_COMMAND} -E remove_directory ${TMP_AC_DIR}
        COMMAND ${CMAKE_COMMAND} -E echo "All done Yo!"
        DEPENDS ${TEST_SOURCE} ${TMP_AC_DIR}
      )
      set_hash_flag("${GTEST_SOURCE}")
      set_hash_flag("${BASE_SOURCE}")
      # Add autocode sources to module
      target_sources(
        ${EXE_NAME}
        PRIVATE
        ${BASE_SOURCE}
      )
      if (INCLUDE_GTEST)
          target_sources(
              ${EXE_NAME}
              PRIVATE
              ${GTEST_SOURCE}
        )
      endif()
    endif()
  endforeach()
endfunction(unit_test_component_autocoder)


####
# Function `generate_ut`:
#
# Generates the actual unit test, dependencies, and call the autocoder.
#
# - **UT_EXE_NAME:** name of the UT executable to be created
# - **UT_SOURCES_INPUT:** sources to split into source and autocoder file
# - **MOD_DEPS_INPUT:** dependencies split into thread and module dependencies
####
function(generate_ut UT_EXE_NAME UT_SOURCES_INPUT MOD_DEPS_INPUT INCLUDE_GTEST)
    # Set the following variables from the existing SOURCE_FILES and LINK_DEPS by splitting them into
    # their separate pieces.
    #
    # AUTOCODER_INPUT_FILES = *.xml and *.txt in SOURCE_FILES_INPUT, fed to auto-coder
    # SOURCE_FILES = all other items in SOURCE_FILES_INPUT, set as compile-time sources
    # LINK_DEPS = -l link flags given to DEPS_INPUT
    # MOD_DEPS = All other module inputs DEPS_INPUT
    split_source_files("${UT_SOURCES_INPUT}")
    split_dependencies("${MOD_DEPS_INPUT}")
    if (NOT DEFINED FPRIME_OBJECT_TYPE)
        set(FPRIME_OBJECT_TYPE "Unit-Test")
    endif()
    generate_executable(${UT_EXE_NAME} "${SOURCE_FILES}" "${MOD_DEPS_INPUT}")
    # Generate the UTs w/ autocoding and add the other sources
    unit_test_component_autocoder(${UT_EXE_NAME} "${AUTOCODER_INPUT_FILES}" ${INCLUDE_GTEST})
    # Link modules
    if (INCLUDE_GTEST)
        target_link_libraries(
            "${UT_EXE_NAME}"
            "gtest_main"
            "-lpthread" #TODO: fix this
        )
    endif()
    # Add test and dependencies to the "check" target
    add_test(NAME ${UT_EXE_NAME} COMMAND ${UT_EXE_NAME})
    add_dependencies(check ${UT_EXE_NAME})
    add_dependencies(check_leak ${UT_EXE_NAME})

    # Check target for this module
    # gcda files are generated per object file when executing a binary with coverage enabled
    # make sure all existing coverage files are removed before running unit test executables
    if (NOT TARGET "${MODULE_NAME}_check")
        add_custom_target(
            "${MODULE_NAME}_check"
            COMMAND ${CMAKE_COMMAND} -E chdir ${CMAKE_BINARY_DIR} find . -name "*.gcda" -delete
            COMMAND ${CMAKE_CTEST_COMMAND} --verbose
        )
    endif()
    if (NOT TARGET "${MODULE_NAME}_check_leak")
        add_custom_target(
            "${MODULE_NAME}_check_leak"
            COMMAND ${CMAKE_COMMAND} -E chdir ${CMAKE_BINARY_DIR} find . -name "*.gcda" -delete
            COMMAND ${CMAKE_CTEST_COMMAND}
                --overwrite MemoryCheckCommand=/usr/bin/valgrind
                --overwrite MemoryCheckCommandOptions=${MEM_TEST_CLI_OPTIONS}
                --verbose -T MemCheck
        )
    endif()

    # Add top ut wrapper for this module
    if (NOT TARGET "${MODULE_NAME}_ut_exe")
      add_custom_target("${MODULE_NAME}_ut_exe")
    endif()

    add_dependencies("${MODULE_NAME}_check" ${UT_EXE_NAME})
    add_dependencies("${MODULE_NAME}_check_leak" ${UT_EXE_NAME})
    add_dependencies("${MODULE_NAME}_ut_exe" ${UT_EXE_NAME})

    # Link library list output on per-module basis
    if (CMAKE_DEBUG_OUTPUT)
	    print_dependencies(${UT_EXE_NAME})
    endif()
endfunction()"
 

import datacloud
