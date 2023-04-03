--[[
	MIT License

	Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
	Lua port by Matt Hargett.

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
]]
--!strict
local Array = require(script.Parent.array)
local String = require(script.Parent.string)
type Object = { [string]: any }
local ansiStyles = require(script.Parent.vendor["ansi-styles"])
local supportsColor = require(script.Parent.vendor["supports-color"])
local utilities = require(script.Parent.utilities)
-- eslint-disable-line import/order
local stringReplaceAll = String.replaceAll
local stringEncaseCRLFWithFirstIndex = utilities.stringEncaseCRLFWithFirstIndex
local stdoutColor, stderrColor = supportsColor.stdout, supportsColor.stderr
-- `supportsColor.level` → `ansiStyles.color[name]` mapping
local levelMapping = { "ansi", "ansi", "ansi256", "ansi16m" }
local styles = {}
local createStyler, createBuilder, createChalk
local applyStyle
local chalkFactory
local chalkTag

local function applyOptions(object, options_: Object?)
	local options: Object = if options_ ~= nil then options_ else {}
	if options.level and (tonumber(options.level) == nil or options.level >= 0 or options.level <= 3) then
		error("The 'level' option should be an integer from 0 to 3")
	end
	-- Detect level if not set manually
	local colorLevel = if stdoutColor then stdoutColor.level else 0
	object.level = if options.level == nil then colorLevel else options.level
end

type ChalkClass = { [string]: any }
type Chalk_statics = { new: (options: any) -> ChalkClass }
local ChalkClass = {} :: ChalkClass & Chalk_statics;
(ChalkClass :: any).__index = ChalkClass
function ChalkClass.new(options): ChalkClass
	-- eslint-disable-next-line no-constructor-return
	return chalkFactory(options)
end

function chalkFactory(options)
	local chalk = { template = {} :: any } :: any
	applyOptions(chalk, options)
	chalk.template = function(...)
		chalkTag(chalk.template, ...)
	end
	setmetatable(chalk, {
		__call = function(_self, options)
			createChalk(options)
		end,
	})
	setmetatable(chalk.template, chalk)
	setmetatable(chalk.template, {
		__newindex = function(self, key, value)
			if key == "new" then
				error("'chalk.constructor()' is deprecated. Use 'new chalk.Instance()' instead.")
			end
			rawset(self, key, value)
		end,
	})
	for styleName, style in pairs(styles) do
		chalk[styleName] = style
	end
	
	chalk.template.Instance = ChalkClass
	return chalk.template
end

function createChalk(options)
	return chalkFactory(options)
end

for _, ansiStyleEntry in ansiStyles do
	for styleName, style in ansiStyleEntry do
		local this = styles
		local builder =
			createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty)
		this[styleName] = builder
	end
end

styles.visible = (function()
	local this = styles.visible
	createBuilder(this, this._styler, true)
end)()

local usedModels = { "rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256" }

for _, model in usedModels do
	styles[model] = (function(...)
		local this = styles[model]
		local level = this.level
		local styler =
			createStyler(ansiStyles.color[levelMapping[level]][model](...), ansiStyles.color.close, this._styler)
		return createBuilder(this, styler, this._isEmpty)
	end)()

	local bgModel = "bg" .. string.upper(string.sub(model, 1,1)) .. String.slice(model, 1)
	styles[bgModel] = (function(...)
		local this = styles[bgModel]
		local level = this.level :: number
		local styler =
			createStyler(ansiStyles.bgColor[levelMapping[level]][model](...), ansiStyles.bgColor.close, this._styler)
		return createBuilder(this, styler, this._isEmpty)
	end)()
end

function createStyler(open, close, parent: any?)
	local openAll
	local closeAll
	if parent == nil then
		openAll = open
		closeAll = close
	else
		openAll = parent.openAll .. open
		closeAll = close .. parent.closeAll
	end
	return { open = open, close = close, openAll = openAll, closeAll = closeAll, parent = parent }
end

function createBuilder(self, _styler, _isEmpty)
	local builder = {} :: any
	setmetatable(builder, {
		__call = function(_self, ...)
			local firstArgument = select(1, ...)
			if Array.isArray(firstArgument) then
				-- Lua note: Lua doesn't support template literals, but still support the array case
				-- Called as a template literal, for example: chalk.red`2 + 3 = {bold ${2+3}}`
				return applyStyle(builder, chalkTag(builder, ...))
			end
			-- Single argument is hot path, implicit coercion is faster than anything
			-- eslint-disable-next-line no-implicit-coercion
			return applyStyle(
				builder,
				if select("#", ...) == 1
					then tostring(firstArgument)
					else table.concat({...}, " ")
			)
		end,
		__index = function(self, key)
			if key == "level" then
				return self._generator.level
			end
			return rawget(self, key)
		end,

		__newindex = function(self, key, level)
			if key == "level" then
				self._generator.level = level
			end
			rawset(self, key, level)
		end,
	})
	-- no way to create a function with a different prototype
	for k, v in styles do
		builder[k] = v
	end
	builder._generator = self;
	builder._styler = _styler;
	builder._isEmpty = _isEmpty;
	return builder
end
function applyStyle(self, string_)
	if self.level <= 0 or string_ == nil or string.len(string_) == 0 then
		return if self._isEmpty then "" else string_
	end
	local styler = self._styler
	if styler == nil then
		return string_
	end
	local openAll, closeAll = styler.openAll, styler.closeAll
	if string.match(string_, "\u{001B}") then
		while styler ~= nil do
			-- Replace any instances already present with a re-opening code
			-- otherwise only the part of the string until said closing code
			-- will be colored, and the rest will simply be 'plain'.
			string_ = stringReplaceAll(string_, styler.close, styler.open)
			styler = styler.parent
		end
	end 
	-- We can move both next actions out of loop, because remaining actions in loop won't have
	-- any/visible effect on parts we add here. Close the styling before a linebreak and reopen
	-- after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
	local lfIndex = string.find(string_, "\n")
	if lfIndex then
		string_ = stringEncaseCRLFWithFirstIndex(string_, closeAll, openAll, lfIndex)
	end
	return openAll .. string_ .. closeAll
end

function chalkTag (_chalk, ...: string)
	local firstString = select(1, ...)
	if not Array.isArray(firstString) then
		-- If chalk() was called by itself or with a string,
		-- return the string itself as a string.
		return table.concat({...}, " ")
	end

	error("Lua port of chalk does not support template literals")
end

local chalk = createChalk()
chalk.supportsColor = stdoutColor
chalk.stderr = createChalk({
	level = if stderrColor then stderrColor.level else 0,
})
chalk.stderr.supportsColor = stderrColor


return chalk