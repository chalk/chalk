import {expectType} from 'tsd-check';
import chalk, {Level, Chalk, ColorSupport} from '.';

// - Helpers -
type colorReturn = Chalk & {supportsColor: ColorSupport};

// - Level -
expectType<number>(Level.None);
expectType<number>(Level.Basic);
expectType<number>(Level.Ansi256);
expectType<number>(Level.TrueColor);

// - supportsColor -
expectType<boolean>(chalk.supportsColor.hasBasic);
expectType<boolean>(chalk.supportsColor.has256);
expectType<boolean>(chalk.supportsColor.has16m);

// - Chalk -
// -- Constructor --
expectType<Chalk>(new chalk.constructor({level: 1}));

// -- Properties --
expectType<boolean>(chalk.enabled);
expectType<Level>(chalk.level);

// -- Template literal --
expectType<string>(chalk``);
const name = 'John';
expectType<string>(chalk`Hello {bold.red ${name}}`);
expectType<string>(chalk`Works with numbers {bold.red ${1}}`);

// -- Color methods --
expectType<colorReturn>(chalk.hex('#DEADED'));
expectType<colorReturn>(chalk.keyword('orange'));
expectType<colorReturn>(chalk.rgb(0, 0, 0));
expectType<colorReturn>(chalk.hsl(0, 0, 0));
expectType<colorReturn>(chalk.hsv(0, 0, 0));
expectType<colorReturn>(chalk.hwb(0, 0, 0));
expectType<colorReturn>(chalk.bgHex('#DEADED'));
expectType<colorReturn>(chalk.bgKeyword('orange'));
expectType<colorReturn>(chalk.bgRgb(0, 0, 0));
expectType<colorReturn>(chalk.bgHsl(0, 0, 0));
expectType<colorReturn>(chalk.bgHsv(0, 0, 0));
expectType<colorReturn>(chalk.bgHwb(0, 0, 0));

// -- Modifiers --
expectType<string>(chalk.reset('foo'));
expectType<string>(chalk.bold('foo'));
expectType<string>(chalk.dim('foo'));
expectType<string>(chalk.italic('foo'));
expectType<string>(chalk.underline('foo'));
expectType<string>(chalk.inverse('foo'));
expectType<string>(chalk.hidden('foo'));
expectType<string>(chalk.strikethrough('foo'));
expectType<string>(chalk.visible('foo'));
expectType<string>(chalk.reset`foo`);
expectType<string>(chalk.bold`foo`);
expectType<string>(chalk.dim`foo`);
expectType<string>(chalk.italic`foo`);
expectType<string>(chalk.underline`foo`);
expectType<string>(chalk.inverse`foo`);
expectType<string>(chalk.hidden`foo`);
expectType<string>(chalk.strikethrough`foo`);
expectType<string>(chalk.visible`foo`);

// -- Colors --
expectType<string>(chalk.black('foo'));
expectType<string>(chalk.red('foo'));
expectType<string>(chalk.green('foo'));
expectType<string>(chalk.yellow('foo'));
expectType<string>(chalk.blue('foo'));
expectType<string>(chalk.magenta('foo'));
expectType<string>(chalk.cyan('foo'));
expectType<string>(chalk.white('foo'));
expectType<string>(chalk.gray('foo'));
expectType<string>(chalk.grey('foo'));
expectType<string>(chalk.blackBright('foo'));
expectType<string>(chalk.redBright('foo'));
expectType<string>(chalk.greenBright('foo'));
expectType<string>(chalk.yellowBright('foo'));
expectType<string>(chalk.blueBright('foo'));
expectType<string>(chalk.magentaBright('foo'));
expectType<string>(chalk.cyanBright('foo'));
expectType<string>(chalk.whiteBright('foo'));
expectType<string>(chalk.bgBlack('foo'));
expectType<string>(chalk.bgRed('foo'));
expectType<string>(chalk.bgGreen('foo'));
expectType<string>(chalk.bgYellow('foo'));
expectType<string>(chalk.bgBlue('foo'));
expectType<string>(chalk.bgMagenta('foo'));
expectType<string>(chalk.bgCyan('foo'));
expectType<string>(chalk.bgWhite('foo'));
expectType<string>(chalk.bgBlackBright('foo'));
expectType<string>(chalk.bgRedBright('foo'));
expectType<string>(chalk.bgGreenBright('foo'));
expectType<string>(chalk.bgYellowBright('foo'));
expectType<string>(chalk.bgBlueBright('foo'));
expectType<string>(chalk.bgMagentaBright('foo'));
expectType<string>(chalk.bgCyanBright('foo'));
expectType<string>(chalk.bgWhiteBright('foo'));
expectType<string>(chalk.black`foo`);
expectType<string>(chalk.red`foo`);
expectType<string>(chalk.green`foo`);
expectType<string>(chalk.yellow`foo`);
expectType<string>(chalk.blue`foo`);
expectType<string>(chalk.magenta`foo`);
expectType<string>(chalk.cyan`foo`);
expectType<string>(chalk.white`foo`);
expectType<string>(chalk.gray`foo`);
expectType<string>(chalk.grey`foo`);
expectType<string>(chalk.blackBright`foo`);
expectType<string>(chalk.redBright`foo`);
expectType<string>(chalk.greenBright`foo`);
expectType<string>(chalk.yellowBright`foo`);
expectType<string>(chalk.blueBright`foo`);
expectType<string>(chalk.magentaBright`foo`);
expectType<string>(chalk.cyanBright`foo`);
expectType<string>(chalk.whiteBright`foo`);
expectType<string>(chalk.bgBlack`foo`);
expectType<string>(chalk.bgRed`foo`);
expectType<string>(chalk.bgGreen`foo`);
expectType<string>(chalk.bgYellow`foo`);
expectType<string>(chalk.bgBlue`foo`);
expectType<string>(chalk.bgMagenta`foo`);
expectType<string>(chalk.bgCyan`foo`);
expectType<string>(chalk.bgWhite`foo`);
expectType<string>(chalk.bgBlackBright`foo`);
expectType<string>(chalk.bgRedBright`foo`);
expectType<string>(chalk.bgGreenBright`foo`);
expectType<string>(chalk.bgYellowBright`foo`);
expectType<string>(chalk.bgBlueBright`foo`);
expectType<string>(chalk.bgMagentaBright`foo`);
expectType<string>(chalk.bgCyanBright`foo`);
expectType<string>(chalk.bgWhiteBright`foo`);

// -- Complex --
expectType<string>(chalk.red.bgGreen.underline('foo'));
expectType<string>(chalk.underline.red.bgGreen('foo'));
