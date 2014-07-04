// ran through matcha
// ./node_modules/matcha/bin/matcha benchmark.js

var chalk = require('./index.js');

suite('chalk', function(){

	bench('add colour', function(){
		chalk.red('the fox jumps over the lazy dog');
	});

	bench('add several styles', function(){
		chalk.blue.bgRed.bold('the fox jumps over the lazy dog') ;
	});

	bench('add nested styles', function(){
		chalk.red('the fox jumps ', chalk.underline.bgBlue('over the lazy dog') + '!') ;
	});

});
