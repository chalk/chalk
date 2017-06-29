const chalk = require('..');

const ignoreChars = /[^!-~]/;

function rainbow(str, offset) {
	if (!str || str.length === 0) {
		return str;
	}

	const hueStep = 360 / str.replace(ignoreChars, '').length;

	let hue = offset % 360;
	const chars = [];
	for (const c of str) {
		if (c.match(ignoreChars)) {
			chars.push(c);
		} else {
			chars.push(chalk.hsl(hue, 100, 50)(c));
			hue = (hue + hueStep) % 360;
		}
	}

	return chars.join('');
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function animateString(str) {
	console.log();
	for (let i = 0; i < 360*5; i++) {
		console.log('\x1b[1F\x1b[G ', rainbow(str, i));
		await sleep(2);
	}
}

console.log();
animateString('We hope you enjoy the new version of Chalk 2! <3').then(() => console.log());
