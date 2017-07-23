import path from 'path';
import test from 'ava';
import execa from 'execa';
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

test('don\'t output colors when manually disabled', t => {
	const oldLevel = m.level;
	m.level = 0;
	t.is(m.red('foo'), 'foo');
	m.level = oldLevel;
});

test('enable/disable colors based on overall chalk enabled property, not individual instances', t => {
	const oldLevel = m.level;
	m.level = 1;
	const red = m.red;
	t.is(red.level, 1);
	m.level = 0;
	t.is(red.level, m.level);
	m.level = oldLevel;
});

test('propagate enable/disable changes from child colors', t => {
	const oldLevel = m.level;
	m.level = 1;
	const red = m.red;
	t.is(red.level, 1);
	t.is(m.level, 1);
	red.level = 0;
	t.is(red.level, 0);
	t.is(m.level, 0);
	m.level = 1;
	t.is(red.level, 1);
	t.is(m.level, 1);
	m.level = oldLevel;
});

test.failing('disable colors if they are not supported', async t => {
	t.is(await execa.stdout('node', [path.join(__dirname, '_fixture')]), 'test');
});
