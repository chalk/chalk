'use strict';
const {stderr: stderrColor} = require('supports-color');
const {constructor: Chalk} = require('.');

module.exports = new Chalk({level: stderrColor ? stderrColor.level : 0});
module.exports.supportsColor = stderrColor;
module.exports.default = module.exports; // For TypeScript
