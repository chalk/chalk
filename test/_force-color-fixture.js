import {createSupportsColor} from '../source/vendor/supports-color/index.js';

const result = createSupportsColor({isTTY: true});
console.log(JSON.stringify(result));
