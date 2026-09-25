import {suite, bench} from 'node:bench';
import chalk from './source/index.js';

// The bench runner pipes stdout, so chalk would otherwise disable colors and the benchmark would only measure the plain passthrough.
chalk.level = 3;

const operations = 10_000;

function benchmark(name, function_) {
	bench(name, b => {
		let length = 0;

		b.start();
		for (let index = 0; index < operations; index++) {
			length += function_().length;
		}

		b.end(operations);

		if (length === 0) {
			throw new Error('Unexpected empty output');
		}
	});
}

suite('chalk', () => {
	const chalkRed = chalk.red;
	const chalkBgRed = chalk.bgRed;
	const chalkBlueBgRed = chalk.blue.bgRed;
	const chalkBlueBgRedBold = chalk.blue.bgRed.bold;

	const blueStyledString = 'the fox jumps' + chalk.blue('over the lazy dog') + '!';

	benchmark('1 style', () => chalk.red('the fox jumps over the lazy dog'));

	benchmark('2 styles', () => chalk.blue.bgRed('the fox jumps over the lazy dog'));

	benchmark('3 styles', () => chalk.blue.bgRed.bold('the fox jumps over the lazy dog'));

	benchmark('cached: 1 style', () => chalkRed('the fox jumps over the lazy dog'));

	benchmark('cached: 2 styles', () => chalkBlueBgRed('the fox jumps over the lazy dog'));

	benchmark('cached: 3 styles', () => chalkBlueBgRedBold('the fox jumps over the lazy dog'));

	benchmark('cached: 1 style with newline', () => chalkRed('the fox jumps\nover the lazy dog'));

	benchmark('cached: 1 style nested intersecting', () => chalkRed(blueStyledString));

	benchmark('cached: 1 style nested non-intersecting', () => chalkBgRed(blueStyledString));

	benchmark('cached: 1 style template literal', () => chalkRed`the fox jumps over the lazy dog`);

	benchmark('cached: nested styles template literal', () => chalkRed`the fox {bold jumps} over the {underline lazy} dog`);
});
