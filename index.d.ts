declare const enum LevelEnum {
	/**
	All colors disabled.
	*/
	None = 0,

	/**
	Basic 16 colors support.
	*/
	Basic = 1,

	/**
	ANSI 256 colors support.
	*/
	Ansi256 = 2,

	/**
	Truecolor 16 million colors support.
	*/
	TrueColor = 3
}

/**
Basic foreground colors.

[More colors here.](https://github.com/chalk/chalk/blob/master/readme.md#256-and-truecolor-color-support)
*/
declare type ForegroundColor =
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

[More colors here.](https://github.com/chalk/chalk/blob/master/readme.md#256-and-truecolor-color-support)
*/
declare type BackgroundColor =
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

[More colors here.](https://github.com/chalk/chalk/blob/master/readme.md#256-and-truecolor-color-support)
*/
declare type Color = ForegroundColor | BackgroundColor;

declare type Modifiers =
	| 'reset'
	| 'bold'
	| 'dim'
	| 'italic'
	| 'underline'
	| 'inverse'
	| 'hidden'
	| 'strikethrough'
	| 'visible';

declare namespace chalk {
	type Level = LevelEnum;

	interface Options {
		/**
		Specify the color support for Chalk.
		By default, color support is automatically detected based on the environment.
		*/
		level?: Level;
	}

	interface Instance {
		/**
		Return a new Chalk instance.
		*/
		new (options?: Options): Chalk;
	}

	/**
	Detect whether the terminal supports color.
	*/
	interface ColorSupport {
		/**
		The color level used by Chalk.
		*/
		level: Level;

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
		Use a string.

		@remarks Template literals are unsupported for nested calls (see [issue #341](https://github.com/chalk/chalk/issues/341))
		*/
		(text: string): string;
	}

	interface ChalkTemplateFunction {
		/**
		Use a template string.

		@remarks Template literals are unsupported for nested calls (see [issue #341](https://github.com/chalk/chalk/issues/341))

		@example
		```
		import chalk = require('chalk');

		log(chalk`
		CPU: {red ${cpu.totalPercent}%}
		RAM: {green ${ram.used / ram.total * 100}%}
		DISK: {rgb(255,131,0) ${disk.used / disk.total * 100}%}
		`);
		```
		*/
		(text: TemplateStringsArray, ...placeholders: unknown[]): string;

		(...text: unknown[]): string;
	}

	interface ChalkObject {
		/**
		Return a new Chalk instance.
		*/
		Instance: Instance;

		/**
		The color support for Chalk.
		By default, color support is automatically detected based on the environment.
		*/
		level: Level;

		/**
		Use HEX value to set text color.

		@param color - Hexadecimal value representing the desired color.

		@example
		```
		import chalk = require('chalk');

		chalk.hex('#DEADED');
		```
		*/
		hex(color: string): Chalk;

		/**
		Use keyword color value to set text color.

		@param color - Keyword value representing the desired color.

		@example
		```
		import chalk = require('chalk');

		chalk.keyword('orange');
		```
		*/
		keyword(color: string): Chalk;

		/**
		Use RGB values to set text color.
		*/
		rgb(red: number, green: number, blue: number): Chalk;

		/**
		Use HSL values to set text color.
		*/
		hsl(hue: number, saturation: number, lightness: number): Chalk;

		/**
		Use HSV values to set text color.
		*/
		hsv(hue: number, saturation: number, value: number): Chalk;

		/**
		Use HWB values to set text color.
		*/
		hwb(hue: number, whiteness: number, blackness: number): Chalk;

		/**
		Use a [Select/Set Graphic Rendition](https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_parameters) (SGR) [color code number](https://en.wikipedia.org/wiki/ANSI_escape_code#3/4_bit) to set text color.

		30 <= code && code < 38 || 90 <= code && code < 98
		For example, 31 for red, 91 for redBright.
		*/
		ansi(code: number): Chalk;

		/**
		Use a [8-bit unsigned number](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit) to set text color.
		*/
		ansi256(index: number): Chalk;

		/**
		Use HEX value to set background color.

		@param color - Hexadecimal value representing the desired color.

		@example
		```
		import chalk = require('chalk');

		chalk.bgHex('#DEADED');
		```
		*/
		bgHex(color: string): Chalk;

		/**
		Use keyword color value to set background color.

		@param color - Keyword value representing the desired color.

		@example
		```
		import chalk = require('chalk');

		chalk.bgKeyword('orange');
		```
		*/
		bgKeyword(color: string): Chalk;

		/**
		Use RGB values to set background color.
		*/
		bgRgb(red: number, green: number, blue: number): Chalk;

		/**
		Use HSL values to set background color.
		*/
		bgHsl(hue: number, saturation: number, lightness: number): Chalk;

		/**
		Use HSV values to set background color.
		*/
		bgHsv(hue: number, saturation: number, value: number): Chalk;

		/**
		Use HWB values to set background color.
		*/
		bgHwb(hue: number, whiteness: number, blackness: number): Chalk;

		/**
		Use a [Select/Set Graphic Rendition](https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_parameters) (SGR) [color code number](https://en.wikipedia.org/wiki/ANSI_escape_code#3/4_bit) to set background color.

		30 <= code && code < 38 || 90 <= code && code < 98
		For example, 31 for red, 91 for redBright.
		Use the foreground code, not the background code (for example, not 41, nor 101).
		*/
		bgAnsi(code: number): Chalk;

		/**
		Use a [8-bit unsigned number](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit) to set background color.
		*/
		bgAnsi256(index: number): Chalk;

		/**
		Modifier: Resets the current color chain.
		*/
		readonly reset: ChalkProperty;

		/**
		Modifier: Make text bold.
		*/
		readonly bold: ChalkProperty;

		/**
		Modifier: Emitting only a small amount of light.
		*/
		readonly dim: ChalkProperty;

		/**
		Modifier: Make text italic. (Not widely supported)
		*/
		readonly italic: ChalkProperty;

		/**
		Modifier: Make text underline. (Not widely supported)
		*/
		readonly underline: ChalkProperty;

		/**
		Modifier: Inverse background and foreground colors.
		*/
		readonly inverse: ChalkProperty;

		/**
		Modifier: Prints the text, but makes it invisible.
		*/
		readonly hidden: ChalkProperty;

		/**
		Modifier: Puts a horizontal line through the center of the text. (Not widely supported)
		*/
		readonly strikethrough: ChalkProperty;

		/**
		Modifier: Prints the text only when Chalk has a color support level > 0.
		Can be useful for things that are purely cosmetic.
		*/
		readonly visible: ChalkProperty;

		readonly black: ChalkProperty;
		readonly red: ChalkProperty;
		readonly green: ChalkProperty;
		readonly yellow: ChalkProperty;
		readonly blue: ChalkProperty;
		readonly magenta: ChalkProperty;
		readonly cyan: ChalkProperty;
		readonly white: ChalkProperty;

		/*
		Alias for `blackBright`.
		*/
		readonly gray: ChalkProperty;

		/*
		Alias for `blackBright`.
		*/
		readonly grey: ChalkProperty;

		readonly blackBright: ChalkProperty;
		readonly redBright: ChalkProperty;
		readonly greenBright: ChalkProperty;
		readonly yellowBright: ChalkProperty;
		readonly blueBright: ChalkProperty;
		readonly magentaBright: ChalkProperty;
		readonly cyanBright: ChalkProperty;
		readonly whiteBright: ChalkProperty;

		readonly bgBlack: ChalkProperty;
		readonly bgRed: ChalkProperty;
		readonly bgGreen: ChalkProperty;
		readonly bgYellow: ChalkProperty;
		readonly bgBlue: ChalkProperty;
		readonly bgMagenta: ChalkProperty;
		readonly bgCyan: ChalkProperty;
		readonly bgWhite: ChalkProperty;

		/*
		Alias for `bgBlackBright`.
		*/
		readonly bgGray: ChalkProperty;

		/*
		Alias for `bgBlackBright`.
		*/
		readonly bgGrey: ChalkProperty;

		readonly bgBlackBright: ChalkProperty;
		readonly bgRedBright: ChalkProperty;
		readonly bgGreenBright: ChalkProperty;
		readonly bgYellowBright: ChalkProperty;
		readonly bgBlueBright: ChalkProperty;
		readonly bgMagentaBright: ChalkProperty;
		readonly bgCyanBright: ChalkProperty;
		readonly bgWhiteBright: ChalkProperty;
	}

	interface ChalkProperty extends ChalkObject, ChalkFunction {}

	interface Chalk extends ChalkObject, ChalkFunction, ChalkTemplateFunction {}
}

/**
Main Chalk object that allows to chain styles together.
Call the last one as a method with a string argument.
Order doesn't matter, and later styles take precedent in case of a conflict.
This simply means that `chalk.red.yellow.green` is equivalent to `chalk.green`.
*/
declare const chalk: chalk.Chalk & chalk.ChalkFunction & chalk.ChalkTemplateFunction & {
	supportsColor: chalk.ColorSupport | false;
	Level: typeof LevelEnum;
	Color: Color;
	ForegroundColor: ForegroundColor;
	BackgroundColor: BackgroundColor;
	Modifiers: Modifiers;
	stderr: chalk.Chalk & {supportsColor: chalk.ColorSupport | false};
};

export = chalk;
