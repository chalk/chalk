/**
Check if [`argv`](https://nodejs.org/docs/latest/api/process.html#process_process_argv) has a specific flag.

@param flag - CLI flag to look for. The `--` prefix is optional.
@param argv - CLI arguments. Default: `process.argv`.
@returns Whether the flag exists.

It correctly stops looking after an `--` argument terminator.

@example
```
// $ ts-node foo.ts -f --unicorn --foo=bar -- --rainbow

// foo.ts
import hasFlag from 'has-flag';

hasFlag('unicorn');
//=> true

hasFlag('--unicorn');
//=> true

hasFlag('f');
//=> true

hasFlag('-f');
//=> true

hasFlag('foo=bar');
//=> true

hasFlag('foo');
//=> false

hasFlag('rainbow');
//=> false
```
*/
export default function hasFlag(flag: string, argv?: readonly string[]): boolean;
