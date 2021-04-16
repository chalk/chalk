import test from 'ava';
import chalk from '../source/index.js';

test('Chalk.constructor should throw an expected error', t => {
	const expectedError = t.throws(() => {
		chalk.constructor();
	});

	t.is(expectedError.message, '`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.');

	t.throws(() => {
		new chalk.constructor(); // eslint-disable-line no-new
	});
});
