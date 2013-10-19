/*global describe, it */
'use strict';
var assert = require('assert');
var chalk = require('./chalk');

describe('chalk', function () {
	it('should style string', function () {
		assert.equal(chalk.underline('foo'), '\x1b[4mfoo\x1b[24m');
		assert.equal(chalk.red('foo'), '\x1b[31mfoo\x1b[39m');
		assert.equal(chalk.bgRed('foo'), '\x1b[41mfoo\x1b[49m');
	});

	it('should support applying multiple styles at once', function () {
		assert.equal(chalk.red.bgGreen.underline('foo'), '\x1b[4m\x1b[42m\x1b[31mfoo\x1b[39m\x1b[49m\x1b[24m');
		assert.equal(chalk.underline.red.bgGreen('foo'), '\x1b[42m\x1b[31m\x1b[4mfoo\x1b[24m\x1b[39m\x1b[49m');
	});

	it('should support nesting styles', function () {
		assert.equal(
			chalk.red('foo' + chalk.underline.bgBlue('bar') + '!'),
			'\x1b[31mfoo\x1b[44m\x1b[4mbar\x1b[24m\x1b[49m!\x1b[39m'
		);
	});

	it('should reset all styles with `.reset()`', function () {
		assert.equal(chalk.reset(chalk.red.bgGreen.underline('foo') + 'foo'), '\x1b[0m\x1b[4m\x1b[42m\x1b[31mfoo\x1b[39m\x1b[49m\x1b[24mfoo\x1b[0m');
	});

	it('should alias gray to grey', function () {
		assert.equal(chalk.grey('foo'), '\x1b[90mfoo\x1b[39m');
	});

	it('should support variable number of arguments', function () {
		assert.equal(chalk.red('foo', 'bar'), '\x1b[31mfoo bar\x1b[39m');
	});

	it('should support falsy values', function () {
		assert.equal(chalk.red(0), '\x1b[31m0\x1b[39m');
	});
});

describe('chalk.enabled', function () {
	it('should not output colors when manually disabled', function () {
		chalk.enabled = false;
		assert.equal(chalk.red('foo'), 'foo');
		chalk.enabled = true;
	});
});

describe('chalk.styles', function () {
	it('should expose the styles as ANSI escape codes', function () {
		assert.equal(chalk.styles.red[0], '\x1b[31m');
	});
});

describe('chalk.stripColor()', function () {
	it('should strip color from string', function () {
		assert.equal(chalk.stripColor(chalk.underline.red.bgGreen('foo')), 'foo');
	});
});
