import {fileURLToPath} from 'node:url';
import test from 'ava';
import {execaNode} from 'execa';

const fixture = fileURLToPath(new URL('_force-color-fixture.js', import.meta.url));

// The environment is not extended so that the ambient `CI`, `TERM`, and `COLORTERM` of the machine running the tests cannot leak into the fixture.
const detectLevel = async (environment, flags = []) => {
	const {stdout} = await execaNode(fixture, flags, {env: environment, extendEnv: false});
	return stdout;
};

test('`FORCE_COLOR=1` is an exact level, not a minimum', async t => {
	t.is(await detectLevel({FORCE_COLOR: '1', COLORTERM: 'truecolor'}), '1');
});

test('`FORCE_COLOR=2` is an exact level, not a minimum', async t => {
	t.is(await detectLevel({FORCE_COLOR: '2', COLORTERM: 'truecolor'}), '2');
});

test('`FORCE_COLOR=3` enables truecolor', async t => {
	t.is(await detectLevel({FORCE_COLOR: '3'}), '3');
});

test('`FORCE_COLOR=1` overrides CI detection', async t => {
	t.is(await detectLevel({FORCE_COLOR: '1', CI: 'true', GITHUB_ACTIONS: 'true'}), '1');
});

test('`FORCE_COLOR=1` overrides TERM detection', async t => {
	t.is(await detectLevel({FORCE_COLOR: '1', TERM: 'xterm-256color'}), '1');
});

test('a `FORCE_COLOR` above 3 is clamped to 3', async t => {
	t.is(await detectLevel({FORCE_COLOR: '4', TERM: 'xterm-256color'}), '3');
});

test('the `--color=256` and `--color=16m` flags take precedence over a numeric `FORCE_COLOR`', async t => {
	t.is(await detectLevel({FORCE_COLOR: '1'}, ['--color=256']), '2');
	t.is(await detectLevel({FORCE_COLOR: '1'}, ['--color=16m']), '3');
});

test('`FORCE_COLOR=0` disables color', async t => {
	t.is(await detectLevel({FORCE_COLOR: '0', COLORTERM: 'truecolor'}), '0');
});

test('`FORCE_COLOR=true` only enables color and lets the level be detected', async t => {
	t.is(await detectLevel({FORCE_COLOR: 'true', COLORTERM: 'truecolor'}), '3');
	t.is(await detectLevel({FORCE_COLOR: 'true', TERM: 'xterm-256color'}), '2');
	t.is(await detectLevel({FORCE_COLOR: 'true'}), '1');
});

test('an empty `FORCE_COLOR` behaves like `FORCE_COLOR=true`', async t => {
	t.is(await detectLevel({FORCE_COLOR: '', COLORTERM: 'truecolor'}), '3');
});

test('`FORCE_COLOR=false` disables color', async t => {
	t.is(await detectLevel({FORCE_COLOR: 'false', COLORTERM: 'truecolor'}), '0');
});

test('a non-numeric `FORCE_COLOR` is treated as unset, not as disabled', async t => {
	t.is(await detectLevel({FORCE_COLOR: 'unicorn', COLORTERM: 'truecolor'}), '0');

	// The fixture is piped, so unset and disabled both give 0. The Azure check sits above the non-TTY check, so it tells the two apart.
	t.is(await detectLevel({FORCE_COLOR: 'unicorn', TF_BUILD: '1', AGENT_NAME: 'agent'}), '1');
	t.is(await detectLevel({FORCE_COLOR: '0', TF_BUILD: '1', AGENT_NAME: 'agent'}), '0');
});
