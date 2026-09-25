import {fileURLToPath} from 'node:url';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execaNode} from 'execa';
import chalk from '../source/index.js';

chalk.level = 1;

test('don\'t output colors when manually disabled', () => {
	const oldLevel = chalk.level;
	chalk.level = 0;
	assert.equal(chalk.red('foo'), 'foo');
	chalk.level = oldLevel;
});

test('enable/disable colors based on overall chalk .level property, not individual instances', () => {
	const oldLevel = chalk.level;
	chalk.level = 1;
	const {red} = chalk;
	assert.equal(red.level, 1);
	chalk.level = 0;
	assert.equal(red.level, chalk.level);
	chalk.level = oldLevel;
});

test('propagate enable/disable changes from child colors', () => {
	const oldLevel = chalk.level;
	chalk.level = 1;
	const {red} = chalk;
	assert.equal(red.level, 1);
	assert.equal(chalk.level, 1);
	red.level = 0;
	assert.equal(red.level, 0);
	assert.equal(chalk.level, 0);
	chalk.level = 1;
	assert.equal(red.level, 1);
	assert.equal(chalk.level, 1);
	chalk.level = oldLevel;
});

test('disable colors if they are not supported', async () => {
	// The environment is not extended, as the test runner sets `FORCE_COLOR` for test files when its output is a TTY.
	const {stdout} = await execaNode(fileURLToPath(new URL('_fixture.js', import.meta.url)), {env: {}, extendEnv: false});
	assert.equal(stdout, 'testout testerr');
});
