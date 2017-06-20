'use strict';
var escapeStringRegexp = require('escape-string-regexp');
var ansiStyles = require('ansi-styles');
var supportsColor = require('supports-color');

var defineProps = Object.defineProperties;
var isSimpleWindowsTerm = process.platform === 'win32' && !/^xterm/i.test(process.env.TERM);

// supportsColor.level -> ansiStyles.color[name] mapping
var levelMapping = ['ansi', 'ansi', 'ansi256', 'ansi16m'];
// color-convert models to exclude from the Chalk API due to conflicts and such.
var skipModels = ['gray'];

function Chalk(options) {
	// detect level if not set manually
	this.level = !options || options.level === undefined ? supportsColor.level : options.level;
}

// use bright blue on Windows as the normal blue color is illegible
if (isSimpleWindowsTerm) {
	ansiStyles.blue.open = '\u001b[94m';
}

var styles = {};

Object.keys(ansiStyles).forEach(function (key) {
	ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

	styles[key] = {
		get: function () {
			var codes = ansiStyles[key];
			return build.call(this, this._styles ? this._styles.concat(codes) : [codes], key);
		}
	};
});

ansiStyles.color.closeRe = new RegExp(escapeStringRegexp(ansiStyles.color.close), 'g');
Object.keys(ansiStyles.color.ansi).forEach(function (model) {
	if (skipModels.indexOf(model) !== -1) {
		return;
	}

	styles[model] = {
		get: function () {
			var level = this.level;
			return function () {
				var open = ansiStyles.color[levelMapping[level]][model].apply(null, arguments);
				var codes = {open: open, close: ansiStyles.color.close, closeRe: ansiStyles.color.closeRe};
				return build.call(this, this._styles ? this._styles.concat(codes) : [codes], model);
			};
		}
	};
});

ansiStyles.bgColor.closeRe = new RegExp(escapeStringRegexp(ansiStyles.bgColor.close), 'g');
Object.keys(ansiStyles.bgColor.ansi).forEach(function (model) {
	if (skipModels.indexOf(model) !== -1) {
		return;
	}

	var bgModel = 'bg' + model.charAt(0).toUpperCase() + model.substring(1);
	styles[bgModel] = {
		get: function () {
			var level = this.level;
			return function () {
				var open = ansiStyles.bgColor[levelMapping[level]][model].apply(null, arguments);
				var codes = {open: open, close: ansiStyles.bgColor.close, closeRe: ansiStyles.bgColor.closeRe};
				return build.call(this, this._styles ? this._styles.concat(codes) : [codes], model);
			};
		}
	};
});

// eslint-disable-next-line func-names
var proto = defineProps(function chalk() {}, styles);

function build(_styles, key) {
	var builder = function () {
		return applyStyle.apply(builder, arguments);
	};

	var self = this;

	builder._styles = _styles;

	Object.defineProperty(builder, 'level', {
		enumerable: true,
		get: function () {
			return self.level;
		},
		set: function (level) {
			self.level = level;
		}
	});

	// see below for fix regarding invisible grey/dim combination on windows.
	builder.hasGrey = this.hasGrey || key === 'gray' || key === 'grey';

	// __proto__ is used because we must return a function, but there is
	// no way to create a function with a different prototype.
	/* eslint-disable no-proto */
	builder.__proto__ = proto;

	return builder;
}

function applyStyle() {
	// support varags, but simply cast to string in case there's only one arg
	var args = arguments;
	var argsLen = args.length;
	var str = argsLen !== 0 && String(arguments[0]);

	if (argsLen > 1) {
		// don't slice `arguments`, it prevents v8 optimizations
		for (var a = 1; a < argsLen; a++) {
			str += ' ' + args[a];
		}
	}

	if (!this.level || !str) {
		return str;
	}

	var nestedStyles = this._styles;
	var i = nestedStyles.length;

	// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
	// see https://github.com/chalk/chalk/issues/58
	// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
	var originalDim = ansiStyles.dim.open;
	if (isSimpleWindowsTerm && this.hasGrey) {
		ansiStyles.dim.open = '';
	}

	while (i--) {
		var code = nestedStyles[i];

		// Replace any instances already present with a re-opening code
		// otherwise only the part of the string until said closing code
		// will be colored, and the rest will simply be 'plain'.
		str = code.open + str.replace(code.closeRe, code.open) + code.close;

		// Close the styling before a linebreak and reopen
		// after next line to fix a bleed issue on macOS
		// https://github.com/chalk/chalk/pull/92
		str = str.replace(/\r?\n/g, code.close + '$&' + code.open);
	}

	// Reset the original 'dim' if we changed it to work around the Windows dimmed gray issue.
	ansiStyles.dim.open = originalDim;

	return str;
}

defineProps(Chalk.prototype, styles);

module.exports = new Chalk();
module.exports.styles = ansiStyles;
module.exports.supportsColor = supportsColor;
