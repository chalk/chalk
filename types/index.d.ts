// Type definitions for Chalk
// Definitions by: Thomas Sauer <https://github.com/t-sauer>

export const enum Level {
	None = 0,
	Basic = 1,
	Ansi256 = 2,
	TrueColor = 3
}

export interface ChalkOptions {
	enabled?: boolean;
	level?: Level;
}

export interface ChalkConstructor {
	new (options?: ChalkOptions): Chalk;
	(options?: ChalkOptions): Chalk;
}

export interface ColorSupport {
	level: Level;
	hasBasic: boolean;
	has256: boolean;
	has16m: boolean;
}

export interface Chalk {
	(...text: string[]): string;
	(text: TemplateStringsArray, ...placeholders: string[]): string;
	constructor: ChalkConstructor;
	enabled: boolean;
	level: Level;
	rgb(r: number, g: number, b: number): this;
	hsl(h: number, s: number, l: number): this;
	hsv(h: number, s: number, v: number): this;
	hwb(h: number, w: number, b: number): this;
	bgHex(color: string): this;
	bgKeyword(color: string): this;
	bgRgb(r: number, g: number, b: number): this;
	bgHsl(h: number, s: number, l: number): this;
	bgHsv(h: number, s: number, v: number): this;
	bgHwb(h: number, w: number, b: number): this;
	hex(color: string): this;
	keyword(color: string): this;

	reset: this;
	bold: this;
	dim: this;
	italic: this;
	underline: this;
	inverse: this;
	hidden: this;
	strikethrough: this;

	black: this;
	red: this;
	green: this;
	yellow: this;
	blue: this;
	magenta: this;
	cyan: this;
	white: this;
	gray: this;
	grey: this;
	blackBright: this;
	redBright: this;
	greenBright: this;
	yellowBright: this;
	blueBright: this;
	magentaBright: this;
	cyanBright: this;
	whiteBright: this;

	bgBlack: this;
	bgRed: this;
	bgGreen: this;
	bgYellow: this;
	bgBlue: this;
	bgMagenta: this;
	bgCyan: this;
	bgWhite: this;
	bgBlackBright: this;
	bgRedBright: this;
	bgGreenBright: this;
	bgYellowBright: this;
	bgBlueBright: this;
	bgMagentaBright: this;
	bgCyanBright: this;
	bgWhiteBright: this;
}

declare const chalk: Chalk & { supportsColor: ColorSupport };

export default chalk
