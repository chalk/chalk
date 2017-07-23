// Type definitions for Chalk
// Definitions by: Thomas Sauer <https://github.com/t-sauer>

export default chalk;

declare function chalk(...text: string[]): string;
declare function chalk(text: TemplateStringsArray, ...placeholders: string[]): string;

declare namespace chalk {

	export enum Level {
		None = 0,
		Basic = 1,
		Extended = 2,
		TrueColor = 3
	}

	interface ConstructorOptions {
		enabled?: boolean;
		level?: Level;
	}

	export function constructor(options?: ConstructorOptions): typeof chalk;

	export let enabled: boolean;
	export let level: Level;
	export const supportsColor: boolean;

	export const hex: (color: string) => typeof chalk;
	export const keyword: (color: string) => typeof chalk;
	export const rgb: (r: number, g: number, b: number) => typeof chalk;
	export const hsl: (h: number, s: number, l: number) => typeof chalk;
	export const hsv: (h: number, s: number, v: number) => typeof chalk;
	export const hwb: (h: number, w: number, b: number) => typeof chalk;

	export const bgHex: (color: string) => typeof chalk;
	export const bgKeyword: (color: string) => typeof chalk;
	export const bgRgb: (r: number, g: number, b: number) => typeof chalk;
	export const bgHsl: (h: number, s: number, l: number) => typeof chalk;
	export const bgHsv: (h: number, s: number, v: number) => typeof chalk;
	export const bgHwb: (h: number, w: number, b: number) => typeof chalk;

	export const reset: typeof chalk;
	export const bold: typeof chalk;
	export const dim: typeof chalk;
	export const italic: typeof chalk;
	export const underline: typeof chalk;
	export const inverse: typeof chalk;
	export const hidden: typeof chalk;
	export const strikethrough: typeof chalk;

	export const black: typeof chalk;
	export const red: typeof chalk;
	export const green: typeof chalk;
	export const yellow: typeof chalk;
	export const blue: typeof chalk;
	export const magenta: typeof chalk;
	export const cyan: typeof chalk;
	export const white: typeof chalk;
	export const gray: typeof chalk;
	export const grey: typeof gray;
	export const blackBright: typeof chalk;
	export const redBright: typeof chalk;
	export const greenBright: typeof chalk;
	export const yellowBright: typeof chalk;
	export const blueBright: typeof chalk;
	export const magentaBright: typeof chalk;
	export const cyanBright: typeof chalk;
	export const whiteBright: typeof chalk;

	export const bgBlack: typeof chalk;
	export const bgRed: typeof chalk;
	export const bgGreen: typeof chalk;
	export const bgYellow: typeof chalk;
	export const bgBlue: typeof chalk;
	export const bgMagenta: typeof chalk;
	export const bgCyan: typeof chalk;
	export const bgWhite: typeof chalk;
	export const bgBlackBright: typeof chalk;
	export const bgRedBright: typeof chalk;
	export const bgGreenBright: typeof chalk;
	export const bgYellowBright: typeof chalk;
	export const bgBlueBright: typeof chalk;
	export const bgMagentaBright: typeof chalk;
	export const bgCyanBright: typeof chalk;
	export const bgWhiteBright: typeof chalk;
}
