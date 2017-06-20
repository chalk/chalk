'use strict';
var assert = require('assert');
var importFresh = require('import-fresh');
var resolveFrom = require('resolve-from');
var semver = require('semver');
var chalk = require('.');

describe('chalk', function () {
	it('should style string', function () {
		assert.equal(chalk.underline('foo'), '\u001b[4mfoo\u001b[24m');
		assert.equal(chalk.red('foo'), '\u001b[31mfoo\u001b[39m');
		assert.equal(chalk.bgRed('foo'), '\u001b[41mfoo\u001b[49m');
	});

	it('should support applying multiple styles at once', function () {
		assert.equal(chalk.red.bgGreen.underline('foo'), '\u001b[31m\u001b[42m\u001b[4mfoo\u001b[24m\u001b[49m\u001b[39m');
		assert.equal(chalk.underline.red.bgGreen('foo'), '\u001b[4m\u001b[31m\u001b[42mfoo\u001b[49m\u001b[39m\u001b[24m');
	});

	it('should support nesting styles', function () {
		assert.equal(
			chalk.red('foo' + chalk.underline.bgBlue('bar') + '!'),
			'\u001b[31mfoo\u001b[4m\u001b[44mbar\u001b[49m\u001b[24m!\u001b[39m'
		);
	});

	it('should support nesting styles of the same type (color, underline, bg)', function () {
		assert.equal(
			chalk.red('a' + chalk.yellow('b' + chalk.green('c') + 'b') + 'c'),
			'\u001b[31ma\u001b[33mb\u001b[32mc\u001b[33mb\u001b[31mc\u001b[39m'
		);
	});

	it('should reset all styles with `.reset()`', function () {
		assert.equal(chalk.reset(chalk.red.bgGreen.underline('foo') + 'foo'), '\u001b[0m\u001b[31m\u001b[42m\u001b[4mfoo\u001b[24m\u001b[49m\u001b[39mfoo\u001b[0m');
	});

	it('should be able to cache multiple styles', function () {
		var red = chalk.red;
		var green = chalk.green;
		var redBold = red.bold;
		var greenBold = green.bold;

		assert.notEqual(red('foo'), green('foo'));
		assert.notEqual(redBold('bar'), greenBold('bar'));
		assert.notEqual(green('baz'), greenBold('baz'));
	});

	it('should alias gray to grey', function () {
		assert.equal(chalk.grey('foo'), '\u001b[90mfoo\u001b[39m');
	});

	it('should support variable number of arguments', function () {
		assert.equal(chalk.red('foo', 'bar'), '\u001b[31mfoo bar\u001b[39m');
	});

	it('should support falsy values', function () {
		assert.equal(chalk.red(0), '\u001b[31m0\u001b[39m');
	});

	it('shouldn\'t output escape codes if the input is empty', function () {
		assert.equal(chalk.red(), '');
		assert.equal(chalk.red.blue.black(), '');
	});

	it('should keep Function.prototype methods', function () {
		assert.equal(chalk.grey.apply(null, ['foo']), '\u001b[90mfoo\u001b[39m');
		assert.equal(chalk.reset(chalk.red.bgGreen.underline.bind(null)('foo') + 'foo'), '\u001b[0m\u001b[31m\u001b[42m\u001b[4mfoo\u001b[24m\u001b[49m\u001b[39mfoo\u001b[0m');
		assert.equal(chalk.red.blue.black.call(null), '');
	});

	it('line breaks should open and close colors', function () {
		assert.equal(chalk.grey('hello\nworld'), '\u001b[90mhello\u001b[39m\n\u001b[90mworld\u001b[39m');
	});

	it('should properly convert RGB to 16 colors on basic color terminals', function () {
		assert.equal(new chalk.constructor({level: 1}).hex('#FF0000')('hello'), '\u001b[91mhello\u001b[39m');
		assert.equal(new chalk.constructor({level: 1}).bgHex('#FF0000')('hello'), '\u001b[101mhello\u001b[49m');
	});

	it('should properly convert RGB to 256 colors on basic color terminals', function () {
		assert.equal(new chalk.constructor({level: 2}).hex('#FF0000')('hello'), '\u001b[38;5;196mhello\u001b[39m');
		assert.equal(new chalk.constructor({level: 2}).bgHex('#FF0000')('hello'), '\u001b[48;5;196mhello\u001b[49m');
	});

	it('should properly convert RGB to 256 colors on basic color terminals', function () {
		assert.equal(new chalk.constructor({level: 3}).hex('#FF0000')('hello'), '\u001b[38;2;255;0;0mhello\u001b[39m');
		assert.equal(new chalk.constructor({level: 3}).bgHex('#FF0000')('hello'), '\u001b[48;2;255;0;0mhello\u001b[49m');
	});

	it('should not emit RGB codes if level is 0', function () {
		assert.equal(new chalk.constructor({level: 0}).hex('#FF0000')('hello'), 'hello');
		assert.equal(new chalk.constructor({level: 0}).bgHex('#FF0000')('hello'), 'hello');
	});
});

