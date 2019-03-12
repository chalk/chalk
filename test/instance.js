import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname);

const chalk = require('..');

test('create an isolated context where colors can be disabled (by level)', t => {
	const instance = new chalk.Instance({level: 0, enabled: true});
	t.is(instance.red('foo'), 'foo');
	t.is(chalk.red('foo'), '\u001B[31mfoo\u001B[39m');
	instance.level = 2;
	t.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');
});

test('create an isolated context where colors can be disabled (by enabled flag)', t => {
	const instance = new chalk.Instance({enabled: false});
	t.is(instance.red('foo'), 'foo');
	t.is(chalk.red('foo'), '\u001B[31mfoo\u001B[39m');
	instance.enabled = true;
	t.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');
});

test('the `level` option should be a number from 0 to 3', t => {
	/* eslint-disable no-new */
	t.throws(() => {
		new chalk.Instance({level: 10});
	}, /should be an integer from 0 to 3/);

	t.throws(() => {
		new chalk.Instance({level: -1});
	}, /should be an integer from 0 to 3/);
	/* eslint-enable no-new */
});
