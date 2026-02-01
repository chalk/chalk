import chalk from '../source/index.js';

// Set color level to enable gradients (adjust based on terminal support)
chalk.level = 3;

// Demonstrate gradient feature
console.log(chalk.bold('Chalk Gradient Examples'));
console.log();

// Simple two-color gradient
console.log('Two-color gradient:');
console.log(chalk.gradient('#ff0000', '#0000ff')('Hello World'));
console.log();

// RGB array gradient
console.log('RGB array gradient:');
console.log(chalk.gradient([255, 0, 0], [0, 255, 0], [0, 0, 255])('Rainbow Text'));
console.log();

// Multi-color gradient
console.log('Multi-color gradient:');
console.log(chalk.gradient('#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff')('Color Spectrum'));
console.log();

// Combining with other styles
console.log('Gradient with bold:');
console.log(chalk.gradient('#ff0080', '#8000ff').bold('Bold Gradient'));
console.log();

// Gradient on themed chalk
const themedChalk = chalk.theme({
	rainbow: chalk.gradient('#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff'),
});

console.log('Themed gradient:');
console.log(themedChalk.rainbow('Themed Rainbow Text'));
console.log();

console.log(chalk.bold('Gradient Complete!'));
