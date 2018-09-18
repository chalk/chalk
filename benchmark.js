/* globals suite, set, bench */
'use strict';
const chalk = require('.');

suite('chalk', () => {
	set('iterations', 100000);

	bench('single style', () => {
		chalk.red('the fox jumps over the lazy dog');
	});

	bench('several styles', () => {
		chalk.blue.bgRed.bold('the fox jumps over the lazy dog');
	});

	const cached = chalk.blue.bgRed.bold;
	bench('cached styles', () => {
		cached('the fox jumps over the lazy dog');
	});

	bench('nested styles', () => {
		chalk.red('the fox jumps', chalk.underline.bgBlue('over the lazy dog') + '!');
	});
});
