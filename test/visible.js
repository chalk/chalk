import {test} from 'node:test';
import assert from 'node:assert/strict';
import chalk, {Chalk} from '../source/index.js';

chalk.level = 1;

test('visible: normal output when level > 0', () => {
	const instance = new Chalk({level: 3});
	assert.equal(instance.visible.red('foo'), '\u{1B}[31mfoo\u{1B}[39m');
	assert.equal(instance.red.visible('foo'), '\u{1B}[31mfoo\u{1B}[39m');
});

test('visible: no output when level is too low', () => {
	const instance = new Chalk({level: 0});
	assert.equal(instance.visible.red('foo'), '');
	assert.equal(instance.red.visible('foo'), '');
});

test('test switching back and forth between level == 0 and level > 0', () => {
	const instance = new Chalk({level: 3});
	assert.equal(instance.red('foo'), '\u{1B}[31mfoo\u{1B}[39m');
	assert.equal(instance.visible.red('foo'), '\u{1B}[31mfoo\u{1B}[39m');
	assert.equal(instance.red.visible('foo'), '\u{1B}[31mfoo\u{1B}[39m');
	assert.equal(instance.visible('foo'), 'foo');
	assert.equal(instance.red('foo'), '\u{1B}[31mfoo\u{1B}[39m');

	instance.level = 0;
	assert.equal(instance.red('foo'), 'foo');
	assert.equal(instance.visible('foo'), '');
	assert.equal(instance.visible.red('foo'), '');
	assert.equal(instance.red.visible('foo'), '');
	assert.equal(instance.red('foo'), 'foo');

	instance.level = 3;
	assert.equal(instance.red('foo'), '\u{1B}[31mfoo\u{1B}[39m');
	assert.equal(instance.visible.red('foo'), '\u{1B}[31mfoo\u{1B}[39m');
	assert.equal(instance.red.visible('foo'), '\u{1B}[31mfoo\u{1B}[39m');
	assert.equal(instance.visible('foo'), 'foo');
	assert.equal(instance.red('foo'), '\u{1B}[31mfoo\u{1B}[39m');
});
