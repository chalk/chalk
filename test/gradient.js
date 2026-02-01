import test from 'ava';
import chalk from '../source/index.js';

chalk.level = 3;

test('gradient: applies color gradient to text', t => {
	// Test hex gradient
	const gradientHex = chalk.gradient('#ff0000', '#0000ff');
	t.is(gradientHex('ab'), '\u001B[38;2;255;0;0ma\u001B[38;2;0;0;255mb\u001B[39m');

	// Test RGB array gradient
	const gradientRgb = chalk.gradient([255, 0, 0], [0, 0, 255]);
	t.is(gradientRgb('ab'), '\u001B[38;2;255;0;0ma\u001B[38;2;0;0;255mb\u001B[39m');

	// Test multi-color gradient
	const multiGradient = chalk.gradient('#ff0000', '#00ff00', '#0000ff');
	const result = multiGradient('abc');
	t.true(result.includes('\u001B[38;2;255;0;0ma'));
	t.true(result.includes('\u001B[38;2;0;255;0mb'));
	t.true(result.includes('\u001B[38;2;0;0;255mc'));
	t.true(result.endsWith('\u001B[39m'));

	// Test gradient with other styles
	const gradientBold = chalk.gradient('#ff0000', '#0000ff').bold;
	t.is(gradientBold('ab'), '\u001B[1m\u001B[38;2;255;0;0ma\u001B[38;2;0;0;255mb\u001B[39m\u001B[22m');
});

test('gradient: handles edge cases', t => {
	// Single character
	const singleChar = chalk.gradient('#ff0000', '#0000ff');
	t.is(singleChar('a'), '\u001B[38;2;255;0;0ma\u001B[39m');

	// Empty string
	const empty = chalk.gradient('#ff0000', '#0000ff');
	t.is(empty(''), '');

	// Very long text
	const longText = 'a'.repeat(100);
	const longGradient = chalk.gradient('#ff0000', '#0000ff');
	const longResult = longGradient(longText);
	t.true(longResult.startsWith('\u001B[38;2;255;0;0ma'));
	t.true(longResult.endsWith('a\u001B[39m'));
	t.true(longResult.includes('\u001B[38;2;'));
});

test('gradient: supports different color formats', t => {
	// Mixed hex and RGB
	const mixed = chalk.gradient('#ff0000', [0, 255, 0], '#0000ff');
	const mixedResult = mixed('abc');
	t.true(mixedResult.includes('\u001B[38;2;255;0;0ma'));
	t.true(mixedResult.includes('\u001B[38;2;0;255;0mb'));
	t.true(mixedResult.includes('\u001B[38;2;0;0;255mc'));

	// Short hex codes
	const shortHex = chalk.gradient('#f00', '#00f');
	t.is(shortHex('ab'), '\u001B[38;2;255;0;0ma\u001B[38;2;0;0;255mb\u001B[39m');

	// Uppercase hex
	const upperHex = chalk.gradient('#FF0000', '#0000FF');
	t.is(upperHex('ab'), '\u001B[38;2;255;0;0ma\u001B[38;2;0;0;255mb\u001B[39m');
});

test('gradient: works with multiple style chaining', t => {
	// Bold + underline + gradient
	const complex = chalk.gradient('#ff0000', '#0000ff').bold.underline;
	const complexResult = complex('ab');
	t.true(complexResult.includes('\u001B[1m')); // Bold
	t.true(complexResult.includes('\u001B[4m')); // Underline
	t.true(complexResult.includes('\u001B[38;2;255;0;0ma'));
	t.true(complexResult.includes('\u001B[38;2;0;0;255mb'));
	t.true(complexResult.includes('\u001B[24m')); // Underline off
	t.true(complexResult.includes('\u001B[22m')); // Bold off

	// Multiple gradients (nested)
	const nested = chalk.red.bold(chalk.gradient('#ff0000', '#0000ff')('ab'));
	const nestedResult = nested;
	t.true(nestedResult.includes('\u001B[31m')); // Red
	t.true(nestedResult.includes('\u001B[1m')); // Bold
	t.true(nestedResult.includes('\u001B[38;2;255;0;0ma'));
});

