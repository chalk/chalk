import test from 'ava';
import chalk from '../source/index.js';

chalk.level = 3;

test('theme: creates a themed chalk instance with custom styles', t => {
	const themedChalk = chalk.theme({
		error: chalk.red.bold,
		success: chalk.green,
		warning: chalk.yellow.underline,
	});

	t.is(themedChalk.error('This is an error'), '\u001B[31m\u001B[1mThis is an error\u001B[22m\u001B[39m');
	t.is(themedChalk.success('This is a success'), '\u001B[32mThis is a success\u001B[39m');
	t.is(themedChalk.warning('This is a warning'), '\u001B[33m\u001B[4mThis is a warning\u001B[24m\u001B[39m');

	// Ensure themed chalk still has original styles
	t.is(themedChalk.blue('Blue text'), '\u001B[34mBlue text\u001B[39m');

	// Ensure chaining works on themed
	t.is(themedChalk.error.bgWhite('Error on white'), '\u001B[31m\u001B[1m\u001B[47mError on white\u001B[49m\u001B[22m\u001B[39m');
});
