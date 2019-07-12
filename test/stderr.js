import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname);

const chalk = require('../source');
const chalkStderr = require('../stderr');

test('import chalk/stderr with supports-color information for fd2', t => {
	t.is(chalk.level, 3);
	t.is(chalkStderr.level, 2);
	t.is(chalkStderr.red('foo'), '\u001B[31mfoo\u001B[39m');
});

test('create isolated instance of stderr chalk', t => {
	const instance = new chalkStderr.Instance();
	t.is(instance.level, 2);
	t.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');
});
