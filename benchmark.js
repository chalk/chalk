/* globals set bench */
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

	const wrappedChalk = new chalk.constructor({
		wrapper: {
			before: '@',
			after: '#'
		}
	});

	bench('wrapped single style', () => {
		wrappedChalk.red('the fox jumps');
	});

	bench('wrapped several styles', () => {
		wrappedChalk.blue.bgRed.bold('the fox jumps over the lazy dog');
	});

	const cachedWrapper = wrappedChalk.blue.bgRed.bold;
	bench('cached wrapped styles', () => {
		cachedWrapper('the fox jumps over the lazy dog');
	});

	bench('nested wrapped styles', () => {
		wrappedChalk.red('the fox jumps', wrappedChalk.underline.bgBlue('over the lazy dog') + '!');
	});
});
