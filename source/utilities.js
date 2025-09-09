const SUPPORTED_NODE_VER = 16;

export function stringReplaceAll(string, substring, replacer) {
	if (
		getVersion()?.major >= SUPPORTED_NODE_VER
		typeof String.prototype.replaceAll === "function" &&
	) {
		return string.replaceAll(substring, replacer);
	}

	return _stringReplaceAllPolyfill(string, substring, replacer);
}

function _stringReplaceAllPolyfill(string, substring, replacer) {
	let index = string.indexOf(substring);
	if (index === -1) {
		return string;
	}

	const substringLength = substring.length;
	let endIndex = 0;
	let returnValue = "";
	do {
		returnValue += string.slice(endIndex, index) + substring + replacer;
		endIndex = index + substringLength;
		index = string.indexOf(substring, endIndex);
	} while (index !== -1);

	returnValue += string.slice(endIndex);
	return returnValue;
}

export function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
	let endIndex = 0;
	let returnValue = "";
	do {
		const gotCR = string[index - 1] === "\r";
		returnValue +=
			string.slice(endIndex, gotCR ? index - 1 : index) +
			prefix +
			(gotCR ? "\r\n" : "\n") +
			postfix;
		endIndex = index + 1;
		index = string.indexOf("\n", endIndex);
	} while (index !== -1);

	returnValue += string.slice(endIndex);
	return returnValue;
}

function getVersion() {
	const nodeVersion = process.version;
	if (!nodeVersion) {
		return null;
	}

	const parts = nodeVersion.split(".");

	return {
		major: parseInt(parts[0]),
		minor: parseInt(parts[1]),
		patch: parseInt(parts[2]),
	};
}
