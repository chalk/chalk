import path from 'path';
import test from 'ava';
import execa from 'execa';

// Spoof supports-color
require('./_supports-color')(__dirname);

const chalkStderr = require('../stderr');

test('stderr don\'t output colors when manually disabled', t => {
	chalkStderr.enabled = false;
	t.is(chalkStderr.red('foo'), 'foo');
	chalkStderr.enabled = true;
});

test('stderr enable/disable colors based on overall chalk enabled property, not individual instances', t => {
	chalkStderr.enabled = false;
	const {red} = chalkStderr;
	t.false(red.enabled);
	chalkStderr.enabled = true;
	t.true(red.enabled);
	chalkStderr.enabled = true;
});

test('disable colors if they are not supported', async t => {
	t.is(await execa.stderr('node', [path.join(__dirname, '_fixture')]), 'test stderr');
});
