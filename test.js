'use strict';
const assert = require('assert');
const importFresh = require('import-fresh');
const resolveFrom = require('resolve-from');

// Spoof supports-color
require.cache[resolveFrom(__dirname, 'supports-color')] = {
	exports: {
		level: 3,
		hasBasic: true,
		has256: true,
		has16m: true
	}
};

const chalk = require('.');

console.log('host TERM=', process.env.TERM || '[none]');
console.log('host platform=', process.platform || '[unknown]');

describe('chalk', () => {
	it('should not add any styling when called as the base function', () => {
		assert.equal(chalk('foo'), 'foo');
	});

	it('should style string', () => {
		assert.equal(chalk.underline('foo'), '\u001B[4mfoo\u001B[24m');
		assert.equal(chalk.red('foo'), '\u001B[31mfoo\u001B[39m');
		assert.equal(chalk.bgRed('foo'), '\u001B[41mfoo\u001B[49m');
	});

	it('should support applying multiple styles at once', () => {
		assert.equal(chalk.red.bgGreen.underline('foo'), '\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39m');
		assert.equal(chalk.underline.red.bgGreen('foo'), '\u001B[4m\u001B[31m\u001B[42mfoo\u001B[49m\u001B[39m\u001B[24m');
	});

	it('should support nesting styles', () => {
		assert.equal(
			chalk.red('foo' + chalk.underline.bgBlue('bar') + '!'),
			'\u001B[31mfoo\u001B[4m\u001B[44mbar\u001B[49m\u001B[24m!\u001B[39m'
		);
	});

	it('should support nesting styles of the same type (color, underline, bg)', () => {
		assert.equal(
			chalk.red('a' + chalk.yellow('b' + chalk.green('c') + 'b') + 'c'),
			'\u001B[31ma\u001B[33mb\u001B[32mc\u001B[33mb\u001B[31mc\u001B[39m'
		);
	});

	it('should reset all styles with `.reset()`', () => {
		assert.equal(chalk.reset(chalk.red.bgGreen.underline('foo') + 'foo'), '\u001B[0m\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39mfoo\u001B[0m');
	});

	it('should be able to cache multiple styles', () => {
		const red = chalk.red;
		const green = chalk.green;
		const redBold = red.bold;
		const greenBold = green.bold;

		assert.notEqual(red('foo'), green('foo'));
		assert.notEqual(redBold('bar'), greenBold('bar'));
		assert.notEqual(green('baz'), greenBold('baz'));
	});

	it('should alias gray to grey', () => {
		assert.equal(chalk.grey('foo'), '\u001B[90mfoo\u001B[39m');
	});

	it('should support variable number of arguments', () => {
		assert.equal(chalk.red('foo', 'bar'), '\u001B[31mfoo bar\u001B[39m');
	});

	it('should support falsy values', () => {
		assert.equal(chalk.red(0), '\u001B[31m0\u001B[39m');
	});

	it('shouldn\'t output escape codes if the input is empty', () => {
		assert.equal(chalk.red(), '');
		assert.equal(chalk.red.blue.black(), '');
	});

	it('should keep Function.prototype methods', () => {
		assert.equal(chalk.grey.apply(null, ['foo']), '\u001B[90mfoo\u001B[39m');
		assert.equal(chalk.reset(chalk.red.bgGreen.underline.bind(null)('foo') + 'foo'), '\u001B[0m\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39mfoo\u001B[0m');
		assert.equal(chalk.red.blue.black.call(null), '');
	});

	it('line breaks should open and close colors', () => {
		assert.equal(chalk.grey('hello\nworld'), '\u001B[90mhello\u001B[39m\n\u001B[90mworld\u001B[39m');
	});

	it('should properly convert RGB to 16 colors on basic color terminals', () => {
		assert.equal(new chalk.constructor({level: 1}).hex('#FF0000')('hello'), '\u001B[91mhello\u001B[39m');
		assert.equal(new chalk.constructor({level: 1}).bgHex('#FF0000')('hello'), '\u001B[101mhello\u001B[49m');
	});

	it('should properly convert RGB to 256 colors on basic color terminals', () => {
		assert.equal(new chalk.constructor({level: 2}).hex('#FF0000')('hello'), '\u001B[38;5;196mhello\u001B[39m');
		assert.equal(new chalk.constructor({level: 2}).bgHex('#FF0000')('hello'), '\u001B[48;5;196mhello\u001B[49m');
	});

	it('should properly convert RGB to 256 colors on basic color terminals', () => {
		assert.equal(new chalk.constructor({level: 3}).hex('#FF0000')('hello'), '\u001B[38;2;255;0;0mhello\u001B[39m');
		assert.equal(new chalk.constructor({level: 3}).bgHex('#FF0000')('hello'), '\u001B[48;2;255;0;0mhello\u001B[49m');
	});

	it('should not emit RGB codes if level is 0', () => {
		assert.equal(new chalk.constructor({level: 0}).hex('#FF0000')('hello'), 'hello');
		assert.equal(new chalk.constructor({level: 0}).bgHex('#FF0000')('hello'), 'hello');
	});
});