describe('chalk on windows', function () {
	var originalEnv;
	var originalPlatform;

	// in node versions older than 0.12.x process.platform cannot be overridden
	if (semver.lt(process.version, '0.12.0')) {
		return;
	}

	before(function () {
		originalEnv = process.env;
		originalPlatform = process.platform;
	});

	after(function () {
		process.env = originalEnv;
		Object.defineProperty(process, 'platform', {value: originalPlatform});
	});

	beforeEach(function () {
		process.env = {};
		Object.defineProperty(process, 'platform', {value: 'win32'});
		// since chalk internally modifies ansiStyles.blue.open, ansi-styles needs
		// to be removed from the require cache for require-uncached to work
		delete require.cache[resolveFrom(__dirname, 'ansi-styles')];
	});

	it('should replace blue foreground color in cmd.exe', function () {
		process.env.TERM = 'dumb';
		var chalkCtx = importFresh('.');
		assert.equal(chalkCtx.blue('foo'), '\u001b[94mfoo\u001b[39m');
	});

	it('shouldn\'t replace blue foreground color in xterm based terminals', function () {
		process.env.TERM = 'xterm-256color';
		var chalkCtx = importFresh('.');
		assert.equal(chalkCtx.blue('foo'), '\u001b[34mfoo\u001b[39m');
	});

	it('should not apply dimmed styling on gray strings, see https://github.com/chalk/chalk/issues/58', function () {
		process.env.TERM = 'dumb';
		var chalkCtx = importFresh('.');
		assert.equal(chalkCtx.gray.dim('foo'), '\u001b[90mfoo\u001b[22m\u001b[39m');
	});

	it('should apply dimmed styling on xterm compatible terminals', function () {
		process.env.TERM = 'xterm';
		var chalkCtx = importFresh('.');
		assert.equal(chalkCtx.gray.dim('foo'), '\u001b[90m\u001b[2mfoo\u001b[22m\u001b[39m');
	});

	it('should apply dimmed styling on strings of other colors', function () {
		process.env.TERM = 'dumb';
		var chalkCtx = importFresh('.');
		assert.equal(chalkCtx.blue.dim('foo'), '\u001b[94m\u001b[2mfoo\u001b[22m\u001b[39m');
	});
});

describe('chalk.level', function () {
	it('should not output colors when manually disabled', function () {
		var oldLevel = chalk.level;
		chalk.level = 0;
		assert.equal(chalk.red('foo'), 'foo');
		chalk.level = oldLevel;
	});

	it('should enable/disable colors based on overall chalk enabled property, not individual instances', function () {
		var oldLevel = chalk.level;
		chalk.level = 1;
		var red = chalk.red;
		assert.equal(red.level, 1);
		chalk.level = 0;
		assert.equal(red.level, chalk.level);
		chalk.level = oldLevel;
	});

	it('should propagate enable/disable changes from child colors', function () {
		var oldLevel = chalk.level;
		chalk.level = 1;
		var red = chalk.red;
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

describe('chalk.constructor', function () {
	it('should create a isolated context where colors can be disabled', function () {
		var ctx = new chalk.constructor({level: 0});
		assert.equal(ctx.red('foo'), 'foo');
		assert.equal(chalk.red('foo'), '\u001b[31mfoo\u001b[39m');
	});
});

describe('chalk.styles', function () {
	it('should expose the styles as ANSI escape codes', function () {
		assert.equal(chalk.styles.red.open, '\u001b[31m');
	});
});
