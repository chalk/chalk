/**
Basic foreground colors.

[More colors here.](https://github.com/chalk/chalk/blob/main/readme.md#256-and-truecolor-color-support)
*/
export type ForegroundColor =
	| 'black'
	| 'red'
	| 'green'
	| 'yellow'
	| 'blue'
	| 'magenta'
	| 'cyan'
	| 'white'
	| 'gray'
	| 'grey'
	| 'blackBright'
	| 'redBright'
	| 'greenBright'
	| 'yellowBright'
	| 'blueBright'
	| 'magentaBright'
	| 'cyanBright'
	| 'whiteBright';

/**
Basic background colors.

[More colors here.](https://github.com/chalk/chalk/blob/main/readme.md#256-and-truecolor-color-support)
*/
export type BackgroundColor =
	| 'bgBlack'
	| 'bgRed'
	| 'bgGreen'
	| 'bgYellow'
	| 'bgBlue'
	| 'bgMagenta'
	| 'bgCyan'
	| 'bgWhite'
	| 'bgGray'
	| 'bgGrey'
	| 'bgBlackBright'
	| 'bgRedBright'
	| 'bgGreenBright'
	| 'bgYellowBright'
	| 'bgBlueBright'
	| 'bgMagentaBright'
	| 'bgCyanBright'
	| 'bgWhiteBright';

/**
Basic colors.

[More colors here.](https://github.com/chalk/chalk/blob/main/readme.md#256-and-truecolor-color-support)
*/
export type Color = ForegroundColor | BackgroundColor;

export type Modifiers =
	| 'reset'
	| 'bold'
	| 'dim'
	| 'italic'
	| 'underline'
	| 'overline'
	| 'inverse'
	| 'hidden'
	| 'strikethrough'
	| 'visible';

/**
Levels:
- `0` - All colors disabled.
- `1` - Basic 16 colors support.
- `2` - ANSI 256 colors support.
- `3` - Truecolor 16 million colors support.
*/
export type ColorSupportLevel = 0 | 1 | 2 | 3;

export interface Options {
	/**
	Specify the color support for Chalk.

	By default, color support is automatically detected based on the environment.

	Levels:
	- `0` - All colors disabled.
	- `1` - Basic 16 colors support.
	- `2` - ANSI 256 colors support.
	- `3` - Truecolor 16 million colors support.
	*/
	readonly level?: ColorSupportLevel;
}

/**
Return a new Chalk instance.
*/
export const Chalk: new (options?: Options) => ChalkInstance;

/**
Detect whether the terminal supports color.
*/
export interface ColorSupport {
	/**
	The color level used by Chalk.
	*/
	level: ColorSupportLevel;

	/**
	Return whether Chalk supports basic 16 colors.
	*/
	hasBasic: boolean;

	/**
	Return whether Chalk supports ANSI 256 colors.
	*/
	has256: boolean;

	/**
	Return whether Chalk supports Truecolor 16 million colors.
	*/
	has16m: boolean;
}

interface ChalkFunction {
	/**
	Use a template string.

	@remarks Template literals are unsupported for nested calls (see [issue #341](https://github.com/chalk/chalk/issues/341))

	@example
	```
	import chalk from 'chalk';

	log(chalk`
	CPU: {red ${cpu.totalPercent}%}
	RAM: {green ${ram.used / ram.total * 100}%}
	DISK: {rgb(255,131,0) ${disk.used / disk.total * 100}%}
	`);
	```

	@example
	```
	import chalk from 'chalk';

	log(chalk.red.bgBlack`2 + 3 = {bold ${2 + 3}}`)
	```
	*/
	(text: TemplateStringsArray, ...placeholders: unknown[]): string;

	(...text: unknown[]): string;
}

export interface ChalkInstance extends ChalkFunction {
	/**
	The color support for Chalk.

	By default, color support is automatically detected based on the environment.

	Levels:
	- `0` - All colors disabled.
	- `1` - Basic 16 colors support.
	- `2` - ANSI 256 colors support.
	- `3` - Truecolor 16 million colors support.
	*/
	level: ColorSupportLevel;

