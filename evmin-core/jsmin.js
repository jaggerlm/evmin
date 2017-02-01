(function(){
	var program = require('commander');
	var SymbolicSolver = require('./src/js/commands/SymbolicSolver.js').SymbolicSolver;
	function list(val){
		return val.split(',')
	}

	program
		.version('0.1')
		.usage('[options] [value ...]')
		.option('-s, --sid <string>', 'a string sid')
		.option('-L, --maxLength <n>', 'event sequence maxlength constraint')
		.option('-e, --errorEvents <items>', 'error event list',list)
		.option('-E, --expected <items>', 'expected event list',list)
		.option('-t, --testid <string>', 'testid')
		.on('--help', function(){
			console.log('Examples:');
			console.log('\n#solving constraints');
			console.log('node jsmin gen -s 11111 -e 7,8 -L 5');
			console.log('\n#run test');
			console.log('node jsmin test -t 1');
		});
	
	var defaultMaxLen = 10;
	
	program
		.usage('[options] [value ...]')
		.on('--help', function(){
			console.log('Examples:');
			console.log('node evaluate.js gen_1');
		});

	program.command('gen')
		.description('generating event sequence candidates')
		.action(function(){
			var expected = program.expected.map(function(v){
				return parseInt(v);
			});
			new SymbolicSolver({
				sid:program.sid,
				traceFile:'./log/'+program.sid+'.syms',
				errors:program.errorEvents,
				maxLength:program.maxLength || 15,
				maxSolutionsForEachLengh:100,
				timeout:100,
				expected:expected
			}).generating();
		});
	program.command('check2')
		.action(function(){
			var expected = program.expected.map(function(v){
				return parseInt(v);
			});
			new SymbolicSolver({
				sid:program.sid,
				traceFile:'./log/'+program.sid+'.syms',
			}).validating2(expected);
		});
	program.command('check')
		.description('validating event sequence candidates')
		.action(function(){
			new SymbolicSolver({
				sid:program.sid,
				traceFile:'./log/'+program.sid+'.syms',
				errors:program.errorEvents,
			}).validating();
		});
	program.parse(process.argv);
})()
