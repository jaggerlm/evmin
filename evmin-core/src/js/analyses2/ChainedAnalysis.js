(function (sandbox,rr) {

	rr.dps.ChainedAnalysis = function ChainedAnalysis(){
		this.analyses = arguments;
		this.invoke = function(method){
			var ret, args = arguments;
			var old;
			for(var i=0;i<this.analyses.length;i++){
				old = ret;
				try{
					ret = this.analyses[i].invoke.apply(this.analyses[i],args) || ret;
				}catch(e){
					continue;
				}
				if(ret){
//					console.log('=====args:',args, '; result:',ret.result);
					if(ret.stopPropagation)
						return ret.result;
					if(ret.args)
						args = [].concat(method).concat(ret.args)
				}
			}
			return ret;
		}

	}

})(J$,R$);
