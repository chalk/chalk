'use strict';
var ansiStyles = require('ansi-styles');
var stripAnsi = require('strip-ansi');
var supportsColor = require('supports-color');
var defineProps = Object.defineProperties;
var chalk = module.exports;

var styles = (function () {
	var ret = {};

	ansiStyles.grey = ansiStyles.gray;

	Object.keys(ansiStyles).forEach(function (key) {
		ret[key] = {
			get: function () {
				this._styles.push(key);
				return this;
			}
		};
	});

	return ret;
})();

// enrich each ansiStyle object with regular expression matching
// all instances of the corresponding code.close
(function () {
	var _matchUnescapedCharacters = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
	function escapeStr(str) {
		return str.replace(_matchUnescapedCharacters, '\\$&');
	}

	Object.keys(ansiStyles).forEach(function (key) {
		ansiStyles[key].closeRe = new RegExp(escapeStr(ansiStyles[key].close), 'g');
	});
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
						return str ?
							// Replace any instances already present with a re-opening code
							// otherwise only the part of the string until said closing code will be coloured, and the rest will be
							// simply 'plain'.
							code.open + str.replace(code.closeRe, code.open) + code.close :
							'';
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
