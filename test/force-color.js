import {fileURLToPath} from 'node:url';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execaNode} from 'execa';

const fixture = fileURLToPath(new URL('_force-color-fixture.js', import.meta.url));

// The environment is not extended so that the ambient `CI`, `TERM`, and `COLORTERM` of the machine running the tests cannot leak into the fixture.
const detectLevel = async (environment, flags = []) => {
	const {stdout} = await execaNode(fixture, flags, {env: environment, extendEnv: false});
	return stdout;
};

test('`FORCE_COLOR=1` is an exact level, not a minimum', async () => {
	assert.equal(await detectLevel({FORCE_COLOR: '1', COLORTERM: 'truecolor'}), '1');
});

test('`FORCE_COLOR=2` is an exact level, not a minimum', async () => {
	assert.equal(await detectLevel({FORCE_COLOR: '2', COLORTERM: 'truecolor'}), '2');
});

test('`FORCE_COLOR=3` enables truecolor', async () => {
	assert.equal(await detectLevel({FORCE_COLOR: '3'}), '3');
});

test('`FORCE_COLOR=1` overrides CI detection', async () => {
	assert.equal(await detectLevel({FORCE_COLOR: '1', CI: 'true', GITHUB_ACTIONS: 'true'}), '1');
});

test('`FORCE_COLOR=1` overrides TERM detection', async () => {
	assert.equal(await detectLevel({FORCE_COLOR: '1', TERM: 'xterm-256color'}), '1');
});

test('a `FORCE_COLOR` above 3 is clamped to 3', async () => {
	assert.equal(await detectLevel({FORCE_COLOR: '4', TERM: 'xterm-256color'}), '3');
});

test('the `--color=256` and `--color=16m` flags take precedence over a numeric `FORCE_COLOR`', async () => {
	assert.equal(await detectLevel({FORCE_COLOR: '1'}, ['--color=256']), '2');
	assert.equal(await detectLevel({FORCE_COLOR: '1'}, ['--color=16m']), '3');
});

test('`FORCE_COLOR=0` disables color', async () => {
	assert.equal(await detectLevel({FORCE_COLOR: '0', COLORTERM: 'truecolor'}), '0');
});

test('`FORCE_COLOR=true` only enables color and lets the level be detected', async () => {
	assert.equal(await detectLevel({FORCE_COLOR: 'true', COLORTERM: 'truecolor'}), '3');
	assert.equal(await detectLevel({FORCE_COLOR: 'true', TERM: 'xterm-256color'}), '2');
	assert.equal(await detectLevel({FORCE_COLOR: 'true'}), '1');
});

test('an empty `FORCE_COLOR` behaves like `FORCE_COLOR=true`', async () => {
	assert.equal(await detectLevel({FORCE_COLOR: '', COLORTERM: 'truecolor'}), '3');
});

test('`FORCE_COLOR=false` disables color', async () => {
	assert.equal(await detectLevel({FORCE_COLOR: 'false', COLORTERM: 'truecolor'}), '0');
});

test('a non-numeric `FORCE_COLOR` is treated as unset, not as disabled', async () => {
	assert.equal(await detectLevel({FORCE_COLOR: 'unicorn', COLORTERM: 'truecolor'}), '0');

	// The fixture is piped, so unset and disabled both give 0. The Azure check sits above the non-TTY check, so it tells the two apart.
	assert.equal(await detectLevel({FORCE_COLOR: 'unicorn', TF_BUILD: '1', AGENT_NAME: 'agent'}), '1');
	assert.equal(await detectLevel({FORCE_COLOR: '0', TF_BUILD: '1', AGENT_NAME: 'agent'}), '0');
});

test('a partly numeric `FORCE_COLOR` is treated as unset, not as a level', async () => {
	/* eslint-disable node-test/no-conditional-assertion -- The table is a non-empty literal, so the loop always runs and every case is asserted. */
	for (const forceColor of [' 2', '2 ', '2abc', '+2', '1e1', '0x2']) {
		// eslint-disable-next-line no-await-in-loop
		const [piped, azure] = await Promise.all([
			detectLevel({FORCE_COLOR: forceColor, COLORTERM: 'truecolor'}),
			detectLevel({FORCE_COLOR: forceColor, TF_BUILD: '1', AGENT_NAME: 'agent'}),
		]);

		assert.equal(piped, '0', `FORCE_COLOR=${forceColor}`);
		assert.equal(azure, '1', `FORCE_COLOR=${forceColor}`);
	}
	/* eslint-enable node-test/no-conditional-assertion */
});
