'use strict';
const chalk = require('..');

const ignoreChars = /[^!-~]/g;

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

function rainbow(string, offset) {
	if (!string || string.length === 0) {
		return string;
	}

	const hueStep = 360 / string.replace(ignoreChars, '').length;

	let hue = offset % 360;
	const characters = [];
	for (const character of string) {
		if (character.match(ignoreChars)) {
			characters.push(character);
		} else {
			characters.push(chalk.hsl(hue, 100, 50)(character));
			hue = (hue + hueStep) % 360;
		}
	}

	return characters.join('');
}

async function animateString(string) {
	console.log();
	for (let i = 0; i < 360 * 5; i++) {
		console.log('\u001B[1F\u001B[G', rainbow(string, i));
		await delay(2); // eslint-disable-line no-await-in-loop
	}
}

(async () => {
	console.log();
	await animateString('We hope you enjoy Chalk! <3');
	console.log();
})();
