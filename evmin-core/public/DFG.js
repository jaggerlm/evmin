if(typeof R$ == "undefined"){
	R$ = {}
}
(function(rr){
	var util = rr.common.util;	
	var constants = rr.constants;
	var logger = util.logger;
	var dps = rr.dps = rr.dps || {};

	var getConcrete = this.getConcrete = dps.AnotatedValue.getConcrete;
	var getCurOpid = this.getCurOpid = dps.AnotatedValue.getCurOpid;
	var config = R$.config;

	var RR_KEY = dps.RR_KEY;
	var global = R$.global;
	OP_TYPE = dps.OP_TYPE;
	
	var DataNode = dps.DataNode; 
	var DeclareDataNode = dps.DeclareDataNode;
	var LiteralDataNode = dps.LiteralDataNode; 
	var ReadDataNode = dps.ReadDataNode; 
	var WriteDataNode = dps.WriteDataNode; 
	var GetFieldDataNode = dps.GetFieldDataNode;
	var PutFieldDataNode = dps.PutFieldDataNode;
	var BinaryDataNode = dps.BinaryDataNode;
	var UnaryDataNode = dps.UnaryDataNode;
	var FunCallDataNode = dps.FunCallDataNode

	
	function validateNode(node){
		if(!node || !node.__rt){
			return false;
		}

		if(node && node.evid>0)
			return true;

		var cur_ev = R$.util.html.getCurEvent();
		if(!cur_ev){
			return false;
		}else{				
			node.evid = cur_ev.id;
			return true;
		}

	}

	var opKeys = dps.opKeys;
	var wtype = dps.wtype;
	var rtype = dps.rtype;

	var DataDependencyGraph = dps.DataDependencyGraph = function(mode,storage){
		var _self = this;
		_self.mode = mode;
		_self.storage = storage;
		

		function putValue(node,isPre,mdps){
			if(node && !node.__dom && OP_TYPE.DATA[node.__type]){
				//if(dps.natives){
				//	dps.natives.summary(node);
				//}			
				node.mode = 1;
				if(!isPre){
					if(wtype[node.__type]){
						node.M = wtype[node.__type].key;
					}else{
						node.M = opKeys.R;
					}

					_self.storage.add(node);
					_self.storage.addDirectDps(node,mdps);
				}
			}
		}
		
		this.putValue = putValue;
	}
	
	var Inteceptor = dps.Inteceptor =function(){
		_self = this;
		var dommu_nodes = [
			'Node',
			'NodeList',
			'NamedNodeMap'
		];

		function itcptDom(type,node){
			var base = node.__dom.base;
			var offset = node.__dom.offset;
			var isDOM = false;
			for(var i=0;i<dommu_nodes.length;i++){
				if(global[dommu_nodes[i]]==null)
					continue;
				
				if(node.__hasBase){
					if(base instanceof global[dommu_nodes[i]]){
						node.__dom.type = OP_TYPE.DOM.DOMNodeAccess;
						node.__dom.ele = base;
						node.__dom.isDOMAPI = true;
						isDOM = true;
						break;
					}
				}else if(node.__dom.rt instanceof  global[dommu_nodes[i]]){
					node.__dom.type = OP_TYPE.DOM.DOMNodeAccess;
					node.__dom.ele = node.__dom.rt;
					isDOM = true;
					break;
				}
			}
			if(!isDOM)
				delete node.__dom;
			return isDOM;
		}
		this[OP_TYPE.DATA.P] = {
			"pre":function(node){
				var ddom = node.__dom;
				var base = ddom.base;
				var offset = ddom.offset;
	
				//DOM0 event regist
				if(base instanceof Element || base instanceof Document || base instanceof Window){
					if(config.DOM0_STD[offset]){
						if(base[offset]){
							R$.wraped_listeners.R_unregisterDom0Listener(offset.substring(2),base[offset],base);
						}
					}
				}
			},
			"post":function(node){
				var ddom = node.__dom;
				var base = ddom.base;
				var offset = ddom.offset;
				var val = ddom.val;
				
				//DOM0 event regist.
				if(base instanceof Element || base instanceof Document ||base instanceof Window){
					if(config.DOM0_STD[offset]){
						if(val){
							R$.wraped_listeners.R_registerDom0Listener(offset.substring(2),val,false,base);
						}
					}
				}
			}
		}
		function _parseDOMNode(node){	
			node.__dom = {
				base:getConcrete(node.__base),
				offset:getConcrete(node.__offset),
				val:getConcrete(node.__rt),
				f:getConcrete(node.__f),
				rt:getConcrete(node.__rt),
				args:getConcrete(node.__args)
			}
			
			if(node.__type == OP_TYPE.DATA.F){
				var f = node.__dom.f;
				node.__dom.offset = f?f.name:'';
			}
		}
		this.intercept = function(node,isPre){
				_parseDOMNode(node);
				itcptDom(node.__type,node);
				if(!node.__dom) return;

				if(isPre){
					var actions = this[node.__type];
					if(actions && actions['pre']){
						actions['pre'](node);
					}
				}else{
					var actions = this[node.__type];
					if(actions && actions['post']){
						actions['post'](node);
					}
				} 
		}
	}
	
	function getObjOps(ele){
		if(ele)
			return ele[RR_KEY];
	}

	dps.DOMDependencyGraph = function (mode,storage){
		var _self = this;
		_self.mode = mode;
		_self.__MUS = {};
		_self.storage = storage;

		var api_map = {
			'class':'className',
			'text':'textContent'
		}

		function getArg(args,i){
			if(args && args.length>i){
				var res = args[i];
				if(api_map[res])
					res = api_map[res];

				return res;
			}
			return null;
		}

		/**
		 * must make sure that the {type, ele, offset} is correct
		 */
		function DOMAtrrOp(type,node){

			if(type == OP_TYPE.DATA.G){
				node.__dom.type = OP_TYPE.DOM.DOMRead;
				return node;
			}else if(type = OP_TYPE.DATA.P){
				node.__dom.type = OP_TYPE.DOM.DOMAttrWrite;
				node.__xargs = [node.__args];
				return node;
			}
		}
		function DOMSubTreeOp(type,node){
			if(type == OP_TYPE.DATA.G){
				node.__dom.type = OP_TYPE.DOM.DOMRead;
				node.__dom.searchChildren = true;
				return node;
			}else if(type == OP_TYPE.DATA.P){
				node.__dom.type = OP_TYPE.DOM.DOMSubTreeModified;
				node.__xargs = [node.__rt];
				return node;
			}
		}
		var dommu_handlers = function(type,node){
			if(type = OP_TYPE.DATA.P){
				node.__dom.isSeen = false;
				if(node.__dom.val != null){
					//logger.log('===============add handler:',type,node);
					node.__dom.type = OP_TYPE.DOM.DOMAttrWrite;	
					return node;
				}else{
					//logger.log('===============remove handler:',type,node);
					node.__dom.type = OP_TYPE.DOM.DOMAttrRemove;
					return node;
				}
					
			}
		}
		var dommu_prossesors = {
			'tagName':DOMAtrrOp,
			'id':DOMAtrrOp,
			'name':DOMAtrrOp,
			'type':DOMAtrrOp,
			'value':DOMAtrrOp,
			'label':DOMAtrrOp,
			'title':DOMAtrrOp,
			'className':DOMAtrrOp,
			'clientHeight':DOMAtrrOp,
			'clientWidth':DOMAtrrOp,
			'dir':DOMAtrrOp,
			'offsetHeight':DOMAtrrOp,
			'offsetWidth':DOMAtrrOp,
			'offsetLeft':DOMAtrrOp,
			'offsetTop':DOMAtrrOp,
			'offsetParent':DOMAtrrOp,
			'style':DOMAtrrOp,
			'scrollHeight':DOMAtrrOp,
			'scrollLeft':DOMAtrrOp,
			'scrollTop':DOMAtrrOp,
			'scrollWidth':DOMAtrrOp,
			'tabIndex':DOMAtrrOp,
			'textContent':DOMAtrrOp,
			'text':DOMAtrrOp,
			'disabled':DOMAtrrOp,
			'href':DOMAtrrOp,
			'media':DOMAtrrOp,
			'rel':DOMAtrrOp,
			'rev':DOMAtrrOp,
			'target':DOMAtrrOp,
			'type':DOMAtrrOp,
			'bgColor':DOMAtrrOp,
			'backgroud':DOMAtrrOp,
			'link':DOMAtrrOp,
			'alink':DOMAtrrOp,
			'vlink':DOMAtrrOp,
			'method':DOMAtrrOp,
			'action':DOMAtrrOp,
			'length':DOMAtrrOp,
			'size':DOMAtrrOp,
			'tabIndex':DOMAtrrOp,
			'innerText':DOMSubTreeOp,
			/** DOMRead **/
			'innerHTML':DOMSubTreeOp,
			/*
			'outerHTML':function(){
				
			},
			*/
			'getAttribute':function(type, node){
				if(type == OP_TYPE.DATA.F){
					node.__dom.type = OP_TYPE.DOM.DOMRead;
					node.__dom.offset = getArg(node.__args,0);
					return node;
				}
			},
			'getAttributeNS':function(type,node){
				if(type == OP_TYPE.DATA.F){
					
				}
			},
			'getAttributeNodeNS':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			/** DOMNodeAdd  **/
			'add':function(type,node){
				if(type == OP_TYPE.DATA.F){
					var arg0 = getArg(node.__dom.args,0);
					var v = getConcrete(arg0);
					if(typeof v === 'object' && v.nodeType == 3 && v.nodeName == '#text'){
						node.__dom.type = OP_TYPE.DOM.DOMAttrWrite;
						node.__dom.offset = 'textContent';
					}else{			
						node.__dom.type = OP_TYPE.DOM.DOMNodeAdd;
						node.__dom.ele = v;
					}
					return node;
				}
			},
			'appendChild':function(type,node){
				if(type == OP_TYPE.DATA.F){
					var res = dommu_prossesors['add'](type,node);
					return res;
				}
			},
			/** DOMNodeRemove  **/
			'remove':function(type,node){
				if(type == OP_TYPE.DATA.F){
					node.__dom.type = OP_TYPE.DOM.DOMNodeRemove;
					node.__dom.ele = getArg(node.__dom.args,0);
					return node;
				}
			},
			'removeChild':function(type,node){
				if(type == OP_TYPE.DATA.F){
					return dommu_prossesors['remove'](type,node);			
				}
			},
			/** DOMSubTreeModified  **/
			'write':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'writeln':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'insertBefore':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'replaceChild':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'hasChildNodes':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'setNamedItem':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'removeNamedItem':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'setNamedItemNS':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'removeNamedItemNS':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'appendData':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'insertData':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'deleteData':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'replaceData':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'setAttribute':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'removeAttribute':function(type,node){
				if(type == OP_TYPE.DATA.F){
					node.__dom.type = OP_TYPE.DOM.DOMAttrRemove;
					node.__dom.offset = getArg(node.__args,0);
					return node;
				}
			},
			'setAttributeNode':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'removeAttributeNode':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'setAttributeNS':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'removeAttributeNS':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'setAttributeNodeNS':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			},
			'splitText':function(type,node){
				if(type == OP_TYPE.DATA.F){

				}
			}
		}


		var opMap = {
				DOMRead:{key:opKeys.R},
				DOMNodeAccess:{key:opKeys.R},
				DOMNodeAdd:{key:opKeys.W,isNodeMu:true},
				DOMNodeRemove:{key:opKeys.W,isNodeMu:true},
				DOMNodeReplace:{key:opKeys.W,isNodeMu:true},
				DOMSubTreeModified:{key:opKeys.W,isNodeMu:true},
				DOMAttrWrite:{key:opKeys.W,isAttrMu:true},
				DOMAttrRemove:{key:opKeys.W,isAttrMu:true}

		}
		function initDomOps(ele){
			if(ele){
				if(ele[RR_KEY]){
					var ops = ele[RR_KEY];
				}else{
					var ops = new DomOps(ele);
					ele[RR_KEY]  = ops;
				}
				return ops;
			}
		}
		function DomOps(ele){
			var _self = this;

			function init(){
				for(var key in opKeys){
					_self[opKeys[key]] = {};
				}
			}
			init();


			_self.putOp = function(rcd){
				var tp = rcd.__dom.type;
				if(tp == OP_TYPE.DOM.DOMNodeAdd){
					_addOp(rcd);
				}else if(tp  == OP_TYPE.DOM.DOMNodeRemove){
					_addOp(rcd);
				}else if(tp == OP_TYPE.DOM.DOMNodeReplace){
					_addOp(rcd);
				}else if(tp == OP_TYPE.DOM.DOMSubTreeModified){
					_addOp(rcd);
				}else if(tp == OP_TYPE.DOM.DOMAttrWrite || tp == OP_TYPE.DOM.DOMAttrRemove){ 
					removeByAttr(rcd);
					_addOp(rcd);
				}else if(tp == OP_TYPE.DOM.DOMNodeAccess){
					_addOp(rcd);
				}else if(tp == OP_TYPE.DOM.DOMRead){
					_addOp(rcd);
				}
			}
			function _clearOps(ele,isCleanroot){
				
			}

			_self.getMus =function getMus(isNode,isAttr){
				if(isNode && isAttr)
					return _self.W;
				var res = {};
				var rcds = _self.W;
				for(var d in rcds){
					var rcd = rcds[d];
					var type = rcd.__dom.type;
					if(isNode && opMap[type].isNodeMu){
						res[rcd.opid] = rcd;
					}else if(isAttr && opMap[type].isAttrMu){
						res[rcd.opid] = rcd;
					}				
				}
				return res;
			}


			function _addOp(rcd){
				_self[opMap[rcd.__dom.type].key][rcd.opid]=rcd;
				_addDomDps(rcd);
			}
			function _addDomDps (rcd){
				var ropid = rcd.opid;
				function addToResult(_dps,result,info){
					if(_dps){
						if(!result.get(_dps.opid) && ropid>_dps.opid){
							result.put(_dps.opid,true);
							var dpsby = _dps.dpsby = _dps.dpsby||{};
							dpsby[ropid] = true;
						}
					}
				}
				var res = dps.DataStorage.retreiveDps(rcd);
				//make sure that not dom element is not a dom fragment
				if(_isDomElement(rcd)){
					var ele = rcd.__dom.ele;
					var ddps;
					var d;
					var _dps;
						
					if(false && rcd.searchChildren){
						var chlds = ele.querySelectorAll('*');
						for(var i=0;i<chlds.length;i++){
							var ops  = getObjOps(chlds[i]);
							if(ops){
								ddps = ops.getMus(true,true);
								for(d in ddps){
									var _dps = ddps[d]
									if(_checkParentDpendency(_dps,rcd)){
										addToResult(_dps,res,[rcd,'child']);
									}
								}
							}
							
						}
					}
					
					var ops = getObjOps(ele);
					if(ops){
						ddps = ops.getMus(false,true);
						for(d in ddps){
							var _dps = ddps[d];
							if(_checkAttrDependent(rcd,_dps)){
								addToResult(_dps,res,[rcd,'attr']);
							}
						}
					}
					var p = ele;
					while(p){
						var ops = getObjOps(p);
						if(ops){
							ddps = ops.getMus(true,false);
							for(d in ddps){
								var _dps = ddps[d];
								if(_checkParentDpendency(_dps,rcd)){
									addToResult(_dps,res,[rcd,'parent']);
								}
							}
						}
						p = p.parentNode;
					}
				}
			}
			function _isDomElement(rcd){
				return true;
			}


		}
		function _checkAttrDependent(rcd1,rcd2){
			if(rcd1 == null || rcd2 == null) return;

			if(rcd1.__dom.offset == rcd2.__dom.offset && rcd1.opid !== rcd2.opid){
				if(rcd1.__dom.isSeen && !rcd2.__dom.isSeen){
					return false
				}
				return true;
			}
			return false;
		}
		/**
		 * 
		 */
		function _checkParentDpendency(parentEle,childEle){
			return true;
		}

		/* remove record that matches given offset of an given DOM element*/
		function removeByAttr(rcd){
			var ops = getObjOps(rcd.__dom.ele);
			var ddps = ops.getMus(false,true);
			for(var d in ddps){
				var _dps = ddps[d];
				if(_checkAttrDependent(rcd,_dps)){
					var dpsby = _dps.dpsby = _dps.dpsby || {};
					for(var i in dpsby){
						_self.storage.refactorDps(constants.RefactorType.REMOVE,i,_dps.opid);
					}
					delete ops[opKeys.W][_dps.opid];
				}
			}
		}

		function _getDataDpsForDom(node){
			function addToResult(val, result){
				if(val && val instanceof dps.AnotatedValue){
					result.push(val);
				}
			}
			function addArray(arr,result){
				if(!arr) return;
				var x = getConcrete(arr);
				for(var i=0;i<arr.length;i++){
					addToResult(arr[i],result);
				}
			}

			var res=[];
			addArray(node.__args,res);
			addArray(node.__xargs,res);
			return res;

		}
		/**
		 * return record if the data node is processed, or null if not processed.
		 */
		function putValue(node,isPre){
			if(node && node.__dom && OP_TYPE.DOM[node.__dom.type]){
				node.mode=2;
				if(!isPre){
					var offset = node.__dom.offset;	
					var func = dommu_prossesors[offset];
					if(typeof offset ==='string' && offset.indexOf('$R_H')==0){
						func = dommu_handlers;
					}
					
					////logger.logTest('@@@put DOMValue',node.__iid,node.__dom.type,node,offset,func);
					if(typeof func == 'function'){
						func(node.__type,node);
						if(node.__dom.type == OP_TYPE.DOM.DOMAttrWrite || node.__dom.type == OP_TYPE.DOM.DOMRead){
							node.__dom.isSeen = true;
						}
					}
				
					_self.storage.add(node);
					var ops = initDomOps(node.__dom.ele);
					if(ops){
						node.M = opMap[node.__dom.type].key;
						ops.putOp(node);
					}
					var mdps = _getDataDpsForDom(node);
					////logger.logTest('###adddirectforDOM:',node.opid,node,mdps);
					_self.storage.addDirectDps(node,mdps);

					//dps.AnotatedValue.update({base:node.__dom.ele,offset:node.__dom.offset},node.__rt,
					//		{iid:?,opid:?},true);
				}else{
					
				}
					
				
			}
		}
		
		_self.putValue = putValue;
	}

	dps.DependencyGraph = function DependencyGraph(mode){
		R$.storage = this.storage = new dps.DataStorage(mode);
		this.mode = mode;
		this.inteceptor = new Inteceptor();	
		this.dfg = new dps.DataDependencyGraph(mode,this.storage);
		this.domdg = new dps.DOMDependencyGraph(mode,this.storage);
		if(typeof dps.WeakDependencyGraph === 'function'){
			this.weakg = new dps.WeakDependencyGraph(mode,this.storage);
		}

		function putValue(node,isPre,mdps){
			if(!validateNode(node)){
				delete node;
				return;
			}
			this.inteceptor.intercept(node,isPre);
			if(!node.__dom && !dps.AnotatedValue.isAnotated(node.__rt)){
				delete node;
				return;
			}
			if(this.mode == dps.mode.DATA){
				this.dfg.putValue(node,isPre,mdps);
			}else if(this.mode == dps.mode.DOM){
				this.domdg.putValue(node,isPre);
			}else if(this.mode == dps.mode.WEAK) {
				this.weakg.putValue(node);	
			}else{
				this.domdg.putValue(node,isPre);
				this.dfg.putValue(node,isPre,mdps);
			}

		}
		function putDomValue(node){
			if(this.mode == dps.mode.DOM || this.mode == dps.mode.MIX){
				this.domdg.putValue(node);
			}
		}
		function sendStatus(st,msg){
			var st = {statusCode:st,errors:msg};
			this.storage.end(R$.util.json.stringify(st));
		}
		
		//options.async;options.done;options.fail;	
		//function startAnalyze(options){
		//	this.storage.end(options);
		//}
		

		this.sendStatus = sendStatus;
		this.putValue = putValue;
		this.putDomValue = putDomValue;

		rr.weakg = this.weakg;
		rr.mockEvent = function(evt,handlerInfo){
			rr.weakg.eventEnter(evt,handlerInfo);
		}
	}
	
})(R$);


