import path from 'path';
import test from 'ava';
import execa from 'execa';

// Spoof supports-color
require('./_supports-color')(__dirname);

const cherr = require('../stderr');

test('stderr don\'t output colors when manually disabled', t => {
	cherr.enabled = false;
	t.is(cherr.red('foo'), 'foo');
	cherr.enabled = true;
});

test('stderr enable/disable colors based on overall chalk enabled property, not individual instances', t => {
	cherr.enabled = false;
	const {red} = cherr;
	t.false(red.enabled);
	cherr.enabled = true;
	t.true(red.enabled);
	cherr.enabled = true;
});

test('disable colors if they are not supported', async t => {
	t.is(await execa.stderr('node', [path.join(__dirname, '_fixture')]), 'test stderr');
});
