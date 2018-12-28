import {expectType} from 'tsd-check';
import chalkStderr, {Level, Chalk, ColorSupport} from './stderr';

// - Helpers -
type colorReturn = Chalk & {supportsColor: ColorSupport};

// - supportsColor -
expectType<boolean>(chalkStderr.supportsColor.hasBasic);
expectType<boolean>(chalkStderr.supportsColor.has256);
expectType<boolean>(chalkStderr.supportsColor.has16m);

// - Chalk -
// -- Constructor --
expectType<Chalk>(new chalkStderr.constructor({level: 1}));

// -- Properties --
expectType<boolean>(chalkStderr.enabled);
expectType<Level>(chalkStderr.level);

// -- Template literal --
expectType<string>(chalkStderr``);

// -- Color methods --
expectType<colorReturn>(chalkStderr.hex('#DEADED'));

// -- Complex --
expectType<string>(chalkStderr.underline.red.bgGreen('foo'));
