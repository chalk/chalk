import test from 'ava';
import resolveFrom from 'resolve-from';

// Spoof supports-color
require.cache[resolveFrom(__dirname, 'supports-color')] = {
	exports: {
		level: 3,
		hasBasic: true,
		has256: true,
		has16m: true
	}
};

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
