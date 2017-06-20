<h1 align="center">
	<br>
	<br>
	<img width="360" src="https://cdn.rawgit.com/chalk/chalk/19935d6484811c5e468817f846b7b3d417d7bf4a/logo.svg" alt="chalk">
	<br>
	<br>
	<br>
</h1>

> Terminal string styling done right

[![Build Status](https://travis-ci.org/chalk/chalk.svg?branch=master)](https://travis-ci.org/chalk/chalk) [![Coverage Status](https://coveralls.io/repos/github/chalk/chalk/badge.svg?branch=master)](https://coveralls.io/github/chalk/chalk?branch=master) [![](https://img.shields.io/badge/unicorn-approved-ff69b4.svg)](https://www.youtube.com/watch?v=9auOCbH5Ns4) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

[colors.js](https://github.com/Marak/colors.js) used to be the most popular string styling module, but it has serious deficiencies like extending `String.prototype` which causes all kinds of [problems](https://github.com/yeoman/yo/issues/68). Although there are other ones, they either do too much or not enough.

**Chalk is a clean and focused alternative.**

![](https://github.com/chalk/ansi-styles/raw/master/screenshot.png)


## Why

- Highly performant
- Doesn't extend `String.prototype`
- Expressive API
- Ability to nest styles
- Clean and focused
- Auto-detects color support
- Actively maintained
- [Used by ~16,000 modules](https://www.npmjs.com/browse/depended/chalk) as of May 31st, 2017


## Install

```console
$ npm install --save chalk
```


## Usage

```js
const chalk = require('chalk');

console.log(chalk.blue('Hello world!'));
```

Chalk comes with an easy to use composable API where you just chain and nest the styles you want.

```js
const chalk = require('chalk');
const log = console.log;

// combine styled and normal strings
log(chalk.blue('Hello') + 'World' + chalk.red('!'));

// compose multiple styles using the chainable API
log(chalk.blue.bgRed.bold('Hello world!'));

// pass in multiple arguments
log(chalk.blue('Hello', 'World!', 'Foo', 'bar', 'biz', 'baz'));

// nest styles
log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));

// nest styles of the same type even (color, underline, background)
log(chalk.green(
	'I am a green line ' +
	chalk.blue.underline.bold('with a blue substring') +
	' that becomes green again!'
));

// ES2015 template literal
log(`
CPU: ${chalk.red('90%')}
RAM: ${chalk.green('40%')}
DISK: ${chalk.yellow('70%')}
`);

// Use RGB colors in terminal emulators that support it.
log(chalk.keyword('orange')('Yay for orange colored text!'));
log(chalk.rgb(123, 45, 67).underline('Underlined reddish color'));
log(chalk.hex('#DEADED').bold('Bold gray!'));
```

Easily define your own themes.

```js
const chalk = require('chalk');

const error = chalk.bold.red;
const warning = chalk.keyword('orange');

console.log(error('Error!'));
console.log(warning('Warning!'));
```

Take advantage of console.log [string substitution](http://nodejs.org/docs/latest/api/console.html#console_console_log_data).

```js
const name = 'Sindre';
console.log(chalk.green('Hello %s'), name);
//=> 'Hello Sindre'
```


## API

### chalk.`<style>[.<style>...](string, [string...])`

Example: `chalk.red.bold.underline('Hello', 'world');`

Chain [styles](#styles) and call the last one as a method with a string argument. Order doesn't matter, and later styles take precedent in case of a conflict. This simply means that `Chalk.red.yellow.green` is equivalent to `Chalk.green`.

Multiple arguments will be separated by space.

### chalk.level

Color support is automatically detected, but you can override it by setting the `level` property. You should however only do this in your own code as it applies globally to all chalk consumers.

If you need to change this in a reusable module create a new instance:

```js
const ctx = new chalk.constructor({level: 0});
```

Levels are as follows:

0. All colors disabled
1. Basic color support (16 colors)
2. 256 color support
3. RGB/Truecolor support (16 million colors)

### chalk.supportsColor

Detect whether the terminal [supports color](https://github.com/chalk/supports-color). Used internally and handled for you, but exposed for convenience.

Can be overridden by the user with the flags `--color` and `--no-color`. For situations where using `--color` is not possible, add an environment variable `FORCE_COLOR` with any value to force color. Trumps `--no-color`.

### chalk.styles

Exposes the styles as [ANSI escape codes](https://github.com/chalk/ansi-styles).

Generally not useful, but you might need just the `.open` or `.close` escape code if you're mixing externally styled strings with your own.

```js
const chalk = require('chalk');

console.log(chalk.styles.red);
//=> {open: '\u001b[31m', close: '\u001b[39m'}

console.log(chalk.styles.red.open + 'Hello' + chalk.styles.red.close);
```


## Styles

### Modifiers

- `reset`
- `bold`
- `dim`
- `italic` *(not widely supported)*
- `underline`
- `inverse`
- `hidden`
- `strikethrough` *(not widely supported)*

### Colors

- `black`
- `red`
- `green`
- `yellow`
- `blue` *(on Windows the bright version is used since normal blue is illegible)*
- `magenta`
- `cyan`
- `white`
- `gray`

### Background colors

- `bgBlack`
- `bgRed`
- `bgGreen`
- `bgYellow`
- `bgBlue`
- `bgMagenta`
- `bgCyan`
- `bgWhite`


## 256/16 million (Truecolor) color support

Chalk supports 256 colors and, when manually specified, [Truecolor (16 million colors)](https://gist.github.com/XVilka/8346728) on all supported terminal emulators.

Colors are downsampled from 16 million RGB values to an ANSI color format that is supported by the terminal emulator (or by specifying {level: n} as a chalk option). For example, Chalk configured to run at level 1 (basic color support) will downsample an RGB value of #FF0000 (red) to 31 (ANSI escape for red).

Some examples:

- `chalk.hex('#DEADED').underline('Hello, world!')`
- `chalk.keyword('orange')('Some orange text')`
- `chalk.rgb(15, 100, 204).inverse('Hello!')`

Background versions of these models are prefixed with `bg` and the first level of the module capitalized (e.g. `keyword` for foreground colors and `bgKeyword` for background colors).

- `chalk.bgHex('#DEADED').underline('Hello, world!')`
- `chalk.bgKeyword('orange')('Some orange text')`
- `chalk.bgRgb(15, 100, 204).inverse('Hello!')`

As of this writing, these are the supported color models that are exposed in Chalk:

- `rgb` - e.g. `chalk.rgb(255, 136, 0).bold('Orange!')`
- `hex` - e.g. `chalk.hex('#ff8800').bold('Orange!')`
- `keyword` (CSS keywords) - e.g. `chalk.keyword('orange').bold('Orange!')`
- `hsl` - e.g. `chalk.hsl(32, 100, 50).bold('Orange!')`
- `hsv`
- `hwb`
- `cmyk`
- `xyz`
- `lab`
- `lch`
- `ansi16`
- `ansi256`
- `hcg`
- `apple` (see [qix-/color-convert#30](https://github.com/Qix-/color-convert/issues/30))

For a complete list of color models, see [`color-convert`'s list of conversions](https://github.com/Qix-/color-convert/blob/master/conversions.js).


## Windows

If you're on Windows, do yourself a favor and use [`cmder`](http://cmder.net/) instead of `cmd.exe`.


## Related

- [chalk-cli](https://github.com/chalk/chalk-cli) - CLI for this module
- [ansi-styles](https://github.com/chalk/ansi-styles) - ANSI escape codes for styling strings in the terminal
- [supports-color](https://github.com/chalk/supports-color) - Detect whether a terminal supports color
- [strip-ansi](https://github.com/chalk/strip-ansi) - Strip ANSI escape codes
- [has-ansi](https://github.com/chalk/has-ansi) - Check if a string has ANSI escape codes
- [ansi-regex](https://github.com/chalk/ansi-regex) - Regular expression for matching ANSI escape codes
- [wrap-ansi](https://github.com/chalk/wrap-ansi) - Wordwrap a string with ANSI escape codes
- [slice-ansi](https://github.com/chalk/slice-ansi) - Slice a string with ANSI escape codes
- [color-convert](https://github.com/qix-/color-convert) - Converts colors between different models


## Maintainers

- [Sindre Sorhus](https://github.com/sindresorhus)
- [Josh Junon](https://github.com/qix-)


## License

MIT
