import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname);

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
