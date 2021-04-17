import test from 'ava';
import chalk, {Chalk} from '../source/index.js';

chalk.level = 1;

test('visible: normal output when level > 0', t => {
	const instance = new Chalk({level: 3});
	t.is(instance.visible.red('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(instance.red.visible('foo'), '\u001B[31mfoo\u001B[39m');
});

test('visible: no output when level is too low', t => {
	const instance = new Chalk({level: 0});
	t.is(instance.visible.red('foo'), '');
	t.is(instance.red.visible('foo'), '');
});

test('test switching back and forth between level == 0 and level > 0', t => {
	const instance = new Chalk({level: 3});
	t.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(instance.visible.red('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(instance.red.visible('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(instance.visible('foo'), 'foo');
	t.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');

	instance.level = 0;
	t.is(instance.red('foo'), 'foo');
	t.is(instance.visible('foo'), '');
	t.is(instance.visible.red('foo'), '');
	t.is(instance.red.visible('foo'), '');
	t.is(instance.red('foo'), 'foo');

	instance.level = 3;
	t.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(instance.visible.red('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(instance.red.visible('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(instance.visible('foo'), 'foo');
	t.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');
});
