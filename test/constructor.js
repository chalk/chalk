import test from 'ava';

const chalk = require('..');

test('Chalk.constructor should throw an expected error', t => {
	const expectedError = t.throws(() => {
		chalk.constructor();
	});

	t.is(expectedError.message, 'Chalk.constructor() is deprecated. Use new Chalk.Instance() instead.');

	t.throws(() => {
		new chalk.constructor(); // eslint-disable-line no-new
	});
});
