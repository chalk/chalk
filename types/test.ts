import * as chalk from '..';

chalk.underline('foo');
chalk.red('foo');
chalk.bgRed('foo');

const name = 'Josh';
chalk`Hello {bold.red ${name}}`;

chalk.red`foo`;
chalk.underline`foo`;
chalk`foo`;

chalk.red.bgGreen.underline('foo');
chalk.underline.red.bgGreen('foo');

chalk.grey('foo');
chalk.red(0);

const ctx = chalk.constructor({level: 1});
ctx('foo');
ctx.red('foo');
ctx`foo`;

chalk.enabled;
chalk.supportsColor;
chalk.level;

chalk.keyword('orange').bgBlue('foo');
chalk.hex('#123456').bgBlue('foo');
chalk.rgb(1, 14, 9).bgBlue('foo');
chalk.hsl(1, 14, 9).bgBlue('foo');
chalk.hsv(1, 14, 9).bgBlue('foo');
chalk.hwb(1, 14, 9).bgBlue('foo');
