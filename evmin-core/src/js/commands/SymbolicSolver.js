(function(){
	var config = require('../jalangi.config.js').config;
	//var logger = require('../log4js.js').logger;
	var logger = console;
	var fsutils = require('fs-utils');
	var fs = require('fs')
	var execSync = require('exec-sync');

	function Z3py(consFile,solutionFile){
		this.consFile = consFile;
		this.solutionFile = solutionFile;
		if(fs.existsSync(consFile)){
			fs.unlinkSync(consFile);
		}
		if(fs.existsSync(solutionFile)){
			fs.unlinkSync(solutionFile);
		}
		this.wstream = fs.createWriteStream(consFile);
		this.wstream.write(Z3py.templete());
		this.indent = 1;
	}
	Z3py.commands = {
		GENERATE_SEQUENCES:'solveSeqGen',
		VALIDATE_CANDIDATES:'solveSeqValid'
	}
	Z3py.prototype.execute = function(command,args){
		var args = args.join(',') || '';
		this.writeln(command+'('+args+')');
		this.end();
	}
	Z3py.templete = function(){
		return fsutils.readFileSync('./src/js/tpl/z3Solver.py').toString();
	}
	
	Z3py.prototype.getIndent = function(){
		var res = '';
		for(var i=0;i<this.indent;i++){
			res+='    ';
		}
		return res;
	}
	Z3py.prototype.comment = function(comment){
		this.writeln('#'+comment);
	}
	
	Z3py.prototype.end = function(){
		this.wstream.end();
		logger.info('Resolving:', 'python ' + this.consFile);
		logger.info('Solutions:', this.solutionFile);
		//var res = execSync('python ' + this.consFile);
		//console.log(res);
	}
	
	Z3py.prototype.writeln = function(line){
		this.wstream.write(this.getIndent()+(line||'')+'\n');
	}
		
	function SymbolicSolver(options){
		this.sid = options.sid;
		this.traceFile = options.traceFile;
		this.errors = options.errors || [];
		this.maxLength = options.maxLength;
		this.timeout = options.timeout || 3600; //s
		this.maxSolutionsForEachLengh = options.maxSolutionsForEachLengh;
		this.expected = options.expected;
		this.baseDir = config.logpath + this.sid+'_z3/';
		
		this.candidatesConstraints = this.baseDir+'generatingCons.py';
		this.candidatesSolutions = this.baseDir+'candidates.js'; 
		this.validatesConstraints = this.baseDir+'validatingCons.py';
		this.validatedSolutions = this.baseDir+ 'solutions.js';
		this.result = this.baseDir + 'result';
		this.checkLog = this.baseDir+ 'check'
		this.init();
	}
	

	SymbolicSolver.prototype.init = function(){
		//fsutils.del(this.baseDir);
		fsutils.mkdirSync(this.baseDir);
		var cons = fsutils.readJSONSync(this.traceFile);
		this.generatings = cons.generatings || {};
		this.validatings = cons.validatings || {};
		this.symbols = cons.symbols || {};
		this.events = cons.events || [];
		this.events = this.events.filter(function(value){return value !='undefined'})
		this.pathConstraints = cons.pathConstraints;
	}

	// sequence generating
	SymbolicSolver.prototype.generating = function(){
		logger.info('event sequence generation for symbolic trace:', this.traceFile);
		var z3 = new Z3py(this.candidatesConstraints,this.candidatesSolutions);
		z3.writeln('logger = Logger("'+this.checkLog+'")');
		z3.writeln('timeout = '+this.timeout);
		z3.writeln();

		z3.comment('Event declarations:');
		z3.comment('  0: not selected; 1: selected');
		//z3.writeln('events = ['+this.events.toString()+']');
		z3.writeln('s = Solver()');
		z3.writeln('v = _declareEvents(['+this.events.toString()+'])');	
		z3.writeln('v.e0 = 1');

		z3.writeln();
		z3.comment('Pre-defiend error events');
		z3.writeln('errors = ['+this.errors.toString()+']');
		z3.writeln();
		z3.comment('Data compatible constraints');
		z3.writeln('generatings = {}');
		for(i in this.generatings){
			z3.writeln('generatings["'+i+'"] = '+this.generatings[i]);
		}

		z3.writeln();
		z3.comment('MaxLength constraints: Try all solutions with a given sequence length <= maxLength');
		var expected = this.expected && this.expected.length>0 ? '['+this.expected.toString()+']' : 'None';
		z3.execute(Z3py.commands.GENERATE_SEQUENCES,['s',this.maxLength,this.maxSolutionsForEachLengh,'v','errors','generatings','"'+this.candidatesSolutions+'"',expected]);
		
	}
	function containsAll(arr1,arr2){
		for(var i=0;i<arr2.length;i++){
			if(arr1.indexOf(arr2[i])<0){
				return false;
			}
		}
		return true;
	}

	
	SymbolicSolver.prototype.validating2 = function(expected){
		function _save(){
		
		}
		require('../../../'+this.candidatesSolutions);
		console.log('Expected solution: [length='+expected.length+']', expected);
		var rank = 0;
		var constraintSolvingTime = 0;
		var lists = [];
		var validCandidate;
		for( var i in solutionForEachLen){
			for(var j=0;j<solutionForEachLen[i].length;j++){
				rank++;
				var solution = solutionForEachLen[i][j];
				constraintSolvingTime += solution.time;
				lists.push(solution.list);
				if(containsAll(solution.list,expected)){
					validCandidate = solution.list;
					break;
				}
			}
			if(validCandidate)
				break;
		}
		if(validCandidate){
			console.log('Find valid solution: [length='+i+']', solution.list);
			console.log('Rank:',rank);
		}else{
			console.log('No valid solution yet');
		}
		
		console.log('Evaluation result file:',this.result);
		console.log('Constraint Solving Time:', constraintSolvingTime.toFixed(1)+'s');
		var res = {};
		res.expected = expected;
		res.solution = validCandidate;
		res.candidates = lists;
		res.rank = rank;
		res.constraintSolvingTime = new Number ((constraintSolvingTime * 1000).toFixed());
		fs.writeFileSync(this.result,JSON.stringify(res));

	}	
	//sequence validating
	SymbolicSolver.prototype.validating = function(){
		logger.info('event sequence validating for symbolic trace:', this.traceFile);
		var z3 = new Z3py(this.validatesConstraints,this.validatedSolutions);
		z3.writeln('logger = Logger("'+this.checkLog+'")');
		z3.writeln();

		//require('../../../'+this.candidatesSolutions);
		z3.comment('Event declarations:');
		z3.comment('  0: not selected; 1: selected');
		z3.writeln('s = Solver()');
		z3.writeln('v = _declareEvents(['+this.events.toString()+'])');

		z3.comment('reduced event sequence constraints');
		z3.writeln('validatings = {}');
		for(var i in this.validatings){
			z3.writeln('validatings["'+i+'"] = '+this.validatings[i]);
		}
		z3.writeln();

		z3.comment('path constraints');
		z3.writeln('validatings["pathConstraints"] = ' + this.pathConstraints);		
		z3.writeln();

		z3.comment('assertions');
		z3.writeln();

		z3.comment('solutions');
		var lines = fs.readFileSync(this.candidatesSolutions).toString().split('\n');
		for(i=0;i<lines.length;i++){
			z3.writeln(lines[i]);
		}
		z3.execute(Z3py.commands.VALIDATE_CANDIDATES,['s','v','validatings','solutionForEachLen','"'+this.validatedSolutions+'"']);
	}

	exports.SymbolicSolver = SymbolicSolver;
})();
