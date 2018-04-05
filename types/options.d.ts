declare namespace Chalk {
	export const enum Level {
		None = 0,
		Basic = 1,
		Ansi256 = 2,
		TrueColor = 3
	}
	export interface Options {
		enabled?: boolean;
		level?: Chalk.Level;
	}
	export interface ColorSupport {
		level: Level;
		hasBasic: boolean;
		has256: boolean;
		has16m: boolean;
	}
}
