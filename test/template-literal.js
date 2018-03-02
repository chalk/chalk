/* eslint-disable unicorn/no-hex-escape */
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
		'\u001B[1m\u001B[38;2;144;10;178m\u001B[7mHello, ' +
		'\u001B[27m\u001B[39m\u001B[22m\u001B[1m' +
		'\u001B[38;2;144;10;178mthere!\u001B[39m\u001B[22m');

	t.is(ctx`{bold.bgRgb(144,10,178).inverse Hello, {~inverse there!}}`,
		'\u001B[1m\u001B[48;2;144;10;178m\u001B[7mHello, ' +
		'\u001B[27m\u001B[49m\u001B[22m\u001B[1m' +
		'\u001B[48;2;144;10;178mthere!\u001B[49m\u001B[22m');
});

test('properly handle escapes', t => {
	const ctx = m.constructor({level: 3});
	t.is(ctx`{bold hello \{in brackets\}}`,
		'\u001B[1mhello {in brackets}\u001B[22m');
});

test('throw if there is an unclosed block', t => {
	const ctx = m.constructor({level: 3});
	try {
		console.log(ctx`{bold this shouldn't appear ever\}`);
		t.fail();
	} catch (err) {
		t.is(err.message, 'Chalk template literal is missing 1 closing bracket (`}`)');
	}

	try {
		console.log(ctx`{bold this shouldn't {inverse appear {underline ever\} :) \}`);
		t.fail();
	} catch (err) {
		t.is(err.message, 'Chalk template literal is missing 3 closing brackets (`}`)');
	}
});

test('throw if there is an invalid style', t => {
	const ctx = m.constructor({level: 3});
	try {
		console.log(ctx`{abadstylethatdoesntexist this shouldn't appear ever}`);
		t.fail();
	} catch (err) {
		t.is(err.message, 'Unknown Chalk style: abadstylethatdoesntexist');
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
		'\u001B[1m\u001B[22m\n' +
		'\u001B[1m\t\t\tHello! This is a\u001B[22m\n' +
		'\u001B[1m\t\t\tmultiline block!\u001B[22m\n' +
		'\u001B[1m\t\t\t:)\u001B[22m\n' +
		'\u001B[1m\t\t\u001B[22m \u001B[4m\u001B[24m\n' +
		'\u001B[4m\t\t\tI hope you enjoy\u001B[24m\n' +
		'\u001B[4m\t\t\u001B[24m'
	);
});

test('escape interpolated values', t => {
	const ctx = m.constructor({level: 0});
	t.is(ctx`Hello {bold hi}`, 'Hello hi');
	t.is(ctx`Hello ${'{bold hi}'}`, 'Hello {bold hi}');
});

test('allow custom colors (themes) on custom contexts', t => {
	const ctx = m.constructor({level: 3});
	ctx.rose = ctx.hex('#F6D9D9');
	t.is(ctx`Hello, {rose Rose}.`, 'Hello, \u001B[38;2;246;217;217mRose\u001B[39m.');
});

test('correctly parse newline literals (bug #184)', t => {
	const ctx = m.constructor({level: 0});
	t.is(ctx`Hello
{red there}`, 'Hello\nthere');
});

test('correctly parse newline escapes (bug #177)', t => {
	const ctx = m.constructor({level: 0});
	t.is(ctx`Hello\nthere!`, `Hello\nthere!`);
});

test('correctly parse escape in parameters (bug #177 comment 318622809)', t => {
	const ctx = m.constructor({level: 0});
	const str = '\\';
	t.is(ctx`{blue ${str}}`, '\\');
});

test('correctly parses unicode/hex escapes', t => {
	const ctx = m.constructor({level: 0});
	t.is(ctx`\u0078ylophones are fo\x78y! {magenta.inverse \u0078ylophones are fo\x78y!}`,
		'xylophones are foxy! xylophones are foxy!');
});

test('correctly parses string arguments', t => {
	const ctx = m.constructor({level: 3});
	t.is(ctx`{keyword('black').bold can haz cheezburger}`, '\u001B[38;2;0;0;0m\u001B[1mcan haz cheezburger\u001B[22m\u001B[39m');
	t.is(ctx`{keyword('blac\x6B').bold can haz cheezburger}`, '\u001B[38;2;0;0;0m\u001B[1mcan haz cheezburger\u001B[22m\u001B[39m');
	t.is(ctx`{keyword('blac\u006B').bold can haz cheezburger}`, '\u001B[38;2;0;0;0m\u001B[1mcan haz cheezburger\u001B[22m\u001B[39m');
});

test('throws if a bad argument is encountered', t => {
	const ctx = m.constructor({level: 3}); // Keep level at least 1 in case we optimize for disabled chalk instances
	try {
		console.log(ctx`{keyword(????) hi}`);
		t.fail();
	} catch (err) {
		t.is(err.message, 'Invalid Chalk template style argument: ???? (in style \'keyword\')');
	}
});

test('throws if an extra unescaped } is found', t => {
	const ctx = m.constructor({level: 0});
	try {
		console.log(ctx`{red hi!}}`);
		t.fail();
	} catch (err) {
		t.is(err.message, 'Found extraneous } in Chalk template literal');
	}
});

test('should not parse upper-case escapes', t => {
	const ctx = m.constructor({level: 0});
	t.is(ctx`\N\n\T\t\X07\x07\U000A\u000A\U000a\u000a`, 'N\nT\tX07\x07U000A\u000AU000a\u000A');
});

test('should properly handle undefined template interpolated values', t => {
	const ctx = m.constructor({level: 0});
	t.is(ctx`hello ${undefined}`, 'hello undefined');
	t.is(ctx`hello ${null}`, 'hello null');
});
