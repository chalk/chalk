'use strict';
const styles = require('ansi-styles');
const chalk = require('..');

// Generates screenshot
for (const key of Object.keys(styles)) {
	let returnValue = key;

	if (key === 'reset' || key === 'hidden' || key === 'grey') {
		continue;
	}

	if (/^bg[^B]/.test(key)) {
		returnValue = chalk.black(returnValue);
	}

	process.stdout.write(chalk[key](returnValue) + ' ');
}