test('gradient: handles different color levels', t => {
	// Level 0 (no colors)
	const level0 = new chalk.constructor({level: 0}).gradient('#ff0000', '#0000ff');
	t.is(level0('ab'), 'ab');

	// Level 1 (basic colors)
	const level1 = new chalk.constructor({level: 1}).gradient('#ff0000', '#0000ff');
	const level1Result = level1('ab');
	t.true(level1Result.includes('\u001B[91m')); // Bright red equivalent
	t.true(level1Result.includes('\u001B[94m')); // Bright blue equivalent

	// Level 2 (256 colors)
	const level2 = new chalk.constructor({level: 2}).gradient('#ff0000', '#0000ff');
	const level2Result = level2('ab');
	t.true(level2Result.includes('\u001B[38;5;')); // 256 color codes
});

test('gradient: works with themes', t => {
	const themedChalk = chalk.theme({
		rainbow: chalk.gradient('#ff0000', '#00ff00', '#0000ff'),
		ocean: chalk.gradient('#000080', '#008080', '#00ffff'),
	});

	const rainbowResult = themedChalk.rainbow('abc');
	t.true(rainbowResult.includes('\u001B[38;2;255;0;0ma'));
	t.true(rainbowResult.includes('\u001B[38;2;0;255;0mb'));
	t.true(rainbowResult.includes('\u001B[38;2;0;0;255mc'));

	const oceanResult = themedChalk.ocean('xyz');
	t.true(oceanResult.includes('\u001B[38;2;')); // Should have gradient colors
});

test('gradient: handles special characters and unicode', t => {
	// Unicode characters
	const unicode = chalk.gradient('#ff0000', '#0000ff');
	const unicodeResult = unicode('🚀🌟⭐');
	t.true(unicodeResult.includes('🚀'));
	t.true(unicodeResult.includes('🌟'));
	t.true(unicodeResult.includes('⭐'));
	t.true(unicodeResult.includes('\u001B[38;2;'));

	// Numbers and special chars
	const special = chalk.gradient('#ff0000', '#0000ff');
	const specialResult = special('123!@#');
	t.true(specialResult.includes('1'));
	t.true(specialResult.includes('2'));
	t.true(specialResult.includes('3'));
	t.true(specialResult.includes('!'));
	t.true(specialResult.includes('@'));
	t.true(specialResult.includes('#'));
});

test('gradient: supports background gradients', t => {
	// Note: This tests that gradient works with background colors applied separately
	const bgGradient = chalk.bgRed(chalk.gradient('#ff0000', '#0000ff')('ab'));
	const bgResult = bgGradient;
	t.true(bgResult.includes('\u001B[41m')); // Red background
	t.true(bgResult.includes('\u001B[38;2;255;0;0ma')); // Gradient text
	t.true(bgResult.includes('\u001B[49m')); // Reset background
});

test('gradient: handles single color edge case', t => {
	// Single color doesn't apply gradient (returns plain text)
	const single = chalk.gradient('#ff0000');
	const singleResult = single('abc');
	t.is(singleResult, 'abc');
});

test('gradient: maintains text content integrity', t => {
	const original = 'Hello, World! 🌍 This is a test with special chars: !@#$%^&*()';
	const gradient = chalk.gradient('#ff0000', '#0000ff', '#00ff00');
	const result = gradient(original);

	// Remove ANSI codes and check content is preserved
	let cleanResult = result;
	let index = cleanResult.indexOf('\u001B[');
	while (index !== -1) {
		const endIndex = cleanResult.indexOf('m', index);
		if (endIndex !== -1) {
			cleanResult = cleanResult.slice(0, index) + cleanResult.slice(endIndex + 1);
		}

		index = cleanResult.indexOf('\u001B[', index);
	}

	t.is(cleanResult, original);

	// Ensure it has gradient codes
	t.true(result.includes('\u001B[38;2;'));
	t.true(result.endsWith('\u001B[39m'));
});
