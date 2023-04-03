local String = require(script.Parent.string)

return { 
	stringEncaseCRLFWithFirstIndex = function(str, prefix, postfix, index)
		local endIndex = 1
		local returnValue = ""
		repeat
			local gotCR = string.sub(str, index - 1, index - 1) == "\r"
			returnValue ..= String.slice(str, endIndex, if gotCR then index - 2 else index - 1) .. prefix .. (if gotCR
			then "\r\n"
			else "\n") .. postfix
		endIndex = index + 1
		-- TODO: add String.indexOf and use it here
		index = string.find(string_, "\n", endIndex)
		until index == nil

	returnValue += String.slice(str, endIndex)
	return returnValue
end
}