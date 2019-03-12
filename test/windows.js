import test from 'ava';
import importFresh from 'import-fresh';
import resolveFrom from 'resolve-from';

// Spoof supports-color
require('./_supports-color')(__dirname);

let originalEnv;
let originalPlatform;

test.before(() => {
	originalEnv = process.env;
	originalPlatform = process.platform;
});

test.after(() => {
	process.env = originalEnv;
	Object.defineProperty(process, 'platform', {value: originalPlatform});
});

test.beforeEach(() => {
	process.env = {};
	Object.defineProperty(process, 'platform', {value: 'win32'});
	// Since chalk internally modifies `ansiStyles.blue.open`, `ansi-styles` needs
	// to be removed from the require cache for `require-uncached` to work
	delete require.cache[resolveFrom(__dirname, 'ansi-styles')];
});

test('detect a simple term if TERM isn\'t set', t => {
	delete process.env.TERM;
	const chalk = importFresh('..');
	t.is(chalk.blue('foo'), '\u001B[34mfoo\u001B[39m');
});

test('don\'t apply dimmed styling on gray strings, see https://github.com/chalk/chalk/issues/58', t => {
	process.env.TERM = 'dumb';
	const chalk = importFresh('..');
	t.is(chalk.gray.dim('foo'), '\u001B[90mfoo\u001B[22m\u001B[39m');
});

test('apply dimmed styling on xterm compatible terminals', t => {
	process.env.TERM = 'xterm';
	const chalk = importFresh('..');
	t.is(chalk.gray.dim('foo'), '\u001B[90m\u001B[2mfoo\u001B[22m\u001B[39m');
});

test('apply dimmed styling on strings of other colors', t => {
	process.env.TERM = 'dumb';
	const chalk = importFresh('..');
	t.is(chalk.blue.dim('foo'), '\u001B[34m\u001B[2mfoo\u001B[22m\u001B[39m');
});
