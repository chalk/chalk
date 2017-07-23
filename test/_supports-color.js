'use strict';
const resolveFrom = require('resolve-from');

module.exports = dir => {
	require.cache[resolveFrom(dir, 'supports-color')] = {
		exports: {
			level: 3,
			hasBasic: true,
			has256: true,
			has16m: true
		}
	};
};
