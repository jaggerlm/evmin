if(typeof R$ == 'undefined'){
	R$ = {};
}
(function(rr){
	var dps = rr.dps = rr.dps ||{};
	var util = rr.common.util;
	var logger = util.logger;
	dps.mode = {
		DATA:1,
		DOM:2,
		MIX:3
	}
	dps.RR_KEY = '__R$';
	dps.OP_TYPE = {
		'DATA':{
			I : 'I',
			D : 'D',
			R : 'R',
			W : 'W',
			G : 'G',
			P : 'P',
			B : 'B',
			U : 'U',
			F : 'F',
			C : 'C'
		},
		'DOM':{
			DOMRead:'DOMRead',
			DOMNodeAccess:'DOMNodeAccess',
			DOMNodeAdd:'DOMNodeAdd',
			DOMNodeRemove:'DOMNodeRemove',
			DOMNodeReplace:'DOMNodeReplace',
			DOMSubTreeModified:'DOMSubTreeModified',
			DOMAttrWrite:'DOMAttrWrite',
			DOMAttrRemove:'DOMAttrRemove'
		}

	};
	var opKeys = dps.opKeys = {R:'R',W:'W'}
	dps.wtype = {
		W:{key:opKeys.W},
		D:{key:opKeys.W},
		P:{key:opKeys.W}
	};
	
	dps.rtype = {
		R:{key:opKeys.R},
		G:{key:opKeys.R}
	}
	var HANDLER = dps.HANDLER= 'R$_H';
	var INPUT = dps.INPUT= 'R$_V';
	var _DPS = 'dependence';
	var _SYMBOLIC = 'symbolic';
	var _CONCRETE = 'concrete';
	dps.symbolic = {};

	/********************************** AnnotatedValue begin ************************************************************/
	function isAlias(a,b){
			if(a === b) return true;
			if(a==null || b==null) return false;
			return a.base === b.base && a.offset == b.offset;
	}


	function ValInfo(){
		this.cur = {};
		this.qts = new util.CMap(isAlias);
	}
	ValInfo.prototype.defObj = function(){
		var o = {};
		o[_DPS] = { value:this, enumerable:false,writable:true,configurable:true};
		return o;
	}
	var AnotatedValue = dps.AnotatedValue = function (val, varKey, varValue, skipInit) {
		if(skipInit) return val;
		var valinfo = new ValInfo();
		if(val && typeof val === 'object' || typeof val === 'function'){
			AnotatedValue.addHiddenProp(val, _DPS, valinfo);
		}else {
			var concrete = val, val = this;
			AnotatedValue.addHiddenProp(val, _CONCRETE, concrete);
			AnotatedValue.addHiddenProp(val, _DPS, valinfo);
		}
		
		return AnotatedValue.update(val,varKey, varValue,true);
    }

	AnotatedValue.update = function (val, varKey,varValue,overwrite){
		if(val && val.hasOwnProperty(_DPS)){
			var s = val[_DPS];
			if(typeof s != 'object' || !varValue)
				return;
			s.cur = varValue;
			s.cur.qt = varKey;
			if(overwrite){
				s.qts.put(varKey,varValue);
				s.latestW = varValue;
			}
		}
		return val;
	}
	var op_id = 0;
	var useShadow = rr.config.enables.useShadow;
	dps.wrapValue = function(val, varKey, varValue, overwrite, skipInit){
		if(!useShadow) return val;

		varValue.opid = ++op_id;
		if(varKey) varKey.offset = getConcrete(varKey.offset);
		//if(varValue.isDefine) varValue.defId = varValue.opid;

		if(dps.AnotatedValue.isAnotated(val)){
			return dps.AnotatedValue.update(val, varKey, varValue, overwrite);
		}else{
			if(skipInit) return val;
			return new dps.AnotatedValue(val, varKey, varValue, skipInit);
		}

	}
	AnotatedValue.getLatestW = function(val){
		if(dps.AnotatedValue.isAnotated(val))
			return val[_DPS].latestW;
		return {};
	}

	AnotatedValue.addHiddenProp = function(obj, prop, propValue){
		var o = {};
		o[prop] = { value:propValue, enumerable:false,writable:true,configurable:true};
		try{
			Object.defineProperties(obj,o);
		}catch(e){
			obj[prop] = propValue;
		}
		return obj;
	}

	
    AnotatedValue.prototype.toString = function() {
        return this.valueOf()+'';
    };

    AnotatedValue.prototype.valueOf = function() {
		var c = AnotatedValue.getConcrete(this);
        if (c != null && typeof c.valueOf === 'function'){
       	    return c.valueOf();
    	}else{
			return c;
		}
	}

    var getConcrete = AnotatedValue.getConcrete = function (val) {
		if(val && val.hasOwnProperty(_CONCRETE))
			return val[_CONCRETE];
		else return val;
    }
	var getShadow = AnotatedValue.getShadow = function(val){
		if(AnotatedValue.isAnotated(val)){
				return val[_DPS];
		}
		return null;
	}
	
	var getIid = AnotatedValue.getCurIid = function (val) {
		return AnotatedValue.getCur(val).iid;
	}
	AnotatedValue.getCurOpid = function (val) {
		return AnotatedValue.getCur(val).opid;
	}
	AnotatedValue.Opid = function(opid){
		this.opid = opid;
	}
	AnotatedValue.getCur = function(val){
		if(AnotatedValue.isAnotated(val)){
			var s = val[_DPS];
			s.cur = s.cur || {};
			return s.cur;
		}
		return {qt:{}};
	}
	
	AnotatedValue.getVarValue = function(val, varKey){
		if(val instanceof AnotatedValue.Opid && val.opid){
			return val;
		}
		if(val && val.hasOwnProperty(_DPS)){
			var s = val[_DPS];
			if(!varKey) varKey = s.cur.qt;
			if(s.qts.containsKey(varKey))
				return s.qts.get(varKey);
		}
		return {};
	}
	AnotatedValue.getOpid = function (val, varKey) {
		return AnotatedValue.getVarValue(val,varKey).opid;
	}

	AnotatedValue.curQtEqs = function(val,qt){
		if(val && val.hasOwnProperty(_DPS)){
			var cqt = val[_DPS].cur.qt;
			if(cqt && getConcrete(cqt.offset) == getConcrete(qt.offset)){
				return true;
			}
		}
		return false;
	}

	AnotatedValue.removeQt = function(val,qt){
		if( val && val.hasOwnProperty(_DPS)){
			val[_DPS].qts.remove(qt);
		}
	}

	AnotatedValue.isAnotated = function(val){
		if( val && val.hasOwnProperty(_DPS)){
			return true;
		}
		return false;
	}
	AnotatedValue.symbolize = function(val, symbolic){
		if(AnotatedValue.isAnotated(val)){
			val = AnotatedValue.addHiddenProp(val,_SYMBOLIC,symbolic);
		}else{
			if(!(val && typeof val === 'object' || typeof val === 'function'))
				val = AnotatedValue.addHiddenProp({},_CONCRETE, val);
			AnotatedValue.addHiddenProp(val,_SYMBOLIC,symbolic);
		}
		return val;
	}
	AnotatedValue.getSymbolic = function (val) {
		if(val && val[_SYMBOLIC]) return val[_SYMBOLIC];
	}
	
	AnotatedValue.serialize = function(val){
		var ret = {};
		var sym = AnotatedValue.getSymbolic(val);
		if(sym){
			ret.sym = sym.toString(); 
			ret.conc = this[_CONCRETE];
			ret.dps = this[_DPS];
		}
		return ret;
	}
	
	AnotatedValue.isHandler = function(fun,isHandler){
		if(fun && isHandler){
			AnotatedValue.addHiddenProp(fun,HANDLER,{isHandler:true});
		}
		return fun && fun[HANDLER] ? fun[HANDLER].isHandler:false; 
	}

	/********************************** End AnnotatedValue ************************************************************/

	/********************************** DataNode begin ************************************************************/
	dps.webGlobal = function(name,val){
		return name && R$.common.util.HOP(R$.global,name) && R$.global[name]===val;
	}

	dps.DataNode = function (type){
		var filters = ['iid','opid','evid','dps'];
		this.__type = type;
		this.toJsonString = function(){
			return R$.util.json.stringifyWithFilter(this,['__iid','opid','evid','dps']);
		}
		this.getType = function(){
			return this.__type;
		}
		this.setVal = function(value){
			this.__rt = value;
		}
		this.getVal = function(){
			return this.__rt;
		}
		this.getName = function(){
			return this.__name;
		}
	}
	dps.ConditionalNode = function(rt,testIid){
		this.__iid = getIid(rt);
		this.__rt = rt;
		this.test = testIid;
		this.opid = getCurOpid(rt);
	}
	dps.ConditionalNode.prototype = new dps.DataNode(dps.OP_TYPE.DATA.C);
	dps.DeclareDataNode = function(rt,name, isArg, argIdx){
		this.__iid = getIid(rt);
		this.__rt = rt;
		this.__name = name;
		this.__isArg = isArg;
		this.opid = getCurOpid(rt);
	}
	dps.DeclareDataNode.prototype = new dps.DataNode(dps.OP_TYPE.DATA.D);
	dps.LiteralDataNode = function(rt,hasGetterSetter){
		this.__iid = getIid(rt);
		this.__rt = rt;
		this.__hasGetterSetter = hasGetterSetter;
		
		this.opid = getCurOpid(rt);
	}
	dps.LiteralDataNode.prototype = new dps.DataNode(dps.OP_TYPE.DATA.I);
	dps.ReadDataNode = function(rt, name,isGlobal,isPseudoGlobal){
		this.__iid = getIid(rt);
		this.__rt = rt;
		this.__name = name;
		this.opid = getCurOpid(rt);
	}
	dps.ReadDataNode.prototype = new dps.DataNode(dps.OP_TYPE.DATA.R);
	dps.WriteDataNode = function(rt,name,lhs,isGlobal,isPseudoGlobal){
		this.__iid = getIid(rt);
		this.__rt = rt;
		this.__name = name
		this.__lhs = lhs;
		this.opid = getCurOpid(rt);
	}
	dps.WriteDataNode.prototype = new dps.DataNode(dps.OP_TYPE.DATA.W);
	dps.GetFieldDataNode = function(rt, base, offset ){
		this.__iid = getIid(rt);
		this.__rt = rt;
		this.__base = base;
		this.__offset = offset;
		this.__hasBase = true;
		this.opid = getCurOpid(rt);
	}

	dps.GetFieldDataNode.prototype = new dps.DataNode(dps.OP_TYPE.DATA.G);

	dps.PutFieldDataNode = function(rt, base, offset){
		this.__iid = getIid(rt);
		this.__rt = rt;
		this.__base = base;
		this.__offset = offset;
		this.__hasBase = true;
		this.opid = getCurOpid(rt);
	}
	dps.PutFieldDataNode.prototype = new dps.DataNode(dps.OP_TYPE.DATA.P);
	dps.BinaryDataNode = function(rt, op, left, right){
		this.__iid = getIid(rt);
		this.__rt = rt;
		this.__op = op;
		this.__left = left;
		this.__right = right;
		this.opid = getCurOpid(rt);
	}
	dps.BinaryDataNode.prototype = new dps.DataNode(dps.OP_TYPE.DATA.B);
	dps.UnaryDataNode = function(rt, op, left){
		this.__iid = getIid(rt);
		this.__rt = rt;
		this.__op = op;
		this.__left = left;
		this.opid = getCurOpid(rt);
	}
	dps.UnaryDataNode.prototype = new dps.DataNode(dps.OP_TYPE.DATA.U);
	dps.FunCallDataNode = function(rt, f, base, args, isConstructor, isMethod){
		this.__iid = getIid(rt);
		this.__rt = rt;
		this.__f = f;
		this.__base = base;
		this.__offset = f.name;
		this.__args = args;
		this.__result = getConcrete(rt);
		this.__isConstructor = isConstructor;
		this.__isMethod = isMethod;
		this.__hasBase = true;
		this.opid = getCurOpid(rt);
	}
	dps.FunCallDataNode.prototype = new dps.DataNode(dps.OP_TYPE.DATA.F);
	

	/********************** Execution Context **********************************/
	var DefinitionType = {
		VAR:'DV',
		FUN:'DF',
		ARG:'DA'
	}
	dps.DefinitionType = DefinitionType;
	function ExecutionContexts(){
		function Scope(parent,isGlobal){
			this.parent = parent;
			this.isGlobal = isGlobal;
			this.vars = {};
			this.nodes = {};
			this.setThis = function(iid, fun, dis){
				this.iid = iid;
				this.fun = fun;
				this.dis = dis;
				if(fun){
					fun.executionContext = this;
				}
			}
			
			this.addVar = function(node,data){
				var dt;
				if(node.getType()=='F'){
					dt = DefinitionType.FUN;
				}else if(node.isArgument){
					dt = DefinitionType.ARG;
				}else{
					dt = DefinitionType.VAR;
				}
				this.nodes[node.opid] = node;
				data = data ||{};
				data.type = dt;
				data.node = node;
				data.opid = node.opid;
				this.vars[node.getName()] = data;				
			}
			
			/*
			this.isGlobal = function(name){
				var res = this.getVarInfo(name);
				if(!res || (res.scope && res.scope.isGlobal)){
					return true;
				}
				return false;
			}
			*/
		}
		
		//TODO: for test	
		this.allCtx = [];
		this.getCurContext = function(){
			return this.currentScope;
		}
		this.getParentContext = function(){
			this.currentScope.parent;
		}	
		
		this.pushContext = function(iid,fun,dis){
			this.currentScope = new Scope(this.currentScope);
			this.currentScope.setThis(iid,fun,dis);
			this.allCtx.push(this.currentScope);
		}

		this.popContext = function(){
			if(this.currentScope)
				this.currentScope = this.currentScope.parent; 
		}
		this.addVarNode = function(node,data){
			this.getCurContext().addVar(node,data);
		}
		this.getNode = function(opid){
			var s = this.getCurContext();
			while(s){
				if(s.nodes[opid]){
					return s.nodes[opid];
				}
				s = s.parent;
			}
			return null;
		}
		
		this.getVarInfo = function(name){
			var s = this.getCurContext();
			while(s){
				if(s.vars[name]){
					return {scope:s, data:s.vars[name] || {}};
				}
				s = s.parent;
			}
			return {scope:this.globalScope, data:{}}; // an empty scope
		}

		this.globalScope = this.currentScope = new Scope(null,true);
		
		this.allCtx.push(this.currentScope);
	
	}
	dps.ExecutionContexts = ExecutionContexts;
	
})(R$);
