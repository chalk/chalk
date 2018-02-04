// Import path from 'path';
import test from 'ava';
// Import execa from 'execa';

// Spoof supports-color
require('./_supports-color')(__dirname);

const m = require('..');

m.wrapper = {
	pre: '@',
	post: '#'
};

test('add wrapper to underline', t => {
	t.is(m.underline('foo'), '@\u001B[4m#foo@\u001B[24m#');
});

test('add wrapper to color', t => {
	t.is(m.red('foo'), '@\u001B[31m#foo@\u001B[39m#');
});

test('add wrapper to bgColor', t => {
	t.is(m.bgRed('foo'), '@\u001B[41m#foo@\u001B[49m#');
});
