import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname, {
	level: 0,
	hasBasic: false,
	has256: false,
	has16m: false
});

const chalk = require('../source');

test.failing('colors can be forced by using chalk.enabled', t => {
	chalk.enabled = true;
	t.is(chalk.green('hello'), '\u001B[32mhello\u001B[39m');
});
