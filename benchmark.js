/* globals suite, set, bench */
'use strict';
const chalk = require('.');

suite('chalk', () => {
	set('iterations', 1000000);

	const chalkRed = chalk.red;
	const chalkBgRed = chalk.bgRed;
	const chalkBlueBgRed = chalk.blue.bgRed;
	const chalkBlueBgRedBold = chalk.blue.bgRed.bold;

	const blueStyledString = 'the fox jumps' + chalk.blue('over the lazy dog') + '!';

	bench('1 style', () => {
		chalk.red('the fox jumps over the lazy dog');
	});

	bench('2 styles', () => {
		chalk.blue.bgRed('the fox jumps over the lazy dog');
	});

	bench('3 styles', () => {
		chalk.blue.bgRed.bold('the fox jumps over the lazy dog');
	});

	bench('cached: 1 style', () => {
		chalkRed('the fox jumps over the lazy dog');
	});

	bench('cached: 2 styles', () => {
		chalkBlueBgRed('the fox jumps over the lazy dog');
	});

	bench('cached: 3 styles', () => {
		chalkBlueBgRedBold('the fox jumps over the lazy dog');
	});

	bench('cached: 1 style with newline', () => {
		chalkRed('the fox jumps\nover the lazy dog');
	});

	bench('cached: 1 style nested intersecting', () => {
		chalkRed(blueStyledString);
	});

	bench('cached: 1 style nested non-intersecting', () => {
		chalkBgRed(blueStyledString);
	});
});
