if(typeof R$ == 'undefined'){
	R$ = {};
}
(function(rr){
	var getConcrete = R$.dps.AnotatedValue.getConcrete;	
	var logger = R$.common.util.logger;

	function AssertInterceptor(){
		this.itcpt = function(iid,f,base,args,result, isMethod){
			if(base == Assert && isMethod){
				return {result:result};
			}
			return null;
		}
	}
	
	R$.assertInterceptor = new AssertInterceptor();

	function Assert(){

	}

	Assert.instArg = {wrapProgram:false,isEval:true};

	Assert.assertTrue = Assert.prototype.assertTrue = function assertTrue(exp){
		if(getConcrete(exp) !== true){
			logger.log('[ERROR]Assert.asertTrue');
			throw new Error('###assertTrue failed');
		}else{
			logger.log('[OK]Assert.assertTrue');
		}
	}
	/*
	var ignores = [
		/^R\$.setErrors/];

	function isInstrument(code){
		for(var j=0;j<ignores.length;j++){
			if(code.match(ignores[j])){
				return false;
			}
		}
		return true;
	}
	/*
	/*
	 * @param exp a piece of code
	 */
	Assert.exec = function(exp,isInst, res){
		var res = res || {};
		res.error = res.error || [];
		var code = [];
		if(typeof exp === 'string' || typeof exp === 'function'){
			try{
				var lines = J$.getCodeLines(exp);
				for(var i =0;i<lines.length;i++){
					var curLine = lines[i];
					if(curLine && isInst){
						code.push({orig:curLine,insted:J$.instrumentCode(curLine,Assert.instArg).code});
					}else{
						code.push({orig:curLine,insted:curLine});
					}
					res.code = code;
				}
			}catch(e){
				res.error.push(new Error('Failed to instrument code:'+curLine+'; caused by: '+e.message));
				
			}
			if(res.error.length>0)
				return res;
		
			for(i =0;i<code.length;i++){
				try{
					var line = code[i].insted;
					if(line){
						console.log('line'+i+':',code[i].orig);
						res.result = eval(line);
						if(res.result)
							console.log(res.result);
					}
				}catch(e){
					var ne = new Error('Failed to execute code:'+code[i].orig+'; caused by:'+e.message);
					console.log(ne);
					res.error.push(ne);
				}
			}
		}else{
			res.error.push( new Error('Syntax error. Invalid param for Assert.' +arguments.callee.name));
		}
		return res;
	};
	Assert.befores = [];
	Assert.dones = [];
	rr.before = function(func){
		Assert.befores.push(func);
	}
	rr.done = function(func){
		Assert.dones.push(func);
	}
	rr.callBefore = function(){
		var res = {};
		for(var i=0;i<Assert.befores.length;i++){
			Assert.exec(Assert.befores[i],true,res);
		}
		return res;
	}
	rr.callDone = function(){
		var res = {};
		for(var i=0;i<Assert.dones.length;i++){
			Assert.exec(Assert.dones[i],true,res);
		}
		return res;
	}
	rr.Assert = Assert;

})(R$);
