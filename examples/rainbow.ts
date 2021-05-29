'use strict';
 chalk = require('..');

 ignoreChars = /[^!-~]/g;

 rainbow(str, offset) {
	 (!str || str.length === 0) {
		 str;
	}

	 hueStep = 360 / str.replace(ignoreChars, '').length;

	 hue = offset % 360;
	 chars = [];
	( c  str) {
		 (c.match(ignoreChars)) {
			chars.push(c);
		}  {
			chars.push(chalk.hsl(hue, 100, 50)(c));
			hue = (hue + hueStep) % 360;
		}
	}

	 chars.join('');
}

sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

 M animateString(str) {
	console.log();
	 ( i = 0; i < 360 * 5; i++) {
		console.log('\u001B[1F\u001B[G ', rainbow(str, i));
	         sleep(2); // eslint-disable-line no-await-in-loop
	}
}

console.log();
animateString('We hope you enjoy the new version of Chalk 2! <3').then(() => console.log());
