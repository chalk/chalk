import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname);

const m = require('..');

console.log('TERM:', process.env.TERM || '[none]');
console.log('platform:', process.platform || '[unknown]');

test('don\'t add any styling when called as the base function', t => {
	t.is(m('foo'), 'foo');
});

test('support multiple arguments in base function', t => {
	t.is(m('hello', 'there'), 'hello there');
});

test('style string', t => {
	t.is(m.underline('foo'), '\u001B[4mfoo\u001B[24m');
	t.is(m.red('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(m.bgRed('foo'), '\u001B[41mfoo\u001B[49m');
});

test('support applying multiple styles at once', t => {
	t.is(m.red.bgGreen.underline('foo'), '\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39m');
	t.is(m.underline.red.bgGreen('foo'), '\u001B[4m\u001B[31m\u001B[42mfoo\u001B[49m\u001B[39m\u001B[24m');
});

test('support nesting styles', t => {
	t.is(
		m.red('foo' + m.underline.bgBlue('bar') + '!'),
		'\u001B[31mfoo\u001B[4m\u001B[44mbar\u001B[49m\u001B[24m!\u001B[39m'
	);
});

test('support nesting styles of the same type (color, underline, bg)', t => {
	t.is(
		m.red('a' + m.yellow('b' + m.green('c') + 'b') + 'c'),
		'\u001B[31ma\u001B[33mb\u001B[32mc\u001B[33mb\u001B[31mc\u001B[39m'
	);
});

test('reset all styles with `.reset()`', t => {
	t.is(m.reset(m.red.bgGreen.underline('foo') + 'foo'), '\u001B[0m\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39mfoo\u001B[0m');
});

test('support caching multiple styles', t => {
	const red = m.red;
	const green = m.green;
	const redBold = red.bold;
	const greenBold = green.bold;

	t.not(red('foo'), green('foo'));
	t.not(redBold('bar'), greenBold('bar'));
	t.not(green('baz'), greenBold('baz'));
});

test('alias gray to grey', t => {
	t.is(m.grey('foo'), '\u001B[90mfoo\u001B[39m');
});

test('support variable number of arguments', t => {
	t.is(m.red('foo', 'bar'), '\u001B[31mfoo bar\u001B[39m');
});

test('support falsy values', t => {
	t.is(m.red(0), '\u001B[31m0\u001B[39m');
});

test('don\'t output escape codes if the input is empty', t => {
	t.is(m.red(), '');
	t.is(m.red.blue.black(), '');
});

test('keep Function.prototype methods', t => {
	t.is(m.grey.apply(null, ['foo']), '\u001B[90mfoo\u001B[39m');
	t.is(m.reset(m.red.bgGreen.underline.bind(null)('foo') + 'foo'), '\u001B[0m\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39mfoo\u001B[0m');
	t.is(m.red.blue.black.call(null), '');
});

test('line breaks should open and close colors', t => {
	t.is(m.grey('hello\nworld'), '\u001B[90mhello\u001B[39m\n\u001B[90mworld\u001B[39m');
});

test('properly convert RGB to 16 colors on basic color terminals', t => {
	t.is(new m.constructor({level: 1}).hex('#FF0000')('hello'), '\u001B[91mhello\u001B[39m');
	t.is(new m.constructor({level: 1}).bgHex('#FF0000')('hello'), '\u001B[101mhello\u001B[49m');
});

test('properly convert RGB to 256 colors on basic color terminals', t => {
	t.is(new m.constructor({level: 2}).hex('#FF0000')('hello'), '\u001B[38;5;196mhello\u001B[39m');
	t.is(new m.constructor({level: 2}).bgHex('#FF0000')('hello'), '\u001B[48;5;196mhello\u001B[49m');
	t.is(new m.constructor({level: 3}).bgHex('#FF0000')('hello'), '\u001B[48;2;255;0;0mhello\u001B[49m');
});

test('don\'t emit RGB codes if level is 0', t => {
	t.is(new m.constructor({level: 0}).hex('#FF0000')('hello'), 'hello');
	t.is(new m.constructor({level: 0}).bgHex('#FF0000')('hello'), 'hello');
});
