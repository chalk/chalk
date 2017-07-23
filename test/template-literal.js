import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname);

const m = require('..');

test('return an empty string for an empty literal', t => {
	const ctx = m.constructor();
	t.is(ctx``, '');
});

test('return a regular string for a literal with no templates', t => {
	const ctx = m.constructor({level: 0});
	t.is(ctx`hello`, 'hello');
});

test('correctly perform template parsing', t => {
	const ctx = m.constructor({level: 0});
	t.is(ctx`{bold Hello, {cyan World!} This is a} test. {green Woo!}`,
		ctx.bold('Hello,', ctx.cyan('World!'), 'This is a') + ' test. ' + ctx.green('Woo!'));
});

test('correctly perform template substitutions', t => {
	const ctx = m.constructor({level: 0});
	const name = 'Sindre';
	const exclamation = 'Neat';
	t.is(ctx`{bold Hello, {cyan.inverse ${name}!} This is a} test. {green ${exclamation}!}`,
		ctx.bold('Hello,', ctx.cyan.inverse(name + '!'), 'This is a') + ' test. ' + ctx.green(exclamation + '!'));
});

test('correctly parse and evaluate color-convert functions', t => {
	const ctx = m.constructor({level: 3});
	t.is(ctx`{bold.rgb(144,10,178).inverse Hello, {~inverse there!}}`,
		'\u001B[0m\u001B[1m\u001B[38;2;144;10;178m\u001B[7mHello, ' +
		'\u001B[27m\u001B[39m\u001B[22m\u001B[0m\u001B[0m\u001B[1m' +
		'\u001B[38;2;144;10;178mthere!\u001B[39m\u001B[22m\u001B[0m');

	t.is(ctx`{bold.bgRgb(144,10,178).inverse Hello, {~inverse there!}}`,
		'\u001B[0m\u001B[1m\u001B[48;2;144;10;178m\u001B[7mHello, ' +
		'\u001B[27m\u001B[49m\u001B[22m\u001B[0m\u001B[0m\u001B[1m' +
		'\u001B[48;2;144;10;178mthere!\u001B[49m\u001B[22m\u001B[0m');
});

test('properly handle escapes', t => {
	const ctx = m.constructor({level: 3});
	t.is(ctx`{bold hello \{in brackets\}}`,
		'\u001B[0m\u001B[1mhello {in brackets}\u001B[22m\u001B[0m');
});

test('throw if there is an unclosed block', t => {
	const ctx = m.constructor({level: 3});
	try {
		console.log(ctx`{bold this shouldn't appear ever\}`);
		t.fail();
	} catch (err) {
		t.is(err.message, 'Template literal has an unclosed block');
	}
});

test('throw if there is an invalid style', t => {
	const ctx = m.constructor({level: 3});
	try {
		console.log(ctx`{abadstylethatdoesntexist this shouldn't appear ever}`);
		t.fail();
	} catch (err) {
		t.is(err.message, 'Invalid Chalk style: abadstylethatdoesntexist');
	}
});

test('properly style multiline color blocks', t => {
	const ctx = m.constructor({level: 3});
	t.is(
		ctx`{bold
			Hello! This is a
			${'multiline'} block!
			:)
		} {underline
			I hope you enjoy
		}`,
		'\u001B[0m\u001B[1m\u001B[22m\u001B[0m\n' +
		'\u001B[0m\u001B[1m\t\t\tHello! This is a\u001B[22m\u001B[0m\n' +
		'\u001B[0m\u001B[1m\t\t\tmultiline block!\u001B[22m\u001B[0m\n' +
		'\u001B[0m\u001B[1m\t\t\t:)\u001B[22m\u001B[0m\n' +
		'\u001B[0m\u001B[1m\t\t\u001B[22m\u001B[0m\u001B[0m \u001B[0m\u001B[0m\u001B[4m\u001B[24m\u001B[0m\n' +
		'\u001B[0m\u001B[4m\t\t\tI hope you enjoy\u001B[24m\u001B[0m\n' +
		'\u001B[0m\u001B[4m\t\t\u001B[24m\u001B[0m'
	);
});

test('escape interpolated values', t => {
	const ctx = m.constructor({level: 0});
	t.is(ctx`Hello {bold hi}`, 'Hello hi');
	t.is(ctx`Hello ${'{bold hi}'}`, 'Hello {bold hi}');
});
