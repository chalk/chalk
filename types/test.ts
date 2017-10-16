import chalk, {Level} from '..';

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

chalk.constructor({level: 1});
const ctx = chalk.constructor({level: Level.TrueColor });
ctx('foo');
ctx.red('foo');
ctx`foo`;

chalk.enabled = true;
chalk.level = 1;
chalk.level = Level.Ansi256;

chalk.level === Level.Ansi256;

let chalkInstance = new chalk();
chalkInstance = new chalk.constructor();
chalkInstance = chalk.constructor();

chalk.enabled;
chalk.level;
chalk.supportsColor.level;
chalk.supportsColor.has16m;
chalk.supportsColor.has256;
chalk.supportsColor.hasBasic;

chalk.keyword('orange').bgBlue('foo');
chalk.hex('#123456').bgBlue('foo');
chalk.rgb(1, 14, 9).bgBlue('foo');
chalk.hsl(1, 14, 9).bgBlue('foo');
chalk.hsv(1, 14, 9).bgBlue('foo');
chalk.hwb(1, 14, 9).bgBlue('foo');
