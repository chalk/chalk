import convertColor from 'color-convert';
import updateLog from 'log-update';
import delay from 'yoctodelay';
import chalk from '../source/index.js';

const ignoreChars = /[^!-~]/g;

function rainbow(string, offset) {
	if (!string || string.length === 0) {
		return string;
	}

	const hueStep = 360 / string.replace(ignoreChars, '').length;

	let hue = offset % 360;
	const characters = [];
	for (const character of string) {
		if (ignoreChars.test(character)) {
			characters.push(character);
		} else {
			characters.push(chalk.hex(convertColor.hsl.hex(hue, 100, 50))(character));
			hue = (hue + hueStep) % 360;
		}
	}

	return characters.join('');
}

async function animateString(string) {
	for (let index = 0; index < 360 * 5; index++) {
		updateLog(rainbow(string, index));
		await delay(2); // eslint-disable-line no-await-in-loop
	}
}

console.log();
await animateString('We hope you enjoy Chalk! <3');
console.log();
