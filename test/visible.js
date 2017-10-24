import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname);

const m = require('..');

test('visible: normal output when enabled', t => {
	const ctx = new m.constructor({level: 3, enabled: true});
	t.is(ctx.visible.red('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(ctx.red.visible('foo'), '\u001B[31mfoo\u001B[39m');
});

test('visible: no output when disabled', t => {
	const ctx = new m.constructor({level: 3, enabled: false});
	t.is(ctx.red.visible('foo'), '');
	t.is(ctx.visible.red('foo'), '');
});

test('visible: no output when level is too low', t => {
	const ctx = new m.constructor({level: 0, enabled: true});
	t.is(ctx.visible.red('foo'), '');
	t.is(ctx.red.visible('foo'), '');
});
