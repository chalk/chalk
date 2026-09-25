import {test} from 'node:test';
import assert from 'node:assert/strict';
import chalk, {Chalk} from '../source/index.js';

chalk.level = 1;

test('create an isolated context where colors can be disabled (by level)', () => {
	const instance = new Chalk({level: 0});
	assert.equal(instance.red('foo'), 'foo');
	assert.equal(chalk.red('foo'), '\u{1B}[31mfoo\u{1B}[39m');
	instance.level = 2;
	assert.equal(instance.red('foo'), '\u{1B}[31mfoo\u{1B}[39m');
});

test('the `level` option should be a number from 0 to 3', () => {
	/* eslint-disable no-new -- Ignore */
	assert.throws(() => {
		new Chalk({level: 10});
	}, {message: /should be an integer from 0 to 3/v});

	assert.throws(() => {
		new Chalk({level: -1});
	}, {message: /should be an integer from 0 to 3/v});
	/* eslint-enable no-new */
});

test('an omitted `level` option is detected rather than rejected', () => {
	assert.equal(new Chalk({level: undefined}).level, new Chalk().level);
});

test('assigning `level` is validated', () => {
	const instance = new Chalk({level: 1});

	// Unlike the option, `undefined` is not a way to ask for detection here
	/* eslint-disable node-test/no-conditional-assertion -- The table is a non-empty literal, so the loop always runs and every case is asserted. */
	for (const level of [10, -1, 1.5, ' 1', undefined]) {
		assert.throws(() => {
			instance.level = level;
		}, {message: /should be an integer from 0 to 3/v}, `level: ${level}`);
	}
	/* eslint-enable node-test/no-conditional-assertion */

	// A style in the chain writes through to the instance, so it is validated too
	assert.throws(() => {
		instance.red.level = 10;
	}, {message: /should be an integer from 0 to 3/v});

	assert.equal(instance.level, 1);

	instance.level = 0;
	assert.equal(instance.level, 0);
	assert.equal(instance.red('foo'), 'foo');
});

test('a cached model style keeps following the level', () => {
	const instance = new Chalk({level: 3});

	// Reading it once installs the cached function on the instance
	// eslint-disable-next-line node-test/no-identical-assertion-arguments -- Reading the style through the instance is the point, so both arguments are the same member expression.
	assert.equal(instance.rgb, instance.rgb);
	assert.equal(instance.rgb(255, 0, 0)('foo'), '\u{1B}[38;2;255;0;0mfoo\u{1B}[39m');

	instance.level = 1;
	assert.equal(instance.rgb(255, 0, 0)('foo'), '\u{1B}[91mfoo\u{1B}[39m');

	instance.level = 0;
	assert.equal(instance.rgb(255, 0, 0)('foo'), 'foo');
});

test('a model style cached on a style in the chain keeps following the level', () => {
	const instance = new Chalk({level: 3});
	const {bold} = instance;

	// The cache is installed on the builder here, not on the instance
	// eslint-disable-next-line node-test/no-identical-assertion-arguments -- Reading the style through the builder is the point, so both arguments are the same member expression.
	assert.equal(bold.rgb, bold.rgb);
	assert.equal(bold.rgb(255, 0, 0)('foo'), '\u{1B}[1m\u{1B}[38;2;255;0;0mfoo\u{1B}[39m\u{1B}[22m');

	instance.level = 1;
	assert.equal(bold.rgb(255, 0, 0)('foo'), '\u{1B}[1m\u{1B}[91mfoo\u{1B}[39m\u{1B}[22m');
});

test('a deep chain reads the level from the instance it started on', () => {
	const instance = new Chalk({level: 1});
	const chain = instance.red.bold.underline;

	assert.equal(chain.level, 1);

	instance.level = 0;
	assert.equal(chain.level, 0);
	assert.equal(chain('foo'), 'foo');

	// Writing through the chain reaches the instance, however deep
	chain.level = 2;
	assert.equal(instance.level, 2);
});