describe('chalk on windows', () => {
	let originalEnv;
	let originalPlatform;

	before(() => {
		originalEnv = process.env;
		originalPlatform = process.platform;
	});

	after(() => {
		process.env = originalEnv;
		Object.defineProperty(process, 'platform', {value: originalPlatform});
	});

	beforeEach(() => {
		process.env = {};
		Object.defineProperty(process, 'platform', {value: 'win32'});
		// Since chalk internally modifies `ansiStyles.blue.open`, `ansi-styles` needs
		// to be removed from the require cache for `require-uncached` to work
		delete require.cache[resolveFrom(__dirname, 'ansi-styles')];
	});

	it('should replace blue foreground color in cmd.exe', () => {
		process.env.TERM = 'dumb';
		const chalkCtx = importFresh('.');
		assert.equal(chalkCtx.blue('foo'), '\u001B[94mfoo\u001B[39m');
	});

	it('shouldn\'t replace blue foreground color in xterm based terminals', () => {
		process.env.TERM = 'xterm-256color';
		const chalkCtx = importFresh('.');
		assert.equal(chalkCtx.blue('foo'), '\u001B[34mfoo\u001B[39m');
	});

	it('should not apply dimmed styling on gray strings, see https://github.com/chalk/chalk/issues/58', () => {
		process.env.TERM = 'dumb';
		const chalkCtx = importFresh('.');
		assert.equal(chalkCtx.gray.dim('foo'), '\u001B[90mfoo\u001B[22m\u001B[39m');
	});

	it('should apply dimmed styling on xterm compatible terminals', () => {
		process.env.TERM = 'xterm';
		const chalkCtx = importFresh('.');
		assert.equal(chalkCtx.gray.dim('foo'), '\u001B[90m\u001B[2mfoo\u001B[22m\u001B[39m');
	});

	it('should apply dimmed styling on strings of other colors', () => {
		process.env.TERM = 'dumb';
		const chalkCtx = importFresh('.');
		assert.equal(chalkCtx.blue.dim('foo'), '\u001B[94m\u001B[2mfoo\u001B[22m\u001B[39m');
	});
});

describe('chalk.level', () => {
	it('should not output colors when manually disabled', () => {
		const oldLevel = chalk.level;
		chalk.level = 0;
		assert.equal(chalk.red('foo'), 'foo');
		chalk.level = oldLevel;
	});

	it('should enable/disable colors based on overall chalk enabled property, not individual instances', () => {
		const oldLevel = chalk.level;
		chalk.level = 1;
		const red = chalk.red;
		assert.equal(red.level, 1);
		chalk.level = 0;
		assert.equal(red.level, chalk.level);
		chalk.level = oldLevel;
	});

	it('should propagate enable/disable changes from child colors', () => {
		const oldLevel = chalk.level;
		chalk.level = 1;
		const red = chalk.red;
		assert.equal(red.level, 1);
		assert.equal(chalk.level, 1);
		red.level = 0;
		assert.equal(red.level, 0);
		assert.equal(chalk.level, 0);
		chalk.level = 1;
		assert.equal(red.level, 1);
		assert.equal(chalk.level, 1);
		chalk.level = oldLevel;
	});
});

describe('chalk.enabled', () => {
	it('should not output colors when manually disabled', () => {
		chalk.enabled = false;
		assert.equal(chalk.red('foo'), 'foo');
		chalk.enabled = true;
	});

	it('should enable/disable colors based on overall chalk enabled property, not individual instances', () => {
		chalk.enabled = false;
		const red = chalk.red;
		assert.equal(red.enabled, false);
		chalk.enabled = true;
		assert.equal(red.enabled, true);
		chalk.enabled = true;
	});

	it('should propagate enable/disable changes from child colors', () => {
		chalk.enabled = false;
		const red = chalk.red;
		assert.equal(red.enabled, false);
		assert.equal(chalk.enabled, false);
		red.enabled = true;
		assert.equal(red.enabled, true);
		assert.equal(chalk.enabled, true);
		chalk.enabled = false;
		assert.equal(red.enabled, false);
		assert.equal(chalk.enabled, false);
		chalk.enabled = true;
	});
});

describe('chalk.constructor', () => {
	it('should create an isolated context where colors can be disabled (by level)', () => {
		const ctx = new chalk.constructor({level: 0, enabled: true});
		assert.equal(ctx.red('foo'), 'foo');
		assert.equal(chalk.red('foo'), '\u001B[31mfoo\u001B[39m');
		ctx.level = 2;
		assert.equal(ctx.red('foo'), '\u001B[31mfoo\u001B[39m');
	});

	it('should create an isolated context where colors can be disabled (by enabled flag)', () => {
		const ctx = new chalk.constructor({enabled: false});
		assert.equal(ctx.red('foo'), 'foo');
		assert.equal(chalk.red('foo'), '\u001B[31mfoo\u001B[39m');
		ctx.enabled = true;
		assert.equal(ctx.red('foo'), '\u001B[31mfoo\u001B[39m');
	});
});

