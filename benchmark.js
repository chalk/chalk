import { Bench } from "tinybench";
import chalk from "./source/index.js";

const bench = new Bench({ time: 150 });

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

// Custom table output without samples, latency med, or throughput med
const customTable = bench.tasks.map((task) => ({
	"Task name": task.name,
	// 'Latency avg (ns)': task.result.latency.mean.toFixed(2) + ' ± ' + task.result.latency.rme.toFixed(2) + '%',
	"Throughput avg (ops/s)":
		task.result.throughput.mean.toFixed(0) +
		" ± " +
		task.result.throughput.rme.toFixed(2) +
		"%",
}));

console.table(customTable);
