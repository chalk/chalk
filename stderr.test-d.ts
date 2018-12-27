import {expectType} from 'tsd-check';
import cherr, {Level, Chalk, ColorSupport} from './stderr';

// - Helpers -
type colorReturn = Chalk & {supportsColor: ColorSupport};

// - supportsColor -
expectType<boolean>(cherr.supportsColor.hasBasic);
expectType<boolean>(cherr.supportsColor.has256);
expectType<boolean>(cherr.supportsColor.has16m);

// - Chalk -
// -- Constructor --
expectType<Chalk>(new cherr.constructor({level: 1}));

// -- Properties --
expectType<boolean>(cherr.enabled);
expectType<Level>(cherr.level);

// -- Template literal --
expectType<string>(cherr``);

// -- Color methods --
expectType<colorReturn>(cherr.hex('#DEADED'));

// -- Complex --
expectType<string>(cherr.underline.red.bgGreen('foo'));
