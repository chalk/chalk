'use strict';
const chalk = require('..');
const cherr = require('../stderr');

console.log(chalk.hex('#ff6159')('test'));
console.error(cherr.hex('#ffe861')('test stderr'));
