var chalk = require('./');

suite('chalk', function () {
	set('iterations', 100000);

	bench('single style', function () {
		chalk.red('the fox jumps over the lazy dog');
	});

	bench('several styles', function () {
		chalk.blue.bgRed.bold('the fox jumps over the lazy dog');
	});

	var cached = chalk.blue.bgRed.bold;
	bench('cached styles', function () {
		cached('the fox jumps over the lazy dog');
	});

	bench('nested styles', function () {
		chalk.red('the fox jumps', chalk.underline.bgBlue('over the lazy dog') + '!');
	});
});
