(function(rr){
	var wtype = rr.dps.wtype;
	var rtype = rr.dps.rtype;
	var AnotatedValue = rr.dps.AnotatedValue;
	var SymbolicLiteral = rr.dps.SymbolicLiteral;
	var CMap = rr.common.util.CMap;
	var Map = rr.common.util.Map;
	var MMap = rr.common.util.MMap;
	var keyArray = rr.common.util.keyArray;
	var prevEvent = 0;
	var curEvent = 0;
	var ctx = rr.executionCtx;
	var label = rr.constants.SHARED_LABEL;
	window._wj = new MMap();
	_wj.constructor.prototype.selector = {name:'ele-selector', count:1};
	_wj.constructor.prototype.uses = {name:'DOM_Uses',count:1};
	var domMuts = {};
	_wj.put(['DOM_changes'],domMuts);
	function getCurrentEvent(){
		return R$.util.html.getCurEvent();
	}
	function WeakDOMStates(collector){
		this.collector = collector;
		this.states = new Map();
		_wj.put(['DOM_States'],this.states.map);
		this.uses = new MMap();
		this.init();
	}
	function onDOMMutation(mutations){
		if(curEvent<=0) return;
		if(!domMuts[curEvent])
			domMuts[curEvent] = [];
		for(var i=0;i<mutations.length;i++){
			var mut = mutations[i];
			if(mut.type === 'attributes'){ //TODO: only handles attributes, the changes to Dom element may also affect attributes
				console.debug('===DOM attr change:',curEvent,mut);
				document._defs = document._defs || new MMap();
				document._defs.put([compatibleSelector(mut.target),mut.attributeName],mut.target);
			}
		}
	}
	WeakDOMStates.prototype.init = function(){
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
		var target = document;
		var that = this;
		domMuts[0] = [];

		var observer = new MutationObserver(onDOMMutation);
		var config = { subtree: true,attributes: true, childList: true, characterData: true}
		observer.observe(target, config);
	}
	WeakDOMStates.prototype.cache = function(){
		this.getAllPossibles();
		if(domMuts[curEvent]){
			var bak = document.cloneNode(true);
			bak._evid = curEvent;
			this.states.put(curEvent,bak); 
			this.lastChange = curEvent;
			if(document._defs){
				bak._defs = document._defs;
				delete document._defs;
			}
		}else{
			domMuts[this.lastChange].push(curEvent);
		}
		if(this.uses.values.length>0){
			_wj.put([_wj.uses.name+'_keys', curEvent, _wj.uses.count], this.uses.keys);
			_wj.put([_wj.uses.name,curEvent,_wj.uses.count++],this.uses.values);
		}
		this.uses = new MMap();
	}

	var domProcessor = {
		'F':function(node){
			if(!node.__dom.isDOMAPI) return;
			switch(node.__dom.offset){
				case 'getElementsByTagName':
				case 'getElementsByName':
				case 'getElementById':
					node.__dom.select = {};
					node.__dom.select.base = node.__rt
					break;
				case 'getElementsByClassName':
					node.__dom.select = {};
					node.__dom.select.base = node.__rt;
					node.__dom.select.append = '.'+node.__dom.args[0];
					break;
				case 'getAttribute':
					node.__dom.select = {};
					node.__dom.select.base = node.__dom.base;
					node.__dom.select.attr = node.__dom.args[0]
					break;
				case 'querySelector':
				case 'querySelectorAll':
					node.__dom.select = {};
					node.__dom.select.base = node.__dom.base;
					node.__dom.select.selector = node.__dom.args[0]
					break;
				default:
					node.__dom.select = {base:node.__dom.ele};
			}	
		},
		'G':function(node){
			if(!node.__dom.isDOMAPI) return;
			if(J$.isNative(node.__rt))
				return;
			node.__dom.select = {};
			node.__dom.select.base = node.__dom.base;
			node.__dom.select.attr = node.__dom.offset;
		},
		'P':function(node){
			if(!node.__dom.isDOMAPI) return;
			onDOMMutation([{type:'attributes',target:node.__dom.base,attributeName:node.__dom.offset}]);
		},
		'R':function(node){
			node.__dom.select = {base:node.__dom.ele};
		}
	}

	WeakDOMStates.prototype.intercept = function(node){
		if(node.__dom){
			if(typeof domProcessor[node.getType()] === 'function')
				domProcessor[node.getType()](node);

			if(node.__dom.select){
				var selector = compatibleSelector(node);	
				if(selector && !this.uses.get([selector,node.__dom.select.attr])){
					this.uses.put([selector,node.__dom.select.attr],node);
					return true;
				}
			}
		}
	}
	function getSelector(target){
		var ele = target;
		var path='', end;
		while(ele && !end){
			if(ele.nodeType == 1){
				var xname =  ele.tagName;
				if(ele.id){
					xname += '#' + ele.id;
					end = true;
				}
				path = xname+(path?' '+path:'');
			}
			ele = ele.parentNode;
		}
		return path;
	}
	function compatibleSelector(node){
		var ele,path;
		if(node instanceof rr.dps.DataNode){
			var ele = node.__dom.select.base;
			path = getSelector(ele, true);	
			if(node.__dom.select.base){
				if(node.__dom.select.append)
					path = (path?path+' ':'')+node.__dom.select.append;
				else if(node.__dom.select.selector)
					path = (path?path+' ':'')+node.__dom.select.selector;
			}
		}else{
			ele = node;
			path = getSelector(ele);
		}
		if(ele.name)
			path = (path?path:'')+'[name="'+ele.name+'"]';
		return path;
		
	}
	function isCompatible(realDOM, choiceDOM, selector, node){
		function _getElement(dom, selector){
			dom._cache = dom._cache || {};
			var res = dom._cache[selector];
			if(typeof res === 'undefined'){
				var ele;
				try{
					ele = dom.querySelector(selector);
				}catch(e){
					ele = undefined;
				}
				res = {selector:selector, ele:ele, length:ele?1:0};
				dom._cache[selector] = res;
			}
			return res;
		}
		if(selector[1] != 'undefined'){
			if(choiceDOM._evid==0)
				return false;
			if(choiceDOM._defs && choiceDOM._defs.get(selector)){
				return true;
			}
			return false;
		}
		return _getElement(realDOM,selector[0]).length == _getElement(choiceDOM,selector[0]).length;	
	}
	WeakDOMStates.prototype.getAllPossibles = function(){
		if(this.states.size()<1) return;
		var selectors = this.uses.keyArray(2);
		for(var i=0;i<selectors.length;i++){
			var use = this.uses.get(selectors[i]);
			var selector = selectors[i];	
			var keys = this.states.keyArray();
			var realDOM = this.states.get(keys[keys.length-1]);
			var res = {};
			res[keys[keys.length-1]] = true;
			//console.debug('===find Compatible for:',curEvent);
			for(var j=0; j<keys.length-1;j++){
				var choiceDOM = this.states.get(keys[j]);
				if(!res[keys[j]] && isCompatible(realDOM, choiceDOM, selector, use)){
					res[keys[j]] = true;
				}
				//console.debug('---isCompatible:', choiceDOM._evid,keys[j], selector,res);
			}
			use.domChoice = res;
			this.collector.installDOMAuxiom(use);
			_wj.put([_wj.selector.name,curEvent,_wj.selector.count++],{ele:use.getVal(),selector:selector});

		}
		/*
		for(var i=0;i<this.uses.keys.length;i++){
			var use = this.uses.get(this.uses.keys[i]);
			var selector = this.uses.keys[i];
			var keys = this.states.keyArray();
			var realDOM = this.states.get(keys[keys.length-1]);
			var res = {};
			res[keys[keys.length-1]] = true;
			for(var j=0; j<keys.length;j++){
				var choiceDOM = this.states.get(keys[j]);
				if(realDOM===choiceDOM || isCompatible(realDOM, choiceDOM, selector, use)){
					res[keys[j]] = true;
					var chgs = domMuts[keys[j]];
					if(typeof chgs =='object'){
						for(var x=0;x<chgs.length;x++){
							res[chgs[x]] = true;
						}
					}
				}
			}
			use.domChoice = res;
			this.collector.installDOMAuxiom(use);
			_wj.put([_wj.selector.name,curEvent,_wj.selector.count++],{ele:this.uses.keys[i],selector:selector});
		}*/	
	}
	function NodeStorage(){
		this.all = new CMap();
		this.evMap = {};
	};
	NodeStorage.prototype.put = function(node){ 
		var cur = AnotatedValue.getCur(node.getVal());
		if(!cur || !cur.qt)
			return;
		var map = this.all.get(cur.qt.base); 
		var newItem = {};
		newItem[node.evid] = node;
		if(map){
			var list = map.get(cur.qt.offset);
			if(!list){
				map.put(cur.qt.offset,newItem);
			}else{
				list[node.evid] = node;
			}
		}else{
			map = new Map();
			map.put(cur.qt.offset,newItem);
			this.all.put(cur.qt.base, map);
		}
	}
	NodeStorage.prototype.get = function(key){
		return this.all.get(key);
	}
	
	NodeStorage.prototype.values = function(){
		var res = [];
		for(var i=0;i<this.all.values.length;i++){
			for(var j in this.all.values[i].map){
				var mp = this.all.values[i].map[j];
				for(var key in mp){
					res.push(mp[key]);
				}
			}
		}
		return Array.prototype.sort.call(res,function(a,b){
			return a.opid - b.opid;
		});
	}
	
	function PossiblesMangager(){
		this.writes = new NodeStorage();
		this.reads = new NodeStorage();
	}

	PossiblesMangager.prototype.store = function(node){
		node.stype = {}
		var cur =  AnotatedValue.getCur(node.getVal());
		if(cur&&cur.qt)
			node.stype.base = typeof AnotatedValue.getConcrete(cur.qt.base);
		node.stype.conc = typeof AnotatedValue.getConcrete(node.getVal());
		if(!node.getVal().symbolic){
			node.symValue = new SymbolicLiteral(AnotatedValue.getConcrete(node.getVal()));
		}
		if(wtype[node.getType()]){
			this.writes.put(node);
		}else{
			this.reads.put(node);
		}
	}
	function _checkType(node1, node2){
		if(node1.stype && node2.stype){
			return node1.stype.base === node2.stype.base && node1.stype.conc === node2.stype.conc; 
		}else
			return true;
	}

	PossiblesMangager.prototype.getPossibles = function(node, all){
		var cur =  AnotatedValue.getCur(node.getVal());
		if(!cur.qt || typeof cur.qt.base === 'undefined'){
			return null;
		}
		var all = all || this.writes;
		var map = all.get(cur.qt.base);
		if(map) {
			var possibles = map.get(cur.qt.offset); 
			node.dataChoice = node.dataChoice || {};
			for(var x in possibles){
				if(_checkType(node,possibles[x]))
					node.dataChoice[x] = possibles[x];
			}
			return node.dataChoice;
		}
	}

	PossiblesMangager.prototype.reassignSymbolic = function(node){
		var nval = J$.readInput(node.getVal());
		if(nval && nval.symbolic){
			this.store(node);
			node.setVal(nval); //assign a new symbolic
			node.label = label.in;
			node.symbolic = nval.symbolic;
//			node.evid = curEvent;
			this.getPossibles(node);
		}
	}
	PossiblesMangager.prototype.retreiveSymbolic = function(node){
		var res = this.getPossibles(node, this.reads);
		
		for(var x in res){
			if(res[x]){
				node.label = res[x].label;
				node.symbolic = res[x].symbolic;
				node.dataChoice = res[x].dataChoice;
//				node.evid = res[x].evid;
				break;
			}
			
		}
	}
	function WeakDependencyGraph(mode, storage){
		this.mode = mode;
		this.storage = storage;
		this.eventBox = {};
		this.compatipleJs = new PossiblesMangager();
		this.collector = new ConstraintCollector();
		this.compatibleDOM = new WeakDOMStates(this.collector);
		//_wj.states = this.compatibleDOM.states;
		this.reads = this.compatipleJs.reads;
		this.writes = this.compatipleJs.writes;
		this.wsClient ={
			 name:'SYMS',
			 uri:'ws://'+R$.config.rr_server+'/'+R$.REPLAY_SETUP.RID+'/syms'
		}
		this.init();
	}
	WeakDependencyGraph.prototype.init = function(){
		this.storage.getClient(this.wsClient);
		/*
		if(R$.config.testAnalysis && R$.config.testAnalysis.testEnabled){
			this.eventEnter({id:1});
		}
		*/
	}
	function _inpect(all,cb){
		var res = [];
		for(var i=0;i<all.length;i++){
			var info = {};
			//info.node = all[i];
			info.evid = all[i].evid;
			info.name = all[i].getName();
			if(all[i].dataChoice)
				info.dataChoice = all[i].dataChoice;
			if(all[i].symbolic)
				info.symbolic = all[i].symbolic.toString();
			res.push(info);
		}
		return res;
	}
	//TODO for test
	WeakDependencyGraph.prototype.inspect = function(){
		var writes = this.compatipleJs.writes.values();
		var ws = _inpect(writes);
		var reads = this.compatipleJs.reads.values();
		var rs = _inpect(reads);
		return {writes:ws,reads:rs};
	}
	WeakDependencyGraph.prototype.getEventItems = function(eid){
		if (arguments.length === 0) eid = curEvent;

		if(!this.eventBox[eid]){
			this.eventBox[eid] = {};
		}
		return this.eventBox[eid];
	}
	WeakDependencyGraph.prototype.getItem = function(eid, opid){
		return this.getEventItems(eid)[opid];	
	}
	WeakDependencyGraph.prototype.putValue = function(node){
		if(node.evid != curEvent){
			this.compatibleDOM.cache();
			prevEvent = curEvent;
			curEvent = node.evid;
		}
		if(!wtype[node.getType()]){ //Reading operation
			var w = AnotatedValue.getLatestW(node.getVal())
			if(w.evid < curEvent){
				var wn = this.getItem(w.evid,w.opid);
				if(wn){
					wn.label = label.out;
					wn.symbolic = wn.getVal().symbolic;

					var dn = ctx.getVarInfo(wn.getName()).data.node;
					if(dn && dn.evid<wn.evid && dn.getType() == label.define){
						dn.label = dn.getType(); 
					}
				}

				var val = node.getVal();
				if(!val.symbolic || (val.symbolic && val.symbolic.symbolizedBy != curEvent)){
					this.compatipleJs.reassignSymbolic(node);
					if(val.symbolic) val.symbolic.symbolizedBy = curEvent;
					this.collector.installAuxiom(node);
				}else{
					this.compatipleJs.retreiveSymbolic(node);
				}
			} 
		}else{ //Write operation
			this.getEventItems()[node.opid] = node;
			this.compatipleJs.store(node);
			AnotatedValue.getLatestW(node.getVal()).evid = curEvent;
		}
		this.compatibleDOM.intercept(node);
		this.storage.add(node);
	}

	WeakDependencyGraph.prototype.putValue2 = function(node){
		if(node.evid,node.evid != curEvent)
			console.debug('[ERROR] putValue>node.evid:',node.evid,curEvent);
		if(!wtype[node.getType()]){ //Reading operation
			if(node.getType() == 'R' || node.getType() == 'G'){
				var w = AnotatedValue.getLatestW(node.getVal())
				if(w && w.evid < curEvent){
					var wn = this.getItem(w.evid,w.opid);
					if(wn){
						wn.label = label.out;
						wn.symbolic = wn.getVal().symbolic;
					}
				} 

				var data = ctx.getVarInfo(node.getName()).data;
				if(data.node && data.node.evid<node.evid && data.node.getType() == label.define){
					var dn = data.node;
					dn.label = dn.getType(); 
				}
				
				var val = node.getVal();
				if(val.symbolic && val.symbolic.symbolizedBy != curEvent){
					this.compatipleJs.reassignSymbolic(node);
					if(val.symbolic)
						val.symbolic.symbolizedBy = curEvent;

				}else{
					this.compatipleJs.retreiveSymbolic(node);
				}
			}
			this.collector.installAuxiom(node);
		}else{ //Write operation
			this.getEventItems()[node.opid] = node;
			this.compatipleJs.store(node);
			//node.evid = curEvent;
			AnotatedValue.getLatestW(node.getVal()).evid = curEvent;
		}
		this.compatibleDOM.intercept(node)
		this.storage.add(node);
	}

	//mock event enter
	WeakDependencyGraph.prototype.eventEnter = function(evt){
		if(evt.id != curEvent){
			this.compatibleDOM.cache();
			prevEvent = curEvent;
			curEvent = rr.util.html.setCurEvent(evt).id;
		}
	}
	WeakDependencyGraph.prototype.end = function(){
		this.eventEnter({id:'end'});
		var cons = this.collector.collectConstraints();
		if(false && _wj){
			console.debug('=== DEBUG INFORMATION ===');
			console.debug(_wj.values);
			var vds = _wj.values.constraints.validatings;
			for(var x in vds){
				console.debug('---validatings:',x);
				for(var i=0;i<vds[x].length;i++){
					console.log(vds[x][i]);
				}
			}
		}
		this.storage.getClient(this.wsClient).send(JSON.stringify(cons));
	}

	/*inputs: an Array of nodes
	*/
	function EventAuxiom(node){
		this.node = node;
		this.selected = node.evid;
		this.define = node.define?node.define.evid:null;
		this.items = [];
		this.events = [];
	}
	EventAuxiom.prototype.addDataChoice = function(key,value, evid){
		var symExp = key + '=' + value;
		this.items.push(symExp);
		this.events.push(Z3Auxiom.eventPrefix+evid);
	}
	EventAuxiom.prototype.getItem = function(eid){
		var idx = this.events.indexOf(Z3Auxiom.eventPrefix+eid);
		if(idx>=0)
			return this.items[idx];
	}
	//declaration and type compatible events 	
	EventAuxiom.prototype.getSeqGeneratingConstraints = function(){
		var define = this.define == this.selected?null:Z3Auxiom.selectEvent(this.define);
		return Z3Auxiom.createImplies(Z3Auxiom.selectEvent(this.selected),
				Z3Auxiom.createAnd(define,this.events.length>0?this.events.join('+') + '>=1':null));
	}
	
	EventAuxiom.prototype.getDomChoiceConstraints = function(){
		var choices = [];
		for(var i in this.node.domChoice){
			choices.push(Z3Auxiom.eventPrefix+i);
		}
		return Z3Auxiom.createImplies(Z3Auxiom.selectEvent(this.selected),
				Z3Auxiom.createAnd(choices.join('+') + '>=1'));
	}
	//deprecated:
	EventAuxiom.prototype.getSeqValidatingConstraints = function(){
		var choices = [];
		for(var i=0;i<this.items.length;i++){
			var oneChoice = [];
			//oneChoice.push(this.items[i]);
			oneChoice.push(Z3Auxiom.selectEvent(this.selected));
			oneChoice.push(this.events[i]+'==1');
			
			if(i>0)
				oneChoice.push(this.events.slice(0,i).join('+')+'<='+i);

			for(var j=i+1;j<this.items.length;j++){
				oneChoice.push(this.events[j]+'==0');
			}

			//choices.push(Z3Auxiom.createAnd.apply(Z3Auxiom,oneChoice));
			choices.push(Z3Auxiom.createIf(oneChoice, this.items[i]));
		}
		return choices;
	}
	function Z3Auxiom(){
	}
	
	Z3Auxiom._create = function(prefix,args){
		var res = [];
		for(var i=0;i<args.length;i++){
			if(args[i])
				res.push(args[i].toString());	
		}
		if(res.length>1){
			return prefix+'('+res.join(',')+')';
		}else if(res.length==1){
			return res[0];
		}
		return null;
	}
	Z3Auxiom.createOr = function(){
		return Z3Auxiom._create('Or',arguments);
	}
	Z3Auxiom.createAnd = function(){
		return Z3Auxiom._create('And',arguments);
	}
	Z3Auxiom.createImplies = function(p,q){
		if(p && q)
			return 'Implies('+p+','+ q+')';
	}
	Z3Auxiom.createIf = function(conds, then){
		return 'if('+conds.join('&&')+') '+ then;	
	}
	Z3Auxiom.selectEvent = function(eid, noPrefix){
		var prefix = noPrefix?'':Z3Auxiom.eventPrefix;
		if(eid) return prefix+eid+'==1';
	}
	Z3Auxiom.unSelectEvent = function(eid, noPrefix){
		var prefix = noPrefix?'':Z3Auxiom.eventPrefix;
		if(eid) return prefix+eid+'==0';
	}
	Z3Auxiom.eventPrefix = 'v.e';
	
	function ConstraintCollector(){
		this.generatings = {};
		this.validatings = {};
		this.events = new Map();
	}
	ConstraintCollector.prototype.getPathConstraints = function(){
		var res = [];
		var pcs = R$.pathConstraint;

		for(var i=0;i<pcs.length;i++){
			res.push(pcs[i][1].toString());
		}
		return Z3Auxiom.createAnd.apply(Z3Auxiom,res);
	}
	ConstraintCollector.prototype.installAuxiom = function(node){
		//compatible types
		var values = node.dataChoice; 
		var key = node.symbolic;
		var eas = new EventAuxiom(node);
		this.events.put(node.evid,true);
		for(var j in values){
			var value = values[j].symbolic;
			if(typeof values[j].symValue!='undefined'){
				value = values[j].symValue.toString();
			}
			if(node.getType()=='F' || node.evid != values[j].evid){
				eas.addDataChoice(key,value,values[j].evid);
				this.events.put(values[j].evid,true);
			}
		}
		//FOR QUnit test
		if(R$.REPLAY_SETUP.testEnabled){	
			node._dataChoice = eas;
		}
		this.generatings[node.evid+'_'+node.__iid+'_'+node.opid] = eas.getSeqGeneratingConstraints();
		this.validatings[node.evid+'_'+node.__iid+'_'+node.opid] = eas.getSeqValidatingConstraints();
		return node;
	}
	ConstraintCollector.prototype.installDOMAuxiom = function(node){
		var values = node.domChoice;
		this.events.put(node.evid,true);		
		for(var i in node.domChoice){
			this.events.put(i,true);		
		}
		var eas = new EventAuxiom(node);
		console.debug('===========generatings:',node);
		this.generatings[node.evid+'_'+node.__iid+'_'+node.opid+'_dom'] = eas.getDomChoiceConstraints();
	}
	ConstraintCollector.prototype.collectConstraints = function(){
		var res = {generatings:this.generatings,validatings:this.validatings,events:this.events.keyArray(),pathConstraints:this.getPathConstraints()};
		_wj.put(['constraints'], res);
		return res;
	}
	rr.dps.WeakDependencyGraph = WeakDependencyGraph;
})(R$);
