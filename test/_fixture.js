import chalk, {chalkStderr} from '../source/index.js';

console.log(`${chalk.hex('#ff6159')('testout')} ${chalkStderr.hex('#ff6159')('testerr')}`);
