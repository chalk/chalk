import process from 'node:process';
import styles from 'ansi-styles';
import chalk from '../source/index.js';

// Generates screenshot
for (const key of Object.keys(styles)) {
	let returnValue = key;

	if (key === 'reset' || key === 'hidden' || key === 'grey') {
		continue;
	}

	if (/^bg[^B]/.test(key)) {
		returnValue = chalk.black(returnValue);
	}

	process.stdout.write(chalk[key](returnValue) + ' ');
}
