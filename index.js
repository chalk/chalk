'use strict';
var escapeStringRegexp = require('escape-string-regexp');
var ansiStyles = require('ansi-styles');
var stripAnsi = require('strip-ansi');
var hasAnsi = require('has-ansi');
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

function applyStyle() {
	// support varags, but simply cast to string in case there's only one arg
	var str = arguments.length === 1 ?  arguments[0] + '' : [].slice.call(arguments).join(' ');

	if (!chalk.enabled || !str) {
		return str;
	}

	return applyStyle._styles.reduce(function (str, name) {
		var code = ansiStyles[name];
		// Replace any instances already present with a re-opening code
		// otherwise only the part of the string until said closing code
		// will be colored, and the rest will simply be 'plain'.
		return code.open + str.replace(code.closeRe, code.open) + code.close;
	}, str) ;
}

function init() {
	var ret = {};

	Object.keys(styles).forEach(function (name) {
		var style = defineProps(applyStyle, styles);
		ret[name] = {
			get: function () {
				style._styles = [];
				return style[name];
			}
		};
	});

	return ret;
}

defineProps(chalk, init());

chalk.styles = ansiStyles;
chalk.hasColor = hasAnsi;
chalk.stripColor = stripAnsi;
chalk.supportsColor = supportsColor;

// detect mode if not set manually
if (chalk.enabled === undefined) {
	chalk.enabled = chalk.supportsColor;
}
