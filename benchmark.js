import { Bench } from "tinybench";
import chalk from "./source/index.js";

const bench = new Bench({ time: 1 });

const chalkRed = chalk.red;
const chalkBgRed = chalk.bgRed;
const chalkBlueBgRed = chalk.blue.bgRed;
const chalkBlueBgRedBold = chalk.blue.bgRed.bold;

const blueStyledString =
	"the fox jumps" + chalk.blue("over the lazy dog") + "!";

bench
	.add("1 style", () => {
		chalk.red("the fox jumps over the lazy dog");
	})
	.add("2 styles", () => {
		chalk.blue.bgRed("the fox jumps over the lazy dog");
	})
	.add("3 styles", () => {
		chalk.blue.bgRed.bold("the fox jumps over the lazy dog");
	})
	.add("cached: 1 style", () => {
		chalkRed("the fox jumps over the lazy dog");
	})
	.add("cached: 2 styles", () => {
		chalkBlueBgRed("the fox jumps over the lazy dog");
	})
	.add("cached: 3 styles", () => {
		chalkBlueBgRedBold("the fox jumps over the lazy dog");
	})
	.add("cached: 1 style with newline", () => {
		chalkRed("the fox jumps\nover the lazy dog");
	})
	.add("cached: 1 style nested intersecting", () => {
		chalkRed(blueStyledString);
	})
	.add("cached: 1 style nested non-intersecting", () => {
		chalkBgRed(blueStyledString);
	})
	.add("cached: 1 style template literal", () => {
		// eslint-disable-next-line no-unused-expressions
		chalkRed`the fox jumps over the lazy dog`;
	})
	.add("cached: nested styles template literal", () => {
		// eslint-disable-next-line no-unused-expressions
		chalkRed`the fox {bold jumps} over the {underline lazy} dog`;
	});

await bench.run();

// Format throughput values with comma separators
const formatThroughput = (value) => {
	return Math.round(value).toLocaleString();
};

// Format time values in nanoseconds (converting from ms)
const formatTime = (milliseconds) => {
	const nanoseconds = milliseconds * 1e6;
	return Math.round(nanoseconds).toLocaleString() + " ns";
};

// Create custom table with throughput and time columns
const table = bench.tasks.map((task) => ({
	"Task name": task.name,
	"Throughput avg (ops/s)": formatThroughput(task.result.throughput.mean),
	"Throughput med (ops/s)": formatThroughput(task.result.throughput.p50),
	"Avg time per op": formatTime(task.result.latency.mean),
}));

console.table(table);
