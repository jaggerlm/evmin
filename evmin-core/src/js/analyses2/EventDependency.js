(function (sandbox,rr) {

	var dps = rr.dps;
	rr.executionCtx = new dps.ExecutionContexts();
	
	function EventDependencyEngine () {
		this.RW_MAP = [];

		var util = rr.common.util;
		var logger = rr.common.util.logger;	
		var global = rr.global;	
		var AnalyseStatus = rr.constants.AnalyseStatus;
		
		var step = 1;		
	
	
		var __self = this;
		var getConcrete = __self.getConcrete = dps.AnotatedValue.getConcrete;
		var getOpid = __self.getOpid = dps.AnotatedValue.getOpid;
		var Opid = dps.AnotatedValue.Opid;
		var getVarValue = __self.getOpid = dps.AnotatedValue.getVarValue;
		this.ddg = rr.ddg; 
		this.ctx = rr.executionCtx;

		this.init = function(sid){
			logger.log('[init analyse...]');
			__self.SID = sid;
		}	
		
		var uuid=0;
		this.genId = function(prefix){
			return prefix+"_"+ (uuid++);
		}

		this.literal = function(iid, val, hasGetterSetter) {
			var val = dps.wrapValue(val,null,{iid:iid});
			var node = new dps.LiteralDataNode(val,hasGetterSetter);
			this.ddg.putValue(node,false);
			return {result:val, args: [iid, val, hasGetterSetter]};
		};
		
		this.declare = function (iid, name,val, isArgument, argumentIndex){
			var oval;
			if(isArgument){oval = new Opid(getOpid(val))}
			val = dps.wrapValue(val,{base:this.ctx.getCurContext(),offset:name},{iid:iid},true);
			var node = new dps.DeclareDataNode(val,name,isArgument,argumentIndex);
			getVarValue(val).defId = node.opid; 
			this.ctx.addVarNode(node);
			this.ddg.putValue(node,false,[oval]);
			return {result:val, args:[iid, name,val, isArgument, argumentIndex]};
		};
		this.read = function(iid, name, val, isGlobal, isPseudoGlobal){
			//if (isGlobal || isPseudoGlobal || dps.webGlobal(name,val)) var skip = true;
			var info = this.ctx.getVarInfo(name);
			var val = dps.wrapValue(val,{base:info.scope,offset:name},{iid:iid},false,true);	
			var def = new Opid(info.data.opid);
			var node = new dps.ReadDataNode(val,name,isGlobal,isPseudoGlobal);
			node.define = info.data.node;
			this.ddg.putValue(node,false,[val,def]);
			return {result:val, args:[iid, name, val, isGlobal, isPseudoGlobal]};
		};
		this.write = function(iid, name, val, lhs, isGlobal, isPseudoGlobal) {
			var info = this.ctx.getVarInfo(name);
			var def = new Opid(info.data.opid);
			var prev = new Opid(getOpid(val));
			
			val = dps.wrapValue(val,{base:info.scope,offset:name},{iid:iid},true);
			var node = new dps.WriteDataNode(val,name,lhs,isGlobal,isPseudoGlobal);
			node.define = info.data.node;
			this.ddg.putValue(node,false,[prev,def]);
			return {result:val,args:[iid, name, val, lhs, isGlobal, isPseudoGlobal]};
		};
		
		this.getField = function(iid, base, offset, val){
			var val = dps.wrapValue(val,{base:base,offset:offset},{iid:iid},false,true);
			var node = new dps.GetFieldDataNode(val,base,offset);
			this.ddg.putValue(node,false,[base,offset,val]);
			return {result:val, args:[iid, base, offset, val]};
		};
		
		this.putFieldPre = function(iid, base, offset, val){
			dps.AnotatedValue.removeQt(base[getConcrete(offset)],{base:base,offset:offset});
		};
		
		this.putField = function(iid, base, offset, val, data){
			var prev = new Opid(getOpid(val,{base:base,offset:offset}));
			var val = dps.wrapValue(val,{base:base,offset:offset},{iid:iid},true);
			var node = new dps.PutFieldDataNode(val, base, offset);
			this.ddg.putValue(node,false,[base,offset,prev]);
			return {result:val,args:[iid, base, offset, val, data]};
		};

		/*record dynamically generated putField operation. such as putting an DOM field that is not actually existing.*/
		this.putField2 = function(prefix,base,offset,val){
			var iid = this.genId(prefix);
			if(offset == null)
				offset = iid;
			var val = dps.wrapValue(val,{base:base,offset:offset},{iid:iid},true);
			dps.AnotatedValue.isHandler(val,prefix);
			var node = new dps.PutFieldDataNode(val,base,offset);
			this.ddg.putValue(node,false,[base,offset]);
			return iid;
		}
		function _imutableOpid(arr){
			var ret = [];
			for(var i=0;i<arr.length;i++){
				ret.push(new Opid(getOpid(arr[i])));
			}
			return ret;
		}
		this.invokeFunPre = function(iid, f, base, args, isConstructor, isMethod){
			var def = new Opid(getVarValue(f).defId);
			var t_dps = _imutableOpid([].concat(def,base).concat(Array.prototype.slice.apply(args)));
			return {f:f,base:base,args:[iid, f, base, args, isConstructor, isMethod],data:{dps:t_dps}}
		}	
		this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod, data){
			var ast = R$.assertInterceptor.itcpt(iid,f,base,args,result,isMethod);
			if(ast) return ast;

			var prev = new Opid(getOpid(result));
			var val = dps.wrapValue(result,null,{iid:iid}, true);
			var node = new dps.FunCallDataNode(val,f,base,args,isConstructor,isMethod);
			var t_dps = data.dps.concat(prev);
			this.ddg.putValue(node,false,t_dps);
			this.handleNativeCase(node);	
			return {result:val,args:[iid, f, base, args, val, isConstructor, isMethod, node]};
		};
		this.handleNativeCase = function(node){
			var f = getConcrete(node.__f);
			if(f === R$.natives.Array.prototype.push || f === R$.natives.Array.prototype.shift
					|| f === R$.natives.Array.prototype.pop || f === R$.natives.Array.prototype.concat
					|| f === R$.natives.Array.prototype.splice){
				var _val = dps.wrapValue(node.__iid,{base:node.__base,offset:node.__f}, node.__base, true);
				var wnode = new dps.WriteDataNode(_val,f.name,node.__base);	
				this.ddg.putValue(wnode,false, [new Opid(node.opid)]);
			}
		}
		
		this.binary = function(iid, op, left, right, result){
			var val = dps.wrapValue(result,null,{iid:iid},true);
			var node = new dps.BinaryDataNode(val,op,left,right);	
			this.ddg.putValue(node,false,[left,right]);
			return {result:val, args:[iid, op, left, right, val]};
		};
		this.unary = function(iid, op, left, result){
			var val = dps.wrapValue(result,null,{iid:iid},true);
			var node = new dps.UnaryDataNode(val,op,left);
			this.ddg.putValue(node,false,[left]);
			return {result:val,args:[iid, op, left, val]};
		};

		this.forinObject = function(iid,val){
			//var _val = dps.wrapValue(val,null,{iid:iid});
			//for(var i in val){
			//	var node = new dps.GetFieldDataNode(_val,val,i,val[i]);
			//	this.ddg.putValue(node,false,[val,val[i]]);
			//}
			return {result:getConcrete(val),args:[iid,val]};
		};
		
		this.conditional = function(iid,result){
			var val = dps.wrapValue(result,null,{iid:iid});
			var node = new dps.ConditionalNode(val,iid);
			this.ddg.putValue(node,false,[val]);
			return {result:getConcrete(val), args:[iid,val]}
		};
		this.conditionalBlockEnter = function(iid,testIid){
			var _val = dps.wrapValue(null,null,{iid:iid});
			var node = new dps.ConditionalNode(_val,testIid);
			node.ce = true;
			this.ddg.putValue(node,false);
		}
		this.conditionalBlockExit = function(iid,testIid){
			var _val = dps.wrapValue(null,null,{iid:iid});
			var node = new dps.ConditionalNode(_val,testIid);
			node.cr = true;
			this.ddg.putValue(node,false);
		}

		this.functionEnter = function (iid, fun, dis /* this */, args) {
			this.ctx.pushContext(iid,fun,dis);	
		}

		this.functionExit = function (iid,returnVal,exceptionVal) {
			this.ctx.popContext();	
		}

		this.sendFailed = function(){
			this.ddg.sendStatus(AnalyseStatus.FAILED);
		}
		
		this.sendOk = function(){
			this.ddg.sendStatus(AnalyseStatus.OK,{evs:R$.reduce.errorEvs,loc:R$.reduce.errorLoc});
		}

		this.startAnalyze = function(options){
			this.ddg.startAnalyze(options);
		}
		this.getEventDependency = function(errorsEvs){
			
			var rcds = this.ddg.evOps;
			var edg = new dps.EventDependencyGraph(rcds);
			var res = edg.getEventDps(errorsEvs);
			logger.logTest(0,'Error events',errorsEvs);
			//logger.logTest(0,"EVENT OPS:",rcds);
			logger.logTest(0,'RESULT:',res);
			return res;

		};

		this.endExecution = function() {
			if(R$.REPLAY_SETUP && R$.REPLAY_SETUP.POLICY!='WEAK')
				this.sendOk();
		};

		this.invoke = function(method){
			var args = Array.prototype.slice.call(arguments,1);
			if(this[method])
				return this[method].apply(this, args);
		}
    }
	dps.EventDependencyEngine = EventDependencyEngine;
})(J$,R$);
