import {fileURLToPath} from 'node:url';
import test from 'ava';
import {execaNode} from 'execa';

const fixturePath = fileURLToPath(new URL('_force-color-fixture.js', import.meta.url));

test('FORCE_COLOR=0 disables color support', async t => {
	const {stdout} = await execaNode(fixturePath, {
		env: {FORCE_COLOR: '0', COLORTERM: 'truecolor'},
	});
	t.is(stdout, 'false');
});

test('FORCE_COLOR=1 gives exactly level 1 even with truecolor terminal', async t => {
	const {stdout} = await execaNode(fixturePath, {
		env: {FORCE_COLOR: '1', COLORTERM: 'truecolor'},
	});
	const result = JSON.parse(stdout);
	t.is(result.level, 1);
	t.true(result.hasBasic);
	t.false(result.has256);
	t.false(result.has16m);
});

test('FORCE_COLOR=2 gives exactly level 2 even with truecolor terminal', async t => {
	const {stdout} = await execaNode(fixturePath, {
		env: {FORCE_COLOR: '2', COLORTERM: 'truecolor'},
	});
	const result = JSON.parse(stdout);
	t.is(result.level, 2);
	t.true(result.hasBasic);
	t.true(result.has256);
	t.false(result.has16m);
});

test('FORCE_COLOR=3 gives exactly level 3', async t => {
	const {stdout} = await execaNode(fixturePath, {
		env: {FORCE_COLOR: '3'},
	});
	const result = JSON.parse(stdout);
	t.is(result.level, 3);
	t.true(result.hasBasic);
	t.true(result.has256);
	t.true(result.has16m);
});
