'use strict';

const stringReplaceAll = (string, substring, replacer) => {
	let index = string.indexOf(substring);
	if (index === -1) {
		return string;
	}

	const subLen = substring.length;
	let end = 0;
	let res = '';
	do {
		res += string.substr(end, index - end) + replacer;
		end = index + subLen;
		index = string.indexOf(substring, end);
	} while (index !== -1);

	res += string.substr(end);
	return res;
};

const stringEncaseCRLFWithFirstIndex = (string, prefix, postfix, index) => {
	let end = 0;
	let res = '';
	do {
		const gotCR = string[index - 1] === '\r';
		res += string.substr(end, (gotCR ? index - 1 : index) - end) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
		end = index + 1;
		index = string.indexOf('\n', end);
	} while (index !== -1);

	res += string.substr(end);
	return res;
};

module.exports = {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
};
