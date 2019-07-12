const {stdout: stdoutColor} = require('supports-color');

const chalkFactory = require('./factory');

class ChalkStdout {
	constructor(options) {
		return chalkFactory(stdoutColor, ChalkStdout, options);
	}
}

module.exports = chalkFactory(stdoutColor, ChalkStdout);
module.exports.supportsColor = stdoutColor;
