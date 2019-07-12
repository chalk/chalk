import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname);

const chalk = require('../source');

test('don\'t output colors when manually disabled', t => {
	chalk.enabled = false;
	t.is(chalk.red('foo'), 'foo');
	chalk.enabled = true;
});

test('enable/disable colors based on overall chalk enabled property, not individual instances', t => {
	chalk.enabled = false;
	const {red} = chalk;
	t.false(red.enabled);
	chalk.enabled = true;
	t.true(red.enabled);
	chalk.enabled = true;
});

test('propagate enable/disable changes from child colors', t => {
	chalk.enabled = false;
	const {red} = chalk;
	t.false(red.enabled);
	t.false(chalk.enabled);
	red.enabled = true;
	t.true(red.enabled);
	t.true(chalk.enabled);
	chalk.enabled = false;
	t.false(red.enabled);
	t.false(chalk.enabled);
	chalk.enabled = true;
});
