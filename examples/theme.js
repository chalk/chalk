import chalk from '../source/index.js';

// Set color level to enable colors (adjust based on terminal support)
chalk.level = 3;

// Define a custom theme with named styles
const themedChalk = chalk.theme({
	error: chalk.red.bold,
	success: chalk.green,
	warning: chalk.yellow.underline,
	info: chalk.blue,
	title: chalk.magenta.bold.underline,
});

// Demonstrate the theme in action
console.log(themedChalk.title('Chalk Theme Example'));
console.log(); // Empty line

console.log(themedChalk.error('This is an error message'));
console.log(themedChalk.success('This is a success message'));
console.log(themedChalk.warning('This is a warning message'));
console.log(themedChalk.info('This is an info message'));
console.log(); // Empty line

// Show that original styles still work
console.log(themedChalk.red('Still works with original styles'));
console.log(themedChalk.bold('Bold text from themed chalk'));

// Demonstrate chaining with theme styles
console.log(themedChalk.error.bgWhite('Error on white background'));
console.log(themedChalk.success.underline('Underlined success'));

console.log();
console.log(themedChalk.title('Theme Complete!'));
