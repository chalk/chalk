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

test('don\'t output colors when manually disabled', t => {
	m.enabled = false;
	t.is(m.red('foo'), 'foo');
	m.enabled = true;
});

test('enable/disable colors based on overall chalk enabled property, not individual instances', t => {
	m.enabled = false;
	const red = m.red;
	t.false(red.enabled);
	m.enabled = true;
	t.true(red.enabled);
	m.enabled = true;
});

test('propagate enable/disable changes from child colors', t => {
	m.enabled = false;
	const red = m.red;
	t.false(red.enabled);
	t.false(m.enabled);
	red.enabled = true;
	t.true(red.enabled);
	t.true(m.enabled);
	m.enabled = false;
	t.false(red.enabled);
	t.false(m.enabled);
	m.enabled = true;
});
