--[[
    derived from documentation and reference implementation at:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf
    Attributions and copyright licensing by Mozilla Contributors is licensed under CC-BY-SA 2.5
]]
--!strict
local Array = require(script.Parent.array)
type Array<T> = Array.Array<T>
local RegExp = require(script.Parent.regex)
type RegExp = RegExp.RegExp
local exports = {}

local NaN = 0 / 0
-- TODO?: support utf8
exports.charCodeAt = function(str: string, index: number): number
  if index < 1 or index >= string.len(str) then
    return NaN
  end
  local result = string.byte(str, index)
  return if result == nil then NaN else result
end

exports.lastIndexOf = function(str: string, findValue: string, _fromIndex: number?): number
  -- explicitly use string.len to help bytecode compiler/JIT/interpreter avoid dynamic dispatch
  local stringLength = string.len(str)
  local fromIndex
  if _fromIndex == nil then
    fromIndex = stringLength
  else
    if _fromIndex > stringLength then
      fromIndex = stringLength
    elseif _fromIndex > 0 then
      fromIndex = _fromIndex
    else
      fromIndex = 1
    end
  end
  -- Jest and other JS libraries rely on this seemingly minor behavior
  if findValue == "" then
    return fromIndex
  end

  local lastFoundStartIndex, foundStartIndex
  local foundEndIndex = 0 :: number?
  repeat
    lastFoundStartIndex = foundStartIndex
    -- Lua BUG: type analysis doesn't understand that string.find() returns (nil,nil) or (number, number), and therefore the loop bound means foundEndIndex can never be nil
    foundStartIndex, foundEndIndex = string.find(str, findValue, (foundEndIndex :: number) + 1, true)
  until foundStartIndex == nil or foundStartIndex > fromIndex

  if lastFoundStartIndex == nil then
    return -1
  end
  -- Lua BUG: comparison above doesn't strip nilability from lastFoundStartIndex
  return lastFoundStartIndex :: number
end

-- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
-- MDN and TS defines more strongly, but Lua doen't allow trailing args after varargs: (match, p1, p2, /* …, */ pN, offset, string, groups) -> string
type Replacer = (match: string, ...any) -> string
exports.replace = function(str: string, regExp: RegExp, replaceFunction: Replacer): string
  local v = str
  local match = regExp:exec(v)
  local offset = 0
  local replaceArr = {}
  while match ~= nil and match.index ~= nil do
    -- Lua FIXME: type analysis doesn't understand  mixed array+object like: Array<string> | { key: type }
    local m = (match :: Array<string>)[1]
    local args: Array<string | number> = Array.slice(match, 1, match.n + 1)
    local index = match.index + offset

    table.insert(args, index)

    local replace = replaceFunction(m, table.unpack(args))

    table.insert(replaceArr, {
      from = index,
      length = #m,
      value = replace,
    })

    -- Lua BUG: analyze doesn't recognize match.index as a number
    offset += #m + match.index - 1
    v = string.sub(str, offset + 1)
    match = regExp:exec(v)
  end
  local result = string.sub(str, 1)
  for _, rep in Array.reverse(replaceArr) do
    local from, length, value = rep.from, rep.length, rep.value
    local prefix = string.sub(result, 1, from - 1)
    local suffix = string.sub(result, from + length)

    result = prefix .. value .. suffix
  end

  return result
end

-- TODO: support utf8 and the substring "" case documented in MDN
-- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll
exports.replaceAll = function(str: string, substring: string, replacer)
  local index = string.find(str, substring, 1, true)
	if index == nil then
		return str
	end
  
	local output = ""
	local substringLength = string.len(substring)
	local endIndex = 1

	repeat
		output ..= string.sub(str, endIndex, index - 1) .. substring .. replacer
		endIndex = index + substringLength
    -- TODO: add indexOf to string and use it here
		index = string.find(str, substring, endIndex, true)
	until index == nil

	output ..= exports.slice(str, endIndex)
	return output
end

exports.slice = function(str: string, startIndex: number, lastIndex_: number?): string
  local stringLength = string.len(str)

  -- picomatch ends up relying on this subtle behavior when jest calls into it
  if startIndex + stringLength < 0 then
    startIndex = 1
  end

  if startIndex > stringLength then
    return ""
  end

  local lastIndex = lastIndex_ or stringLength + 1

  -- utf8 support needed to pass picomatch tests
  local utf8OffsetStart = utf8.offset(str, startIndex)
  assert(utf8OffsetStart ~= nil, "invalid utf8")
  local utf8OffsetEnd = utf8.offset(str, lastIndex) :: any - 1

  return string.sub(str, utf8OffsetStart, utf8OffsetEnd)
end

exports.startsWith = function(str: string, findValue: string, position: number?): boolean
  position = if position == nil then 1 else if position < 1 then 1 else position
  if position :: number > string.len(str) then
    return false
  end

  return string.find(str, findValue, position :: number, true) == position
end

return exports
