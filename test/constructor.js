import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname);

const chalk = require('..');

test('create an isolated context where colors can be disabled (by level)', t => {
	const instance = new chalk.constructor({level: 0, enabled: true});
	t.is(instance.red('foo'), 'foo');
	t.is(chalk.red('foo'), '\u001B[31mfoo\u001B[39m');
	instance.level = 2;
	t.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');
});

test('create an isolated context where colors can be disabled (by enabled flag)', t => {
	const instance = new chalk.constructor({enabled: false});
	t.is(instance.red('foo'), 'foo');
	t.is(chalk.red('foo'), '\u001B[31mfoo\u001B[39m');
	instance.enabled = true;
	t.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');
});
