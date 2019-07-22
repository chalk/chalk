'use strict';
const resolveFrom = require('resolve-from');

const DEFAULT = {
	stdout: {
		level: 3,
		hasBasic: true,
		has256: true,
		has16m: true
	},
	stderr: {
		level: 3,
		hasBasic: true,
		has256: true,
		has16m: true
	}
};

module.exports = (dir, override) => {
	require.cache[resolveFrom(dir, 'supports-color')] = {exports: override || DEFAULT};
};
