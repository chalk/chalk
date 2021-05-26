// @flow
import chalk from '..';

// $ExpectError (Can't have typo in option name)
chalk.constructor({levl: 1});
chalk.constructor({level: 1});

// $ExpectError (Option must have proper type)
new chalk.constructor({enabled: 'true'});
new chalk.constructor({enabled: true});

// $ExpectError (Can't have typo in chalk method)
chalk.rd('foo');
chalk.red('foo');

// $ExpectError (Can't have typo in chalk method)
chalk.gren`foo`;
chalk.green`foo`;

// $ExpectError (Can't have typo in chalk method)
chalk.red.bgBlu.underline('foo');
chalk.red.bgBlue.underline('foo');

// $ExpectError (Level must be 0, 1, 2, or 3)
const badCtx = chalk.constructor({level: 4});
const ctx = chalk.constructor({level: 3});

// $ExpectError (Can't have typo in method name)
ctx.gry('foo');
ctx.grey('foo');

// $ExpectError (Can't have typo in method name)
ctx`foo`.value();
ctx`foo`.valueOf();

// $ExpectError (Can't have typo in property name)
chalk.abled = true;
chalk.enabled = true;

// $ExpectError (Can't use invalid Level for property setter)
chalk.level = 10;
chalk.level = 1;

const chalkInstance = new chalk.constructor();

// $ExpectError (Can't have typo in method name)
chalkInstance.blu('foo');
chalkInstance.blue('foo');
chalkInstance`foo`;

// $ExpectError (Can't have typo in method name)
chalk.keywrd('orange').bgBlue('foo');
chalk.keyword('orange').bgBlue('foo');

// $ExpectError (rgb should take in 3 numbers)
chalk.rgb(1, 14).bgBlue('foo');
chalk.rgb(1, 14, 9).bgBlue('foo');

// $ExpectError (hsl should take in 3 numbers)
chalk.hsl(1, 14, '9').bgBlue('foo');
chalk.hsl(1, 14, 9).bgBlue('foo');

// $ExpectError (hsv should take in 3 numbers)
chalk.hsv(1, 14).bgBlue('foo');
chalk.hsv(1, 14, 9).bgBlue('foo');

// $ExpectError (hwb should take in 3 numbers)
chalk.hwb(1, 14).bgBlue('foo');
chalk.hwb(1, 14, 9).bgBlue('foo');

// $ExpectError (Can't have typo in method name)
chalk.visibl('foo');
chalk.visible('foo');

// $ExpectError (Can't have typo in method name)
chalk.red.visibl('foo');
chalk.red.visible('foo');
chalk.visible.red('foo');

// $ExpectError (Can't write to readonly property)
chalk.black = 'foo';
chalk.black;

// $ExpectError (Can't write to readonly property)
chalk.reset = 'foo';
console.log(chalk.reset);
