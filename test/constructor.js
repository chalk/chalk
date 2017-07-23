import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname);

const m = require('..');

test('create an isolated context where colors can be disabled (by level)', t => {
	const ctx = new m.constructor({level: 0, enabled: true});
	t.is(ctx.red('foo'), 'foo');
	t.is(m.red('foo'), '\u001B[31mfoo\u001B[39m');
	ctx.level = 2;
	t.is(ctx.red('foo'), '\u001B[31mfoo\u001B[39m');
});

test('create an isolated context where colors can be disabled (by enabled flag)', t => {
	const ctx = new m.constructor({enabled: false});
	t.is(ctx.red('foo'), 'foo');
	t.is(m.red('foo'), '\u001B[31mfoo\u001B[39m');
	ctx.enabled = true;
	t.is(ctx.red('foo'), '\u001B[31mfoo\u001B[39m');
});
