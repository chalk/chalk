'use strict';
var escapeStringRegexp = require('escape-string-regexp');
var ansiStyles = require('ansi-styles');
var stripAnsi = require('strip-ansi');
var supportsColor = require('supports-color');
var defineProps = Object.defineProperties;
var chalk = module.exports;

var styles = (function () {
	var ret = {};

	ansiStyles.grey = ansiStyles.gray;

	Object.keys(ansiStyles).forEach(function (key) {
		ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

		ret[key] = {
			get: function () {
				this._styles.push(key);
				return this;
			}
		};
	});

	return ret;
})();

function init() {
	var ret = {};

	Object.keys(styles).forEach(function (name) {
		ret[name] = {
			get: function () {
				var obj = defineProps(function self() {
					var str = [].slice.call(arguments).join(' ');

					if (!chalk.enabled) {
						return str;
					}

					return self._styles.reduce(function (str, name) {
						var code = ansiStyles[name];
						return str ? code.open +
							// Replace any instances already present with a re-opening code
							// otherwise only the part of the string until said closing code
							// will be colored, and the rest will simply be 'plain'.
							str.replace(code.closeRe, code.open) + code.close : '';
					}, str);
				}, styles);

				obj._styles = [];

				return obj[name];
			}
		};
	});

	return ret;
}

defineProps(chalk, init());

chalk.styles = ansiStyles;
chalk.stripColor = stripAnsi;
chalk.supportsColor = supportsColor;

// detect mode if not set manually
if (chalk.enabled === undefined) {
	chalk.enabled = chalk.supportsColor;
}
