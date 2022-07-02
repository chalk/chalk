import process from 'node:process';
import styles from 'ansi-styles';
import chalk from '../source/index.js';

// Generates screenshot
for (const key of Object.keys(styles)) {
	let returnValue = key;

	// We skip `overline` as almost no terminal supports it so we cannot show it off.
	if (
		key === 'reset'
			|| key === 'hidden'
			|| key === 'grey'
			|| key === 'bgGray'
			|| key === 'bgGrey'
			|| key === 'overline'
			|| key.endsWith('Bright')
	) {
		continue;
	}

	if (/^bg[^B]/.test(key)) {
		returnValue = chalk.black(returnValue);
	}

	process.stdout.write(chalk[key](returnValue) + ' ');
}
