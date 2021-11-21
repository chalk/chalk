import process from 'node:process';
import test from 'ava';
import chalk, {Chalk, chalkStderr} from '../source/index.js';

chalk.level = 3;
chalkStderr.level = 3;

console.log('TERM:', process.env.TERM || '[none]');
console.log('platform:', process.platform || '[unknown]');

test('don\'t add any styling when called as the base function', t => {
	t.is(chalk('foo'), 'foo');
});

test('support multiple arguments in base function', t => {
	t.is(chalk('hello', 'there'), 'hello there');
});

test('support automatic casting to string', t => {
	t.is(chalk(['hello', 'there']), 'hello,there');
	t.is(chalk(123), '123');

	t.is(chalk.bold(['foo', 'bar']), '\u001B[1mfoo,bar\u001B[22m');
	t.is(chalk.green(98_765), '\u001B[32m98765\u001B[39m');
});

test('style string', t => {
	t.is(chalk.underline('foo'), '\u001B[4mfoo\u001B[24m');
	t.is(chalk.red('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(chalk.bgRed('foo'), '\u001B[41mfoo\u001B[49m');
});

test('support applying multiple styles at once', t => {
	t.is(chalk.red.bgGreen.underline('foo'), '\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39m');
	t.is(chalk.underline.red.bgGreen('foo'), '\u001B[4m\u001B[31m\u001B[42mfoo\u001B[49m\u001B[39m\u001B[24m');
});

test('support nesting styles', t => {
	t.is(
		chalk.red('foo' + chalk.underline.bgBlue('bar') + '!'),
		'\u001B[31mfoo\u001B[4m\u001B[44mbar\u001B[49m\u001B[24m!\u001B[39m',
	);
});

test('support nesting styles of the same type (color, underline, bg)', t => {
	t.is(
		chalk.red('a' + chalk.yellow('b' + chalk.green('c') + 'b') + 'c'),
		'\u001B[31ma\u001B[33mb\u001B[32mc\u001B[39m\u001B[31m\u001B[33mb\u001B[39m\u001B[31mc\u001B[39m',
	);
});

test('reset all styles with `.reset()`', t => {
	t.is(chalk.reset(chalk.red.bgGreen.underline('foo') + 'foo'), '\u001B[0m\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39mfoo\u001B[0m');
});

test('support caching multiple styles', t => {
	const {red, green} = chalk.red;
	const redBold = red.bold;
	const greenBold = green.bold;

	t.not(red('foo'), green('foo'));
	t.not(redBold('bar'), greenBold('bar'));
	t.not(green('baz'), greenBold('baz'));
});

test('alias gray to grey', t => {
	t.is(chalk.grey('foo'), '\u001B[90mfoo\u001B[39m');
});

test('support variable number of arguments', t => {
	t.is(chalk.red('foo', 'bar'), '\u001B[31mfoo bar\u001B[39m');
});

test('support falsy values', t => {
	t.is(chalk.red(0), '\u001B[31m0\u001B[39m');
});

test('don\'t output escape codes if the input is empty', t => {
	t.is(chalk.red(), '');
	t.is(chalk.red.blue.black(), '');
});

test('keep Function.prototype methods', t => {
	t.is(Reflect.apply(chalk.grey, null, ['foo']), '\u001B[90mfoo\u001B[39m');
	t.is(chalk.reset(chalk.red.bgGreen.underline.bind(null)('foo') + 'foo'), '\u001B[0m\u001B[31m\u001B[42m\u001B[4mfoo\u001B[24m\u001B[49m\u001B[39mfoo\u001B[0m');
	t.is(chalk.red.blue.black.call(null), '');
});

test('line breaks should open and close colors', t => {
	t.is(chalk.grey('hello\nworld'), '\u001B[90mhello\u001B[39m\n\u001B[90mworld\u001B[39m');
});

test('line breaks should open and close colors with CRLF', t => {
	t.is(chalk.grey('hello\r\nworld'), '\u001B[90mhello\u001B[39m\r\n\u001B[90mworld\u001B[39m');
});

test('properly convert RGB to 16 colors on basic color terminals', t => {
	t.is(new Chalk({level: 1}).hex('#FF0000')('hello'), '\u001B[91mhello\u001B[39m');
	t.is(new Chalk({level: 1}).bgHex('#FF0000')('hello'), '\u001B[101mhello\u001B[49m');
});

test('properly convert RGB to 256 colors on basic color terminals', t => {
	t.is(new Chalk({level: 2}).hex('#FF0000')('hello'), '\u001B[38;5;196mhello\u001B[39m');
	t.is(new Chalk({level: 2}).bgHex('#FF0000')('hello'), '\u001B[48;5;196mhello\u001B[49m');
	t.is(new Chalk({level: 3}).bgHex('#FF0000')('hello'), '\u001B[48;2;255;0;0mhello\u001B[49m');
});

test('don\'t emit RGB codes if level is 0', t => {
	t.is(new Chalk({level: 0}).hex('#FF0000')('hello'), 'hello');
	t.is(new Chalk({level: 0}).bgHex('#FF0000')('hello'), 'hello');
});

test('supports blackBright color', t => {
	t.is(chalk.blackBright('foo'), '\u001B[90mfoo\u001B[39m');
});

test('sets correct level for chalkStderr and respects it', t => {
	t.is(chalkStderr.level, 3);
	t.is(chalkStderr.red.bold('foo'), '\u001B[31m\u001B[1mfoo\u001B[22m\u001B[39m');
});

test('keeps function prototype methods', t => {
	t.is(chalk.apply(chalk, ['foo']), 'foo');
	t.is(chalk.bind(chalk, 'foo')(), 'foo');
	t.is(chalk.call(chalk, 'foo'), 'foo');
});