describe('tagged template literal', () => {
	it('should return an empty string for an empty literal', () => {
		const ctx = chalk.constructor();
		assert.equal(ctx``, '');
	});

	it('should return a regular string for a literal with no templates', () => {
		const ctx = chalk.constructor({level: 0});
		assert.equal(ctx`hello`, 'hello');
	});

	it('should correctly perform template parsing', () => {
		const ctx = chalk.constructor({level: 0});
		assert.equal(ctx`{bold Hello, {cyan World!} This is a} test. {green Woo!}`,
			ctx.bold('Hello,', ctx.cyan('World!'), 'This is a') + ' test. ' + ctx.green('Woo!'));
	});

	it('should correctly perform template substitutions', () => {
		const ctx = chalk.constructor({level: 0});
		const name = 'Sindre';
		const exclamation = 'Neat';
		assert.equal(ctx`{bold Hello, {cyan.inverse ${name}!} This is a} test. {green ${exclamation}!}`,
			ctx.bold('Hello,', ctx.cyan.inverse(name + '!'), 'This is a') + ' test. ' + ctx.green(exclamation + '!'));
	});

	it('should correctly parse and evaluate color-convert functions', () => {
		const ctx = chalk.constructor({level: 3});
		assert.equal(ctx`{bold.rgb(144,10,178).inverse Hello, {~inverse there!}}`,
			'\u001B[0m\u001B[1m\u001B[38;2;144;10;178m\u001B[7mHello, ' +
			'\u001B[27m\u001B[39m\u001B[22m\u001B[0m\u001B[0m\u001B[1m' +
			'\u001B[38;2;144;10;178mthere!\u001B[39m\u001B[22m\u001B[0m');

		assert.equal(ctx`{bold.bgRgb(144,10,178).inverse Hello, {~inverse there!}}`,
			'\u001B[0m\u001B[1m\u001B[48;2;144;10;178m\u001B[7mHello, ' +
			'\u001B[27m\u001B[49m\u001B[22m\u001B[0m\u001B[0m\u001B[1m' +
			'\u001B[48;2;144;10;178mthere!\u001B[49m\u001B[22m\u001B[0m');
	});

	it('should properly handle escapes', () => {
		const ctx = chalk.constructor({level: 3});
		assert.equal(ctx`{bold hello \{in brackets\}}`,
			'\u001B[0m\u001B[1mhello {in brackets}\u001B[22m\u001B[0m');
	});

	it('should throw if there is an unclosed block', () => {
		const ctx = chalk.constructor({level: 3});
		try {
			console.log(ctx`{bold this shouldn't appear ever\}`);
			assert.fail();
		} catch (err) {
			assert.equal(err.message, 'literal template has an unclosed block');
		}
	});

	it('should throw if there is an invalid style', () => {
		const ctx = chalk.constructor({level: 3});
		try {
			console.log(ctx`{abadstylethatdoesntexist this shouldn't appear ever}`);
			assert.fail();
		} catch (err) {
			assert.equal(err.message, 'invalid Chalk style: abadstylethatdoesntexist');
		}
	});

	it('should properly style multiline color blocks', () => {
		const ctx = chalk.constructor({level: 3});
		assert.equal(
			ctx`{bold
				Hello! This is a
				${'multiline'} block!
				:)
			} {underline
				I hope you enjoy
			}`,
			'\u001B[0m\u001B[1m\u001B[22m\u001B[0m\n' +
			'\u001B[0m\u001B[1m\t\t\t\tHello! This is a\u001B[22m\u001B[0m\n' +
			'\u001B[0m\u001B[1m\t\t\t\tmultiline block!\u001B[22m\u001B[0m\n' +
			'\u001B[0m\u001B[1m\t\t\t\t:)\u001B[22m\u001B[0m\n' +
			'\u001B[0m\u001B[1m\t\t\t\u001B[22m\u001B[0m\u001B[0m \u001B[0m\u001B[0m\u001B[4m\u001B[24m\u001B[0m\n' +
			'\u001B[0m\u001B[4m\t\t\t\tI hope you enjoy\u001B[24m\u001B[0m\n' +
			'\u001B[0m\u001B[4m\t\t\t\u001B[24m\u001B[0m'
		);
	});

	it('should escape interpolated values', () => {
		const ctx = chalk.constructor({level: 0});
		assert.equal(ctx`Hello {bold hi}`, 'Hello hi');
		assert.equal(ctx`Hello ${'{bold hi}'}`, 'Hello {bold hi}');
	});
});
