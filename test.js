'use strict';
var assert = require('assert');
var chalk = require('./');

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

	it('should be able to cache multiple styles', function() {
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

	it('don\'t output escape codes if the input is empty', function () {
		assert.equal(chalk.red(), '');
	});
});

describe('chalk.enabled', function () {
	it('should not output colors when manually disabled', function () {
		chalk.enabled = false;
		assert.equal(chalk.red('foo'), 'foo');
		chalk.enabled = true;
	});
});

describe('chalk.constructor', function () {
	it('should create a isolated context where colors can be disabled', function () {
		var ctx = new chalk.constructor({enabled: false});
		assert.equal(ctx.red('foo'), 'foo');
		assert.equal(chalk.red('foo'), '\u001b[31mfoo\u001b[39m');
	});
});

describe('chalk.styles', function () {
	it('should expose the styles as ANSI escape codes', function () {
		assert.equal(chalk.styles.red.open, '\u001b[31m');
	});
});

describe('chalk.hasColor()', function () {
	it('should detect whether a string has color', function () {
		assert(chalk.hasColor(chalk.green('foo')));
		assert(!chalk.hasColor(chalk.stripColor(chalk.green('foo'))));
	});
});

describe('chalk.stripColor()', function () {
	it('should strip color from string', function () {
		assert.equal(chalk.stripColor(chalk.underline.red.bgGreen('foo')), 'foo');
	});
});
