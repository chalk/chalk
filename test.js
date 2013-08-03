/*global describe, it */
'use strict';
var assert = require('assert');
var chalk = require('./chalk');

describe('chalk', function () {
	it('should style string', function () {
		assert.equal(chalk.underline('foo'), '\x1b[4mfoo\x1b[0m');
		assert.equal(chalk.red('foo'), '\x1b[31mfoo\x1b[0m');
		assert.equal(chalk.bgRed('foo'), '\x1b[41mfoo\x1b[0m');
	});

	it('should support applying multiple styles at once', function () {
		assert.equal(chalk.red.bgGreen.underline('foo'), '\x1b[4m\x1b[42m\x1b[31mfoo\x1b[0m');
		assert.equal(chalk.underline.red.bgGreen('foo'), '\x1b[42m\x1b[31m\x1b[4mfoo\x1b[0m');
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
		assert.equal(chalk.styles.red, '\x1b[31m');
	});
});

describe('chalk.stripColor()', function () {
	it('should strip color from string', function () {
		assert.equal(chalk.stripColor(chalk.underline.red.bgGreen('foo')), 'foo');
	});
});
