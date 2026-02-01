import ansiStyles from '#ansi-styles';

// TODO: When targeting Node.js 16, use `String.prototype.replaceAll`.
export function stringReplaceAll(string, substring, replacer) {
	let index = string.indexOf(substring);
	if (index === -1) {
		return string;
	}

	const substringLength = substring.length;
	let endIndex = 0;
	let returnValue = '';
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

export const interpolateRgb = (color1, color2, factor) => [
	Math.round(color1[0] + ((color2[0] - color1[0]) * factor)),
	Math.round(color1[1] + ((color2[1] - color1[1]) * factor)),
	Math.round(color1[2] + ((color2[2] - color1[2]) * factor)),
];

export const createGradientStyler = colors => ({
	gradient: true,
	colors: colors.map(color => {
		if (typeof color === 'string') {
			return ansiStyles.hexToRgb(color);
		}

		return color; // Assume [r, g, b]
	}),
	open: '',
	close: ansiStyles.color.close,
	openAll: '',
	closeAll: ansiStyles.color.close,
	parent: undefined,
});

export const applyGradient = (string, colors, level) => {
	if (colors.length < 2 || !string) {
		return string;
	}

	const chars = [...string];
	let result = '';
	const segments = colors.length - 1;

	for (let i = 0; i < chars.length; i++) {
		const factor = i / (chars.length - 1 || 1);
		const segmentIndex = Math.min(Math.floor(factor * segments), segments - 1);
		const localFactor = (factor * segments) - segmentIndex;
		const color = interpolateRgb(colors[segmentIndex], colors[segmentIndex + 1], localFactor);

		let code;
		if (level === 3) {
			code = ansiStyles.color.ansi16m(...color);
		} else if (level === 2) {
			code = ansiStyles.color.ansi256(ansiStyles.rgbToAnsi256(...color));
		} else {
			code = ansiStyles.color.ansi(ansiStyles.rgbToAnsi(...color));
		}

		result += code + chars[i];
	}

	result += ansiStyles.color.close;
	return result;
};
