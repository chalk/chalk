const {stderr: stderrColor} = require('supports-color');

const chalkFactory = require('./source/factory');

class ChalkStderr {
	constructor(options) {
		return chalkFactory(stderrColor, ChalkStderr, options);
	}
}

module.exports = chalkFactory(stderrColor, ChalkStderr);
module.exports.supportsColor = stderrColor;
