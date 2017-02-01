if(typeof R$ == 'undefined'){
	R$ = {};
}
(function(rr){
	var dps = rr.dps = rr.dps || {};
	var logger = rr.common.util.logger;
	var Map = rr.common.util.Map;

	var bufLimit = rr.config.rr_socket_bufLimit;
	var getOpid = dps.AnotatedValue.getOpid;
	function Buffer(){
		this.list = new Array();
	}

	function defaultClient(){
		return {
			name:'DPS',
			uri:'ws://'+R$.config.rr_socket_server+'/'+ R$.REPLAY_SETUP.RID
		}
	};
	function DataStorage(mode){
		this.mode = mode;
		this.init = function(){
			this.all = [];
			this.q = [];
			this.fieldsFilter = ['__iid','__type','test','ce','cr','opid','evid','dps','mode','M'];
			this.clients = {};
			this.getClient();
		}
		this.init();
	}
	//saving nodes
	DataStorage.prototype.add = function(node){
		if(!node || node.ignore || node.persisted) return;
		
		if(this.all.length >= bufLimit ){
			this.q.push(this.all);
			this.all = [];
			this.flush();
		}
		this.all.push(node);
		node.persisted = true;
	}
	DataStorage.prototype.addDirectDps = function(node,vals,ignore){
		if(ignore)
			return;

		if(vals && vals.length){
			var opid = node.opid;
			node.dps = node.dps || new Map();
			for(var i=0;i<vals.length;i++){
				var v = vals[i];
				var vid = getOpid(v);
				if(vid && vid<opid){
					//TODO:add to dps if the vid is a read operation?
					node.dps.put(vid, true);
				}
			}
		}
	}
	DataStorage.retreiveDps = function(node){
		return node.dps = node.dps || new Map();
	}
	
	/*
	 * to remove the dpendence from the dps of node opid
	 * @Param isRemove  whether remove the node(dpsid) in ther graph
	 */
	DataStorage.prototype.refactorDps = function(type,opid,dpsid){
		var s = R$.util.json.stringify({T:type,opid:opid,dpsid:dpsid});
		this.getClient().send('alt:'+s);	
		//logger.log('[refactorDps...]',s);
	}

	DataStorage.prototype.getClient = function(client){
		var client = client || defaultClient();
		if(this.clients[client.name]){
			return this.clients[client.name];
		}else{
			this.clients[client.name] = new WebSocket(client.uri); 
			this.clients[client.name].onerror = function(evt){
				logger.log('WebSocket error:',evt);	
			};
			return this.clients[client.name];
		}
	}
			
	DataStorage.prototype.flush = function(){
		if(this.q.length>0){
			for(var i=0;i<this.q.length;i++){
				var s = '';
				var arr = this.q[i];
				for(var j=0;j<arr.length;j++){
					try{
						//var ddps = DataStorage.retreiveDps(arr[j]);
						//if(ddps.size()>0){
							//arr[j]._dps = ddps.keyArray();
							s+= R$.util.json.stringifyWithFilter(arr[j],this.fieldsFilter)+'\n';
						//}
					}catch(e){
						logger.log('Error:', e, arr[j]);
					}
				}
				s = 'tmp;'+s;
				R$.s = s;
				this.getClient().send(s);
				this.q.splice(i,1);
				//logger.log('send success:',arr[0].opid,arr);
			}
		}
	}
		
	DataStorage.prototype.end = function(st){
		if(this.mode != dps.mode.WEAK){
			this.q.push(this.all);
			this.all = [];
			this.flush();
			var msg = 'end;'+st;
			this.getClient().send(msg);
			console.log('[run dynamic slicing]sending request:',msg);
		}
			
	}

	dps.DataStorage = DataStorage;
    
})(R$)