	/**
	Use RGB values to set text color.
	*/
	rgb: (red: number, green: number, blue: number) => this;

	/**
	Use HEX value to set text color.

	@param color - Hexadecimal value representing the desired color.

	@example
	```
	import chalk from 'chalk';

	chalk.hex('#DEADED');
	```
	*/
	hex: (color: string) => this;

	/**
	Use an [8-bit unsigned number](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit) to set text color.
	*/
	ansi256: (index: number) => this;

	/**
	Use RGB values to set background color.
	*/
	bgRgb: (red: number, green: number, blue: number) => this;

	/**
	Use HEX value to set background color.

	@param color - Hexadecimal value representing the desired color.

	@example
	```
	import chalk from 'chalk';

	chalk.bgHex('#DEADED');
	```
	*/
	bgHex: (color: string) => this;

	/**
	Use a [8-bit unsigned number](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit) to set background color.
	*/
	bgAnsi256: (index: number) => this;

	/**
	Modifier: Resets the current color chain.
	*/
	readonly reset: this;

	/**
	Modifier: Make text bold.
	*/
	readonly bold: this;

	/**
	Modifier: Make text slightly darker. (Inconsistent across terminals; might do nothing)
	*/
	readonly dim: this;

	/**
	Modifier: Make text italic. (Not widely supported)
	*/
	readonly italic: this;

	/**
	Modifier: Make text underline. (Not widely supported)
	*/
	readonly underline: this;

	/**
	Modifier: Make text overline. (Not widely supported)
	*/
	readonly overline: this;

	/**
	Modifier: Inverse background and foreground colors.
	*/
	readonly inverse: this;

	/**
	Modifier: Prints the text, but makes it invisible.
	*/
	readonly hidden: this;

	/**
	Modifier: Puts a horizontal line through the center of the text. (Not widely supported)
	*/
	readonly strikethrough: this;

	/**
	Modifier: Prints the text only when Chalk has a color support level > 0.
	Can be useful for things that are purely cosmetic.
	*/
	readonly visible: this;

	readonly black: this;
	readonly red: this;
	readonly green: this;
	readonly yellow: this;
	readonly blue: this;
	readonly magenta: this;
	readonly cyan: this;
	readonly white: this;

	/*
	Alias for `blackBright`.
	*/
	readonly gray: this;

	/*
	Alias for `blackBright`.
	*/
	readonly grey: this;

	readonly blackBright: this;
	readonly redBright: this;
	readonly greenBright: this;
	readonly yellowBright: this;
	readonly blueBright: this;
	readonly magentaBright: this;
	readonly cyanBright: this;
	readonly whiteBright: this;

	readonly bgBlack: this;
	readonly bgRed: this;
	readonly bgGreen: this;
	readonly bgYellow: this;
	readonly bgBlue: this;
	readonly bgMagenta: this;
	readonly bgCyan: this;
	readonly bgWhite: this;

	/*
	Alias for `bgBlackBright`.
	*/
	readonly bgGray: this;

	/*
	Alias for `bgBlackBright`.
	*/
	readonly bgGrey: this;

	readonly bgBlackBright: this;
	readonly bgRedBright: this;
	readonly bgGreenBright: this;
	readonly bgYellowBright: this;
	readonly bgBlueBright: this;
	readonly bgMagentaBright: this;
	readonly bgCyanBright: this;
	readonly bgWhiteBright: this;
}

/**
Main Chalk object that allows to chain styles together.

Call the last one as a method with a string argument.

Order doesn't matter, and later styles take precedent in case of a conflict.

This simply means that `chalk.red.yellow.green` is equivalent to `chalk.green`.
*/
declare const chalk: ChalkInstance & ChalkFunction;

export const supportsColor: ColorSupport | false;

export const chalkStderr: typeof chalk;
export const supportsColorStderr: typeof supportsColor;

export default chalk;
