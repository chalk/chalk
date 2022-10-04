import {fileURLToPath} from 'node:url';
import test from 'ava';
import {execaNode} from 'execa';
import chalk from '../source/index.js';

chalk.level = 1;

test('don\'t output colors when manually disabled', t => {
	const oldLevel = chalk.level;
	chalk.level = 0;
	t.is(chalk.red('foo'), 'foo');
	chalk.level = oldLevel;
});

test('enable/disable colors based on overall chalk .level property, not individual instances', t => {
	const oldLevel = chalk.level;
	chalk.level = 1;
	const {red} = chalk;
	t.is(red.level, 1);
	chalk.level = 0;
	t.is(red.level, chalk.level);
	chalk.level = oldLevel;
});

test('propagate enable/disable changes from child colors', t => {
	const oldLevel = chalk.level;
	chalk.level = 1;
	const {red} = chalk;
	t.is(red.level, 1);
	t.is(chalk.level, 1);
	red.level = 0;
	t.is(red.level, 0);
	t.is(chalk.level, 0);
	chalk.level = 1;
	t.is(red.level, 1);
	t.is(chalk.level, 1);
	chalk.level = oldLevel;
});

test('disable colors if they are not supported', async t => {
	const {stdout} = await execaNode(fileURLToPath(new URL('_fixture.js', import.meta.url)));
	t.is(stdout, 'testout testerr');
});
