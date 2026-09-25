import {test} from 'node:test';
import assert from 'node:assert/strict';
import chalk from '../source/index.js';

// TODO: Do this when ESM supports loader hooks
// Spoof supports-color
// require('./_supports-color')(__dirname, {
// 	stdout: {
// 		level: 0,
// 		hasBasic: false,
// 		has256: false,
// 		has16m: false
// 	},
// 	stderr: {
// 		level: 0,
// 		hasBasic: false,
// 		has256: false,
// 		has16m: false
// 	}
// });

test('colors can be forced by using chalk.level', () => {
	chalk.level = 1;
	assert.equal(chalk.green('hello'), '\u{1B}[32mhello\u{1B}[39m');
});
