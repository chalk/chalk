<h1 align="center">
	<br>
	<br>
	<img width="320" src="media/logo.svg" alt="Chalk">
	<br>
	<br>
	<br>
</h1>

> 终端字符串的正确样式

[![Coverage Status](https://coveralls.io/repos/github/chalk/chalk/badge.svg?branch=main)](https://coveralls.io/github/chalk/chalk?branch=main)
[![npm dependents](https://badgen.net/npm/dependents/chalk)](https://www.npmjs.com/package/chalk?activeTab=dependents) [![Downloads](https://badgen.net/npm/dt/chalk)](https://www.npmjs.com/package/chalk)
[![run on repl.it](https://repl.it/badge/github/chalk/chalk)](https://repl.it/github/chalk/chalk)
[![Support Chalk on DEV](https://badge.devprotocol.xyz/0x44d871aebF0126Bf646753E2C976Aa7e68A66c15/descriptive)](https://stakes.social/0x44d871aebF0126Bf646753E2C976Aa7e68A66c15)

<img src="https://cdn.jsdelivr.net/gh/chalk/ansi-styles@8261697c95bf34b6c7767e2cbe9941a851d59385/screenshot.svg" width="900">

<br>

---

[English](./readme.md) | [中文文档](./readme_zh.md)

---

<div align="center">
	<p>
		<p>
			<sup>
				Sindre Sorhus的开源工作得到了<a href="https://github.com/sponsors/sindresorhus">GitHub Sponsors</a> 和 <a href="https://stakes.social/0x44d871aebF0126Bf646753E2C976Aa7e68A66c15">Dev</a>的支持
			</sup>
		</p>
		<sup>特别鸣谢:</sup>
		<br>
		<br>
		<a href="https://standardresume.co/tech">
			<img src="https://sindresorhus.com/assets/thanks/standard-resume-logo.svg" width="160"/>
		</a>
		<br>
		<br>
		<a href="https://retool.com/?utm_campaign=sindresorhus">
			<img src="https://sindresorhus.com/assets/thanks/retool-logo.svg" width="210"/>
		</a>
		<br>
		<br>
		<a href="https://doppler.com/?utm_campaign=github_repo&utm_medium=referral&utm_content=chalk&utm_source=github">
			<div>
				<img src="https://dashboard.doppler.com/imgs/logo-long.svg" width="240" alt="Doppler">
			</div>
			<b>All your environment variables, in one place</b>
			<div>
				<span>Stop struggling with scattered API keys, hacking together home-brewed tools,</span>
				<br>
				<span>and avoiding access controls. Keep your team and servers in sync with Doppler.</span>
			</div>
		</a>
	</p>
</div>

---

<br>

## 重点介绍

- 富有表现力的 API
- 高性能
- 能够嵌套样式
- [支持 256/Truecolor 颜色](#256-and-truecolor-color-support)
- 自动检测颜色支持
- 不扩展`String.prototype`
- 干净而专注
- 积极维护
- 截至 2020 年 1 月 1 日，[约有 50,000 个软件包使用](https://www.npmjs.com/browse/depended/chalk)

## 安装

```console
$ npm install chalk
```

## 使用方法

```js
import chalk from "chalk";

console.log(chalk.blue("Hello world!"));
```

Chalk 有一个易于使用的可组合的 API，你只需将你想要的样式连锁和嵌套。

```js
import chalk from "chalk";

const log = console.log;

// 组合风格化字符串和普通字符串
log(chalk.blue("Hello") + " World" + chalk.red("!"));

// 使用可连锁的API构成多种样式
log(chalk.blue.bgRed.bold("Hello world!"));

// 传入多个参数
log(chalk.blue("Hello", "World!", "Foo", "bar", "biz", "baz"));

// 嵌套样式
log(chalk.red("Hello", chalk.underline.bgBlue("world") + "!"));

// 同一类型的嵌套样式，甚至（颜色、下划线、背景）。
log(
	chalk.green(
		"I am a green line " +
			chalk.blue.underline.bold("with a blue substring") +
			" that becomes green again!"
	)
);

// ES2015 字符串模板
log(`
CPU: ${chalk.red("90%")}
RAM: ${chalk.green("40%")}
DISK: ${chalk.yellow("70%")}
`);

// ES2015 标签化字符串模板
log(chalk`
CPU: {red ${cpu.totalPercent}%}
RAM: {green ${(ram.used / ram.total) * 100}%}
DISK: {rgb(255,131,0) ${(disk.used / disk.total) * 100}%}
`);

// 在支持RGB颜色的终端中使用RGB颜色
log(chalk.rgb(123, 45, 67).underline("Underlined reddish color"));
log(chalk.hex("#DEADED").bold("Bold gray!"));
```

轻松地定义你自己的主题:

```js
import chalk from "chalk";

const error = chalk.bold.red;
const warning = chalk.hex("#FFA500"); // Orange color

console.log(error("Error!"));
console.log(warning("Warning!"));
```

利用 console.log[字符串替换](https://nodejs.org/docs/latest/api/console.html#console_console_log_data_args)的优势:

```js
import chalk from "chalk";

const name = "Sindre";
console.log(chalk.green("Hello %s"), name);
//=> 'Hello Sindre'
```

## API

### chalk.`<style>[.<style>...](string, [string...])`

Example: `chalk.red.bold.underline('Hello', 'world');`

将[styles](#styles)连锁起来，并将最后一个作为一个方法，用一个字符串参数来调用。顺序并不重要，如果发生冲突，后面的样式会优先使用。这只是意味着`chalk.red.yellow.green`等同于`chalk.green`。

多个参数将用空格分隔。

### chalk.level

指定颜色支持的程度。

颜色支持是自动检测的，但是你可以通过设置`level`属性来覆盖它。然而，你应该只在你自己的代码中这样做，因为它适用于全球所有的 Chalk 消费者。

如果你需要在一个可重用的模块中改变这一点，请创建一个新的实例:

```js
import { Chalk } from "chalk";

const customChalk = new Chalk({ level: 0 });
```

| Level | Description             |
| :---: | :---------------------- |
|  `0`  | 禁用所有颜色            |
|  `1`  | 基本颜色支持(16 种颜色) |
|  `2`  | 256 种颜色支持          |
|  `3`  | 支持真彩色(1600 万色)   |

### supportsColor

检测终端是否[支持颜色](https://github.com/chalk/supports-color)。内部使用并为你处理，但为了方便而暴露出来。

可以由用户用标志`--color`和`--no-color`来重写。在无法使用`--color`的情况下，使用环境变量`FORCE_COLOR=1`（1 级），`FORCE_COLOR=2`（2 级），或`FORCE_COLOR=3`（3 级）来强制启用颜色，或`FORCE_COLOR=0`来强制禁用。使用`FORCE_COLOR`会覆盖所有其他颜色支持检查。

明确的 256/Truecolor 模式可以分别使用`--color=256`和`--color=16m`标志启用。

### chalkStderr and supportsColorStderr

`chalkStderr`包含一个单独的实例，配置了对`stderr`流而不是`stdout`的颜色支持。`supportsColor`的覆盖规则也适用于此。`supportsColorStderr`是为了方便而暴露的。

## Styles

### Modifiers

- `reset` - 重置当前的颜色链
- `bold` - 将文本加粗
- `dim` - 发出少量的光.
- `italic` - 文字变成斜体。_(不广泛支持)_
- `underline` - 文字下划线。_(不广泛支持)_
- `inverse`- 反向的背景和前景颜色
- `hidden` - 打印文本，但使其不可见
- `strikethrough` - 在文本的中心放置一条横线 _(不广泛支持)_
- `visible`- 只有当 Chalk 的颜色级别大于 0 时，才会打印文本。 对于纯粹的外观的东西，可能很有用。

### Colors

- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`
- `blackBright` (alias: `gray`, `grey`)
- `redBright`
- `greenBright`
- `yellowBright`
- `blueBright`
- `magentaBright`
- `cyanBright`
- `whiteBright`

### Background colors

- `bgBlack`
- `bgRed`
- `bgGreen`
- `bgYellow`
- `bgBlue`
- `bgMagenta`
- `bgCyan`
- `bgWhite`
- `bgBlackBright` (alias: `bgGray`, `bgGrey`)
- `bgRedBright`
- `bgGreenBright`
- `bgYellowBright`
- `bgBlueBright`
- `bgMagentaBright`
- `bgCyanBright`
- `bgWhiteBright`

## Tagged template literal

可以作为[标记的模板字面](https://exploringjs.com/es6/ch_template-literals.html#_tagged-template-literals)使用。

```js
import chalk from "chalk";

const miles = 18;
const calculateFeet = (miles) => miles * 5280;

console.log(chalk`
	There are {bold 5280 feet} in a mile.
	In {bold ${miles} miles}, there are {green.bold ${calculateFeet(miles)} feet}.
`);
```

区块由一个开头的大括号（`{`）、一个样式、一些内容和一个结尾的大括号（`}`）限定。

模板样式与普通的 chalk 样式完全是连锁的。以下三条语句是等价的。

```js
import chalk from "chalk";

console.log(chalk.bold.rgb(10, 100, 200)("Hello!"));
console.log(chalk.bold.rgb(10, 100, 200)`Hello!`);
console.log(chalk`{bold.rgb(10,100,200) Hello!}`);
```

请注意，函数样式（`rgb()`，`hex()`，等等）在参数之间不能包含空格。

所有插值（`` Chalk `${foo}`  ``）都通过`.toString()`方法转换为字符串。内插值字符串中的所有大括号（`{`和`}`）都被转义。

## 支持 256 色和真彩色

在支持的终端应用程序上，Chalk 支持 256 色和[真彩](https://gist.github.com/XVilka/8346728)(1600 万色)。

颜色从 1600 万个 RGB 值下采样到终端模拟器支持的 ANSI 颜色格式（或者通过指定`{level:n}`作为 Chalk 选项）。例如，配置为 1 级（基本颜色支持）的 Chalk 将把#FF0000（红色）的 RGB 值下采样为 31（红色的 ANSI 转义）。

Examples:

- `chalk.hex('#DEADED').underline('Hello, world!')`
- `chalk.rgb(15, 100, 204).inverse('Hello!')`

这些模型的背景版本以 `bg` 为前缀，模块的第一层大写（例如，`hex` 代表前景色，`bgHex` 代表背景色）。

- `chalk.bgHex('#DEADED').underline('Hello, world!')`
- `chalk.bgRgb(15, 100, 204).inverse('Hello!')`

可以使用以下颜色模式:

- [`rgb`](https://en.wikipedia.org/wiki/RGB_color_model) - Example: `chalk.rgb(255, 136, 0).bold('Orange!')`
- [`hex`](https://en.wikipedia.org/wiki/Web_colors#Hex_triplet) - Example: `chalk.hex('#FF8800').bold('Orange!')`
- [`ansi256`](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit) - Example: `chalk.bgAnsi256(194)('Honeydew, more or less')`

## Browser support

从 Chrome 69 开始，开发者控制台就支持 ANSI 转义代码了

## Windows

如果你在 Windows 上，请使用[Windows Terminal](https://github.com/microsoft/terminal)而不是`cmd.exe`。

## Origin story

[colors.js](https://github.com/Marak/colors.js)曾经是最流行的字符串造型模块，但它有严重的缺陷，如扩展`String.prototype`会导致各种[问题](https://github.com/yeoman/yo/issues/68)，而且该包没有维护。虽然有其他的包，但它们要么做得太多，要么做得不够。Chalk 是一个干净而集中的替代方案。

## chalk for enterprise

作为 Tidelift 订阅的一部分提供

Chalk 和其他数千个软件包的维护者正在与 Tidelift 合作，为您用来构建应用程序的开源依赖提供商业支持和维护。节省时间，降低风险，提高代码健康度，同时向您使用的确切依赖的维护者付费。[了解更多](https://tidelift.com/subscription/pkg/npm-chalk?utm_source=npm-chalk&utm_medium=referral&utm_campaign=enterprise&utm_term=repo)

## 相关内容

- [chalk-cli](https://github.com/chalk/chalk-cli) - 该模块的 CLI
- [ansi-styles](https://github.com/chalk/ansi-styles) - 终端中造型字符串的 ANSI 转义代码
- [supports-color](https://github.com/chalk/supports-color) - 检测一个终端是否支持颜色
- [strip-ansi](https://github.com/chalk/strip-ansi) - 剥离 ANSI 的转义代码
- [strip-ansi-stream](https://github.com/chalk/strip-ansi-stream) - 从一个流中剥离 ANSI 转义代码
- [has-ansi](https://github.com/chalk/has-ansi) - 检查一个字符串是否有 ANSI 转义代码
- [ansi-regex](https://github.com/chalk/ansi-regex) - 用于匹配 ANSI 转义代码的正则表达式
- [wrap-ansi](https://github.com/chalk/wrap-ansi) - 用 ANSI 转义代码对字符串进行文字处理
- [slice-ansi](https://github.com/chalk/slice-ansi) - 用 ANSI 转义代码对一个字符串进行切片
- [color-convert](https://github.com/qix-/color-convert) - 在不同的模型之间转换颜色
- [chalk-animation](https://github.com/bokub/chalk-animation) - 在终端对字符串进行动画处理
- [gradient-string](https://github.com/bokub/gradient-string) - 对字符串应用颜色渐变
- [chalk-pipe](https://github.com/LitoMore/chalk-pipe) - 用更简单的风格字符串创建 Chalk 风格方案
- [terminal-link](https://github.com/sindresorhus/terminal-link) - 在终端创建可点击的链接

## Maintainers

- [Sindre Sorhus](https://github.com/sindresorhus)
- [Josh Junon](https://github.com/qix-)
