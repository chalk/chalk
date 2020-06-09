/* eslint-disable unicorn/no-hex-escape */
import test from 'ava';

// Spoof supports-color
require('./_supports-color')(__dirname);

const chalk = require('../source');

test('return an empty string for an empty literal', t => {
	const instance = new chalk.Instance();
	t.is(instance``, '');
});

test('return a regular string for a literal with no templates', t => {
	const instance = new chalk.Instance({level: 0});
	t.is(instance`hello`, 'hello');
});

test('correctly perform template parsing', t => {
	const instance = new chalk.Instance({level: 0});
	t.is(instance`{bold Hello, {cyan World!} This is a} test. {green Woo!}`,
		instance.bold('Hello,', instance.cyan('World!'), 'This is a') + ' test. ' + instance.green('Woo!'));
});

test('correctly perform template substitutions', t => {
	const instance = new chalk.Instance({level: 0});
	const name = 'Sindre';
	const exclamation = 'Neat';
	t.is(instance`{bold Hello, {cyan.inverse ${name}!} This is a} test. {green ${exclamation}!}`,
		instance.bold('Hello,', instance.cyan.inverse(name + '!'), 'This is a') + ' test. ' + instance.green(exclamation + '!'));
});

test('correctly perform nested template substitutions', t => {
	const instance = new chalk.Instance({level: 0});
	const name = 'Sindre';
	const exclamation = 'Neat';
	t.is(instance.bold`Hello, {cyan.inverse ${name}!} This is a` + ' test. ' + instance.green`${exclamation}!`,
		instance.bold('Hello,', instance.cyan.inverse(name + '!'), 'This is a') + ' test. ' + instance.green(exclamation + '!'));

	t.is(instance.red.bgGreen.bold`Hello {italic.blue ${name}}`,
		instance.red.bgGreen.bold('Hello ' + instance.italic.blue(name)));

	t.is(instance.strikethrough.cyanBright.bgBlack`Works with {reset {bold numbers}} {bold.red ${1}}`,
		instance.strikethrough.cyanBright.bgBlack('Works with ' + instance.reset.bold('numbers') + ' ' + instance.bold.red(1)));

	t.is(chalk.bold`Also works on the shared {bgBlue chalk} object`,
		'\u001B[1mAlso works on the shared \u001B[1m' +
		'\u001B[44mchalk\u001B[49m\u001B[22m' +
		'\u001B[1m object\u001B[22m');
});

test('correctly parse and evaluate color-convert functions', t => {
	const instance = new chalk.Instance({level: 3});
	t.is(instance`{bold.rgb(144,10,178).inverse Hello, {~inverse there!}}`,
		'\u001B[1m\u001B[38;2;144;10;178m\u001B[7mHello, ' +
		'\u001B[27m\u001B[39m\u001B[22m\u001B[1m' +
		'\u001B[38;2;144;10;178mthere!\u001B[39m\u001B[22m');

	t.is(instance`{bold.bgRgb(144,10,178).inverse Hello, {~inverse there!}}`,
		'\u001B[1m\u001B[48;2;144;10;178m\u001B[7mHello, ' +
		'\u001B[27m\u001B[49m\u001B[22m\u001B[1m' +
		'\u001B[48;2;144;10;178mthere!\u001B[49m\u001B[22m');
});

test('properly handle escapes', t => {
	const instance = new chalk.Instance({level: 3});
	t.is(instance`{bold hello \{in brackets\}}`,
		'\u001B[1mhello {in brackets}\u001B[22m');
});

test('throw if there is an unclosed block', t => {
	const instance = new chalk.Instance({level: 3});
	try {
		console.log(instance`{bold this shouldn't appear ever\}`);
		t.fail();
	} catch (error) {
		t.is(error.message, 'Chalk template literal is missing 1 closing bracket (`}`)');
	}

	try {
		console.log(instance`{bold this shouldn't {inverse appear {underline ever\} :) \}`);
		t.fail();
	} catch (error) {
		t.is(error.message, 'Chalk template literal is missing 3 closing brackets (`}`)');
	}
});

