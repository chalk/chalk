# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Testing:**

- `npm test` - Run all tests (linting, unit tests, coverage, TypeScript definitions)
- `npx ava test/<specific-test-file>.js` - Run a specific test file
- `npx tsd` - Run TypeScript definition tests only

NO LINTING. DONT ATTEMPT OT LINT

**Benchmarking:**

- `npm run bench` - Run performance benchmarks

## Architecture

Chalk is a zero-dependency terminal string styling library built as a pure ESM module. Key architectural elements:

1. **Core Files:**

   - `source/index.js` - Main entry point with the chalk factory and chainable API implementation
   - `source/utilities.js` - Helper functions for string manipulation and color conversion
   - `source/vendor/` - Vendored dependencies (ansi-styles and supports-color) to avoid external dependencies

2. **Internal Symbols:**

   - `GENERATOR` - Manages chalk instance creation and configuration
   - `STYLER` - Handles style application and chaining
   - `IS_EMPTY` - Tracks empty string optimization

3. **API Design:**

   - Uses ES6 Proxy for dynamic property access (e.g., `chalk.red.bold`)
   - Chainable API with lazy property definition for performance
   - Supports nested styles with proper ANSI escape code management
   - Template literal support via tagged template syntax

4. **Color Level Detection:**
   - Automatically detects terminal color support (levels 0-3)
   - Separate instances for stdout and stderr with independent color levels
   - Can be overridden via `new Chalk({level: n})` or `FORCE_COLOR` environment variable

## Important Notes

- This is a pure ESM package (v5+) - use `import` not `require`
- Maintain zero production dependencies - vendor any required modules
- All style properties are dynamically generated via Proxy - there's no hardcoded list
- Performance is critical - run benchmarks before/after changes to core functionality
- The codebase uses symbols for private properties to prevent collisions
- Template literal processing has special handling for newlines and empty strings
