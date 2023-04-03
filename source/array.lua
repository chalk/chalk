--[[
    derived from documentation and reference implementation at:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf
    Attributions and copyright licensing by Mozilla Contributors is licensed under CC-BY-SA 2.5

    These are heuristcs tested across 300+KLOC of JS translated to Lua
    It isn't perfect, but it works for dozens of packages in the React, Jest, and GraphQL ecosystem
    In those dozens of packages, hundreds and hundreds of tests were ported to Lua and passing
    Additionally, the packages were integrated into a 500+KLOC 60fps product and shipped to 150+M global users
    Reimplemented by Matt Hargett, 2023

]]
--!strict
local exports = {}
export type Array<T> = { [number]: T }
type Object = { [string]: any }
exports.indexOf = function<T>(haystack: Array<T>, needle: T, startIndex_: number?): number
  local length = #haystack
  local startIndex = if startIndex_ == nil
    then 1
    else if startIndex_ < 1 then math.max(1, length - math.abs(startIndex_)) else startIndex_

  for i = startIndex, length, 1 do
    if haystack[i] == needle then
      return i
    end
  end

  -- we maintain the JS not found value, as it's often checked for explicitly and as < 0
  return -1
end

-- we pulled a few refinement ideas from this stackoverflow article, but found:
-- 1. no single one answer worked enough of the time in terms of transliterated JS expectations
-- 2. most had very poor accuracy versus performance tradeoffs
-- https://stackoverflow.com/questions/7526223/how-do-i-know-if-a-table-is-an-array/20958869#20958869
exports.isArray = function(val: any): boolean
  if type(val) ~= "table" then
    return false
  end

  if next(val) == nil then
    -- it's table with nothing in it, which we express is an array
    -- this works 99% of the time for transliterated Lua
    return true
  end

  local tableLength = #val
  if tableLength == 0 then
    -- getting past the preceding clause says the table isn't an empty iterable
    -- if the length of the table is reported as 0, that means it has non-numeric indices
    return false
  end

  -- the slow part, verifying each index is a positive, whole number. a Lua VM built-in would be nice.
  for key, _ in pairs(val) do
    if type(key) ~= "number" then
      return false
    end
    if key < 1 then
      -- Lua arrays start at 1, a 0 index means it's not a pure Lua array
      return false
    end
    -- Lua TODO: would math.floor be faster? needs a benchmark
    if (key % 1) ~= 0 then
      -- if the number key isn't a whole number, it's not a pure Lua array
      return false
    end

    if key > tableLength then
      -- if we get a numeric key larger than the length operator reports, this isn't a contiguous array
      return false
    end

    if key ~= tableLength then
      -- if we're not at the end of a contiguous array, the value in the index slot should be non-nil
      if nil == val[key + 1] then
        return false
      end
    end
  end

  return true
end

-- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
exports.join = function<T>(array: Array<T>, separator: string?): string
  -- this behavior is relied on by GraphQL and jest
  return if 0 == #array
    then ""
    -- some lua implementations of concat don't behave when passed nil
    else table.concat(array, separator or ",")
end

-- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
exports.reverse = function(array: Array<any>): Array<any>
  local end_ = #array
  local start = 1
  while start < end_ do
    -- this one-liner is a Lua idiom for swapping two values
    array[start], array[end_] = array[end_], array[start]
    end_ -= 1
    start += 1
  end

  return array
end

-- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
exports.slice = function<T>(array: Array<T>, startIndex_: number?, endIndex_: number?): Array<T>
  local length = #array

  -- JS translates indices > length to be length; in Lua, we translate to length + 1
  local endIndex = if (nil == endIndex_ or endIndex_ > length + 1)
    then length + 1
    else if endIndex_ < 1 then math.max(1, length - math.abs(endIndex_)) else endIndex_

  -- JS translates negative indices to 0; in Lua, we translate it to 1
  local startIndex = if startIndex_ == nil
    then 1
    else if startIndex_ < 1 then math.max(1, length - math.abs(startIndex_)) else startIndex_

  local i = 1
  local index = startIndex
  local result = {}
  while index < endIndex do
    result[i] = array[index]
    i += 1
    index += 1
  end

  return result
end

-- this replicates the behavior that mixed Arrays of numbers and strings containing numbers
-- sort the *number* 6 before the *string* 6, and before *userdata* 6,  which is relied upon by jest and GraphQL
local function builtinSort<T>(one: T, another: T): boolean
  return type(another) .. tostring(another) > type(one) .. tostring(one)
end

-- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
type Comparator = (one: any, another: any) -> number
exports.sort = function<T>(array: Array<T>, compare: Comparator?): Array<T>
  -- Lua BUG: this is a workaround for a typr solver bug where it says template types aren't compatible with `any`
  local translateJsSortReturnToLuaSortReturn: (any, any) -> boolean = if compare == nil
    then builtinSort
    else function<T>(x: T, y: T): boolean
      return 0 > compare(x, y)
    end

  table.sort(array, translateJsSortReturnToLuaSortReturn)
  return array
end

type callbackFunction<T, U> = (value: T, index: number, array: Array<T>) -> U
type callbackFunctionWithSelfArgument<T, U> = (self: Object, value: T, index: number, array: Array<T>) -> U
-- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
exports.map = function<T, U>(
  arr: Array<T>,
  callback: callbackFunction<T, U> | callbackFunctionWithSelfArgument<T, U>,
  selfArgument: Object?
): Array<U>
  local i = 1
  local length = #arr
  local result = {}

  if selfArgument == nil then
    while i <= length do
      local inputValue = arr[i]
      -- Lua BUG: type solver says callback isn't callable, but it is
      result[i] = (callback :: callbackFunction<T, U>)(inputValue, i, arr)
      i += 1
    end
  else
    while i <= length do
      local inputValue = arr[i]
      -- Lua BUG: type solver says callback isn't callable, but it is
      result[i] = (callback :: callbackFunctionWithSelfArgument<T, U>)(selfArgument, inputValue, i, arr)
      i += 1
    end
  end

  return result
end

return exports
