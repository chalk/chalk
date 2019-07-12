'use strict';
const styles = require('ansi-styles');
const chalk = require('..');

// Generates screenshot
for (const key of Object.keys(styles)) {
	let ret = key;

	if (key === 'reset' || key === 'hidden' || key === 'grey') {
		continue;
	}

	if (/^bg[^B]/.test(key)) {
		ret = chalk.black(ret);
	}

	process.stdout.write(chalk[key](ret) + ' ');
}
