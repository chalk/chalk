import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname, {
	stdout: {
		level: 0,
		hasBasic: false,
		has256: false,
		has16m: false
	},
	stderr: {
		level: 0,
		hasBasic: false,
		has256: false,
		has16m: false
	}
});

const chalk = require('../source');

test('colors can be forced by using chalk.level', t => {
	chalk.level = 1;
	t.is(chalk.green('hello'), '\u001B[32mhello\u001B[39m');
});