test('throw if there is an invalid style', t => {
	const instance = new chalk.Instance({level: 3});
	try {
		console.log(instance`{abadstylethatdoesntexist this shouldn't appear ever}`);
		t.fail();
	} catch (error) {
		t.is(error.message, 'Unknown Chalk style: abadstylethatdoesntexist');
	}
});

test('properly style multiline color blocks', t => {
	const instance = new chalk.Instance({level: 3});
	t.is(
		instance`{bold
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
	const instance = new chalk.Instance({level: 0});
	t.is(instance`Hello {bold hi}`, 'Hello hi');
	t.is(instance`Hello ${'{bold hi}'}`, 'Hello {bold hi}');
});

test('allow custom colors (themes) on custom contexts', t => {
	const instance = new chalk.Instance({level: 3});
	instance.rose = instance.hex('#F6D9D9');
	t.is(instance`Hello, {rose Rose}.`, 'Hello, \u001B[38;2;246;217;217mRose\u001B[39m.');
});

test('correctly parse newline literals (bug #184)', t => {
	const instance = new chalk.Instance({level: 0});
	t.is(instance`Hello
{red there}`, 'Hello\nthere');
});

test('correctly parse newline escapes (bug #177)', t => {
	const instance = new chalk.Instance({level: 0});
	t.is(instance`Hello\nthere!`, 'Hello\nthere!');
});

test('correctly parse escape in parameters (bug #177 comment 318622809)', t => {
	const instance = new chalk.Instance({level: 0});
	const string = '\\';
	t.is(instance`{blue ${string}}`, '\\');
});

test('correctly parses unicode/hex escapes', t => {
	const instance = new chalk.Instance({level: 0});
	t.is(instance`\u0078ylophones are fo\x78y! {magenta.inverse \u0078ylophones are fo\x78y!}`,
		'xylophones are foxy! xylophones are foxy!');
});

test('correctly parses string arguments', t => {
	const instance = new chalk.Instance({level: 3});
	t.is(instance`{keyword('black').bold can haz cheezburger}`, '\u001B[38;2;0;0;0m\u001B[1mcan haz cheezburger\u001B[22m\u001B[39m');
	t.is(instance`{keyword('blac\x6B').bold can haz cheezburger}`, '\u001B[38;2;0;0;0m\u001B[1mcan haz cheezburger\u001B[22m\u001B[39m');
	t.is(instance`{keyword('blac\u006B').bold can haz cheezburger}`, '\u001B[38;2;0;0;0m\u001B[1mcan haz cheezburger\u001B[22m\u001B[39m');
});

test('throws if a bad argument is encountered', t => {
	const instance = new chalk.Instance({level: 3}); // Keep level at least 1 in case we optimize for disabled chalk instances
	try {
		console.log(instance`{keyword(????) hi}`);
		t.fail();
	} catch (error) {
		t.is(error.message, 'Invalid Chalk template style argument: ???? (in style \'keyword\')');
	}
});

test('throws if an extra unescaped } is found', t => {
	const instance = new chalk.Instance({level: 0});
	try {
		console.log(instance`{red hi!}}`);
		t.fail();
	} catch (error) {
		t.is(error.message, 'Found extraneous } in Chalk template literal');
	}
});

test('should not parse upper-case escapes', t => {
	const instance = new chalk.Instance({level: 0});
	t.is(instance`\N\n\T\t\X07\x07\U000A\u000A\U000a\u000a`, 'N\nT\tX07\x07U000A\u000AU000a\u000A');
});

test('should properly handle undefined template interpolated values', t => {
	const instance = new chalk.Instance({level: 0});
	t.is(instance`hello ${undefined}`, 'hello undefined');
	t.is(instance`hello ${null}`, 'hello null');
});

test('should allow bracketed Unicode escapes', t => {
	const instance = new chalk.Instance({level: 3});
	t.is(instance`\u{AB}`, '\u{AB}');
	t.is(instance`This is a {bold \u{AB681}} test`, 'This is a \u001B[1m\u{AB681}\u001B[22m test');
	t.is(instance`This is a {bold \u{10FFFF}} test`, 'This is a \u001B[1m\u{10FFFF}\u001B[22m test');
});
