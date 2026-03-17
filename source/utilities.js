// TODO: When targeting Node.js 16, use `String.prototype.replaceAll`.
export function stringReplaceAll(string, substring, replacer) {
	const index = string.indexOf(substring);
	if (index === -1) {
		return string;
	}

	const substringLength = substring.length;
	const replacement = substring + replacer;
	let result = '';
	let lastIndex = 0;
	let currentIndex = index;

	do {
		result += string.slice(lastIndex, currentIndex) + replacement;
		lastIndex = currentIndex + substringLength;
		currentIndex = string.indexOf(substring, lastIndex);
	} while (currentIndex !== -1);

	result += string.slice(lastIndex);
	return result;
}

export function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
	let endIndex = 0;
	let returnValue = '';
	do {
		const gotCR = string[index - 1] === '\r';
		returnValue += string.slice(endIndex, (gotCR ? index - 1 : index)) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
		endIndex = index + 1;
		index = string.indexOf('\n', endIndex);
	} while (index !== -1);

	returnValue += string.slice(endIndex);
	return returnValue;
}
