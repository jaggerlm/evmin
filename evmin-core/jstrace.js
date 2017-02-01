(function(){
	var fs = require('fs');
	var program = require('commander'); 
	var DDGReader = require('./src/js/commands/DDGReader.js').DDGReader;
	require('./src/js/jalangi/instrument/locationToiid.js');


	function list(val){
		return val.split(',')
	}
	program
		.version('0.1')
		.usage('[options] [value ...]')
		.option('-s, --sid <string>', 'a string sid')
		.option('-L, --maxLength <n>', 'event sequence maxlength constraint')
		.option('-g, --granularity <n>', '1(DOM_L1),2(DOM_L2),3(fine-grained DOM_L3)',parseInt)
		.option('-e, --errorEvents <items>', 'error event list',list)
		.option('-w, --weak', 'to perform weak analysis')
		.option('-l, --log', 'the log file to be analyzed')
		.option('-p, --precise <string>', 'a string sid')
		.option('-S, --source <string>', 'a string source file name')
		.option('-r, --range <L>..<H>','line range of code file to analyze')
		.on('--help', function(){
			console.log('Examples:');
			console.log('\n#slice by error event list');
			console.log('node jstrace slice -s 11111 -g 3 -e 7,8');
			console.log('\n#aggresive slice by given range of code');
			console.log('node jstrace ps -s 11111 jQuery.js -r 100..200 -e 7,8');
		});
	
	

	function Options(options){
		this.o = false;
		this.debug = true;
		this.dpsLevel = 'opid';
		for(var opt in options){
			this[opt] = options[opt];
		}
	}

	program.command('ps')
		.description('[deprecated] precise slice which only use assertion infomations')
		.action(function(){
			console.log('--precise slicing');
			var sid = program.sid;
			J$.reloadIids(sid);
			var options = new Options({sid:sid,src:program.source});
			var ddg = new DDGReader(options);
			var file = './log/'+sid+'_2.log.p';
			faultCriterion = ddg.getFaultCriterionByIids2(program.errorEvents,J$.locationToIid(sid,function(rcd){
				if(rcd[0] == file && program.range[0]<=rcd[1] && program.range[1]>=rcd[3]){
					 return true;
				}
			}));
			ddg.getSlice(faultCriterion,{file:file,request:program.args}).list;
		});
	program.command('slice')
		.description('dynamic slicing')
		.action(function(){
			var sid = program.sid;
			J$.reloadIids(sid);
			var file = './log/'+sid+'_2.log';
			var options = new Options({sid:sid,file:file,weak:program.weak,granularity:program.granularity});
			var reader = new DDGReader(options);
			reader.getSlice(program.errorEvents).list;
		});
	
	program.parse(process.argv);
	exports.program = program;
})()
