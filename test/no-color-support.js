import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname, {
	level: 0,
	hasBasic: false,
	has256: false,
	has16m: false
});

const m = require('..');

test.failing('can be forced on using chalk.enabled', t => {
	m.enabled = true;
	t.is(m.green('hello'), '\u001B[32mhello\u001B[39m');
});
