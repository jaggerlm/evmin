(function(){
	
	//****************** express server begin **************************
	var express = require('express');
	var routes = require('./routes');
	var constants = require('../rr.constant.js').constants;
	require('../jalangi/instrument/locationToiid.js');
	require('../jalangi/instrument/iidToLocation.js');
	var DDGReader = require('./DDGReader.js').DDGReader;
	var jalangi_conf = require('../jalangi.config.js').config;
	require('../rr.config.js');
	var logger = require('../log4js.js').logger;

	var common = require('../rr.util.js').common;
	var proxy_conf = R$.config;
	var fs = require('fs');
	var mkdirp = require('mkdirp');
	var sys = require('sys')
	var path = require('path'); 	
	var app = express();
	var url = require('url');
	var Map = require('collection').Map;
	var Set = require('collection').Set;
	var TRACE_FILE_NAME = 'jalangi_trace';
	var fileIndex = 1; 
	var options = {doWeakdps:false};
	var flag; //for testing
	
	function init(){
		if (!fs.existsSync(jalangi_conf.logpath)) {
	  		mkdirp.sync(jalangi_conf.logpath);
	  	}
	}
	init();
	app.set('views', __dirname + '/views');
	app.set('view engine','ejs');
	app.set('development', function(){
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});
	app.use(express.static(__dirname+'/../../../public'));
	app.use(express.static(__dirname+'/../../../proxys'));
	var bodyParser = require('body-parser');
	app.use(bodyParser.urlencoded({extended:false,limit:proxy_conf.MAX_LOG_SIZE}));
	app.use(bodyParser.raw({limit:proxy_conf.MAX_LOG_SIZE}));


	app.use(function(req,res,next){
		res.set('Access-Control-Allow-Origin','*');
		res.set('Access-Control-Allow-Methods','*');
		res.set('Access-Control-Allow-Headers','*');
		next();
	})

	/**
	 * service
	 */
	var jsreplay_preffix = '/service';
	app.route(jsreplay_preffix+'/file')
		.get(function(req,res){
			var file = jalangi_conf.logpath+req.query.filename||'';
			if(fs.existsSync(file) && fs.lstatSync(file).isFile()){
				res.set('Content-Type', 'application/json');
				res.status(200).send(fs.readFileSync(file).toString());
			}else{
				res.status(404).send('File not found');
			}
		}).post(function(req,res){
			var filename = req.body.filename;
			var content = req.body.content;
			if(content)
				fs.appendFileSync(jalangi_conf.logpath+filename,content);		
		});
	function getFinalLog(sid,logFile,reduce){
		var result = null;
		if(!reduce){
			if(fs.existsSync(logFile) && fs.lstatSync(logFile).isFile()){
				result = fs.readFileSync(logFile).toString();
			}
			return result;
		}
		result = getReduceArray(sid,logFile,reduce);	
		return  result.join(proxy_conf.record_separator);
	}

	function getFullLogArray(logFile){
		var result = "";
		if(fs.existsSync(logFile) && fs.lstatSync(logFile).isFile()){
			result = fs.readFileSync(logFile).toString();
		}
		return result.split(proxy_conf.record_separator);
		
	}
	function getReduceArray(sid,logFile,reduce){
		var result = [];
		var reduceFile = jalangi_conf.logpath + sid + "_" + reduce + ".log";
		if(fs.existsSync(reduceFile) && fs.lstatSync(reduceFile).isFile()){
			var content = fs.readFileSync(reduceFile).toString();
			var logcontent = fs.readFileSync(logFile).toString();
			var logs = logcontent.split(proxy_conf.record_separator);
			var list = content.split(proxy_conf.record_separator);
			for(var i=0;i<list.length;i++){
				var id = list[i];
				result.push(logs[id-1]);
			}
			var rr_end = JSON.parse(logs[logs.length-1]);
			var cond_File = jalangi_conf.logpath + sid +'.assert';
			if(fs.existsSync(cond_File)){
				var cond = fs.readFileSync(cond_File).toString();
				rr_end.condition = cond;
			}
			result.push(JSON.stringify(rr_end));
		}
		return result;

	}
	app.route(jsreplay_preffix+'/log').get(function(req,res){
		var sid = req.query.sid;
		var reduce = req.query.reduceid;
		var logFile = jalangi_conf.logpath+sid+'.log';
		var result = getFinalLog(sid,logFile,reduce);
		if(result){
			res.status(200).send(result).end();
		}else{
			res.status(404).send('File not found');
		}

	}).post(function(req,res){
		var sid = req.body.sid;
		var log = req.body.log;
		var reduce = req.body.reduceid;
		reduce = reduce?"_"+reduce:"";
	
		var logfile = path.join(process.env.PWD,path.join(jalangi_conf.logpath , sid + reduce + ".log"));
		fs.writeFileSync(logfile,log||"");

		var list = ['error', 'env', 'nonds', 'host'];
		for(var i=0;i<list.length;i++){
			var suffix = req.body[(list[i])];
			if(suffix){
				fs.writeFileSync(jalangi_conf.logpath + sid + "."+list[i],suffix||"");
			}
		}
		res.status(200).end();
	});

	function parseHost(sid){
		try{
			var addr = fs.readFileSync(jalangi_conf.logpath + sid + ".host").toString().split(';');
			return {host:common.util.String.trim(addr[0]),url:common.util.String.trim(addr[1])};
		}catch(e){
			return {host:"unkown host",url:"unkown url"};
		}

	}
	app.route('/ui/logs').get(function(req,res){
		var sid = req.query.sid;
		var reduce = req.query.reduce;
		var local = req.query.local;
		var logFile = jalangi_conf.logpath+sid+'.log';
		var arr = [];

		if(!sid){
			var logfiles = fs.readdirSync(jalangi_conf.logpath);
			var items = [];
			for(var i=0;i<logfiles.length;i++){
				var filename = logfiles[i];
				if(filename.slice(-4)!='.log'){
					continue;
				}

				var fsid = filename.substring(0,filename.indexOf('.'));
				var freduce = "";
				if(filename.indexOf('_')>=0){
					freduce = fsid.substring(fsid.indexOf('_')+1);
					fsid = filename.substring(0,filename.indexOf('_'));
				};
				var d = fs.statSync(jalangi_conf.logpath+filename);
				items.push({sid:fsid,reduce:freduce,filename:filename,time:d.ctime});
			}
			items.sort(function(a,b){
				return b.time.getTime()-a.time.getTime();	
			});

			var html = "<table>";
			html +="<tr><td>trace file</td><td>create time</td></tr>";
			for(i=0;i<items.length;i++){
				var item = items[i];
				html += "<tr><td><a href='logs?sid="+item.sid+"&reduce="+item.reduce+"'>"+item.filename+"</a></td><td>"+item.time+"</td></tr>";
			}
			html +="</table>";
			res.status(200).send(html).end();
			return;
		}

		if(!reduce){
			arr = getFullLogArray(logFile);
		}else{
			if(local){
				arr = [];
			}else{
				arr = getReduceArray(sid,logFile,reduce);
			}
		}
		var maxid = 0;
		var trs = "";
		var evts = {};
		for(var i=0;i<arr.length;i++){
			if(!arr[i] || arr[i].length<1)
				continue;
			var record = JSON.parse(arr[i]);
			trs += "<tr><td>"+(i+1)+"</td><td><a href='/ui/dps?sid="+sid+"&evtid="+record.id+"'>"+record.id+"</a></td><td>"+record.type+"</td><td>"+arr[i]+"</td></tr>";
			evts[record.id] = arr[i];
			maxid = record.id;
		}
		var addr = parseHost(sid);
		var html = '<h3 style="position: fixed;top:50;right: 30;color: green;background: rgb(54, 248, 88);padding: 5;">';
		html +='<script type="text/javascript">function dpsActions(tgt){var ajax = new XMLHttpRequest();ajax.open("get", tgt.href);ajax.onreadystatechange =function(){if(ajax.readyState==4)console.log(tgt.href,"["+ajax.status+"]");window.location.reload(true);};ajax.send(); return false;}</script>';
		html +='<ul><li><a onclick="return dpsActions(this)" href="/ui/dps/update?sid='+sid+'">update</a></li>'; 		
		html +='<li><a onclick="return dpsActions(this)" href="/ui/dps/backup?sid='+sid+'">backup</a></li>'; 		
		html +='<li><a onclick="return dpsActions(this)" href="/ui/dps/restore?sid='+sid+'">restore</a></li>'; 		
		html +='<li><a href="http://'+proxy_conf.rr_server+'/ui/logs">return</a></li></ul>'; 		
		
		html +='</h3>'+"<h3>request info</h3>";
		html += 'url:'+addr.url+'<p>';
		html += 'sid:'+sid+", reduce:"+(reduce||"0");
		html += '<h3>analyse</h3>';
		html += 'params: sid(string); base(base version to reduce);reduce(false|true); mode(RUN|STEP); policy(MIX|DATA|DOM|WEAK)<p>';
		html += 'default: reduce=false;mode=RUN;policy=MIX<p>';
		html += 'for example:';
		var t_preffix = 'http://'+addr.host+'/rr_replay';
		var url_0 = t_preffix+'?sid='+sid;
		var url_1 = t_preffix+'?sid='+sid+'&reduce=true';
		var url_2 = t_preffix+'?sid='+sid+'&reduce=true&base=1';
		html +='<ul><li>Record: [Proxy port:8001]</li>';
		html +='<li>Replay without analysis: [Proxy port:8002] <a href="'+url_0+'" target="_blank">'+url_0+'</a></li>';
		html +='<li>Event handler analysis:[Proxy port:8002] <a href="'+url_1+'" target="_blank">'+url_1+'</a></li>';
		html +='<li>Slicing-based dependency analysis(slicing): [Proxy port:8501] <a href="'+url_2+'" target="_blank">'+url_2+'</a> [&policy=MIX|DOM|DATA]</li>';
		html +='<li>Symbolic-based weak analysis: [Proxy port:8502] <a href="'+url_2+'&policy=WEAK" target="_blank">'+url_2+'&policy=WEAK</a></li></ul>'
		html += "<h3>env info</h3>" + fs.readFileSync(jalangi_conf.logpath+sid+".env").toString()+"<p><hr>";
		html += "<h3>event log trace(reduce/total:"+arr.length+"/"+maxid+")</h3><table>";
		html +="<tr><td>line</td><td>id</td><td>type</td><td>event</td>"
		html += trs;
		html+="</table>";
		res.status(200).send(html).end();
	});

	function bst(ecut, graph){
		//console.log('=======ecut',ecut);
		//console.log('=======graph',graph);
		var res = {};
		var q = ecut;
		for(var i=0;i<q.length;i++){
			res[q[i]] = true;
		}
		while(q.length>0){
			var ev = q.shift();
			for(dev in graph[ev]){
				if(!res[dev]){
					q.push(dev);
					res[dev] = true;
				}
			}
		}
		var list=[];
		for(var i in res){
			list.push(i);
		}
		return list;
	}
	
	function recalculateLog2(sid){
		var logFile = jalangi_conf.logpath+sid+'_2.log';
		var regex = new RegExp('(\\d+)->(\\d+).{3}(.*)');
		var lines = fs.readFileSync(logFile+'.det').toString().split('\n');
		var graph = {};
		var ecut = [];
		for(var i=0;i<lines.length;i++){
			var arr = regex.exec(lines[i]);
			if(arr){
				graph[arr[1]] = graph[arr[1]] || {};
				graph[arr[1]][arr[2]] = true;
			}else if(lines[i] && lines[i].indexOf('eventCut:')>=0){
				ecut = JSON.parse(lines[i].split(':')[1]);
			}
			
		}

		var list = bst(ecut, graph);
		fs.writeFileSync(logFile,list.join(';;;'));
		//console.log('list:',list);

	}


	/*
	 *1 to multiple map
	 */
	function MMap(){
		this.keys = {};
		var size = 0;
		this.put = function(key,value){
			var values = this.get(key);
			if(!values.has(value)){
				values.add(value);
				size++;
			}
		}

		this.get = function(key){
			if(!this.keys[key]){
				this.keys[key ] = new Set();
			}
			return this.keys[key];
		}
		this.has = function(key,value){
			if(this.get(key).has(value)){
				return true;
			}
			return false;
		}
		this.size = function(){
			return size;
		}
		this.toString = function(){
			var res = [];
			for(var key in this.keys){
				res.push(key+'->'+this.get(key));
			}
			return res.join(',');
		}
	}
	
	/**
	 *
	 */
	function IidDetails(){
		this.keys = [];
		this.values = [];
		var sizes = {};
		var strings=[];
		//event pair size that caused by *->iid
		this.sizeThatDepndsOnIid = function(iid){
			return sizes[iid];
		}
		this.summaryIid = function(iid){
			var res = {size:0,eps:[]};
			for(var i=0;i<this.keys.length;i++){
				if(this.keys[i][1] == iid){
					res.size+= this.get(this.keys[i]).size();
					res.eps.push('<strong>'+this.keys[i][0]+'->'+iid+":</strong>"+this.get(this.keys[i]).toString());
				}
			}
			return res;
		}
		/*
		 *key: [iid1, iid2], value:[ev1, ev2]
		 */
		this.put = function(key,value){
			var item = this.get(key);
			if(item.has(value[0],value[1])){
				return;
			}else{
				item.put(value[0],value[1]);
				sizes[key[1]] = sizes[key[1]]+1 || 1;
				strings.push();
			}
		}
		this.get = function(key){
			var idx = this.indexOf(key);
			if(idx >=0){
				return this.values[idx];
			}
			this.keys.push(key);
			var mm = new MMap();
			this.values.push(mm);
			return mm;
		}
		function cmp(v1, v2){
			if(v1[0] == v2[0] && v1[1] == v2[1]){
				return true;
			}
			return false;
		}
		this.indexOf = function(key){
			for(var i=0;i<this.keys.length;i++){
				if(cmp(this.keys[i],key)){
					return i;
				}
			}
			return -1;
		}
	}
	function getIidDpsDetails(iids,iidDpsDetails){
		if(!options.doWeakdps) return "";
		var detailInfo = '<h4>Count of event pairs caused by '+iids[0]+'->'+iids[1]+':'+iidDpsDetails.get(iids).size()+'</h4>';
		detailInfo += iidDpsDetails.get(iids).toString();
		var sm = iidDpsDetails.summaryIid(iids[1]);
		detailInfo+= '<h4>Count of event pairs caused by *->'+iids[1]+':'+sm.size+'</h4>';
		detailInfo += sm.eps.join('<p>');
		return detailInfo;
	
	}
	
	app.get('/ui/dps',function(req,res){
		var sid = req.query.sid;
		var evtid = req.query.evtid;
		var detFile = jalangi_conf.logpath+sid+'_2.log.det';
		var lines = fs.readFileSync(detFile).toString().split('\n');
		var dpsBy = {};
		var dpsOn = {};
		var iidDpsDetails = new IidDetails();
		var regex = new RegExp('(\\d+)->(\\d+).{3}(.*)');
		var iidReg = new RegExp('iid:\\d+','g');
		flag  = 1;
		for(var i=0;i<lines.length;i++){
			var arr = regex.exec(lines[i]);
			if(arr){
				if(arr[2] == evtid){
					dpsBy[arr[1]] = dpsBy[arr[1]] || [];
					dpsBy[arr[1]].push(arr[3]);

				}else if(arr[1] == evtid){
					dpsOn[arr[2]] = dpsOn[arr[2]] || [];
					dpsOn[arr[2]].push(arr[3]);
				}
				if(options.doWeakdps){
					var iids = arr[3].match(iidReg).map(function(v){return v.substring(4)});
					iidDpsDetails.put(iids,[arr[1],arr[2]]);
				}
			}
		}
		
		var html = '<h3>sid:'+sid+'; event id:'+evtid+'</h3><h4> <a href="#dpsBy">Dpended By List</a> <a href="#dpsOn">Dpends On List</a></h4>';
		html+='<hr><h4 id="dpsBy">Event '+evtid+' is Depended By:</h4>';
		
		var opidReg = new RegExp('opid:\\d+','g');
		var anchors = '';
		var count = 0;
		table='<table>';
		for(var dpsby in dpsBy){
			count++;
			anchors+='<a href="#'+dpsby+'">'+dpsby+'</a>; ';
			table+='<tr>';
			table+='<td id="'+dpsby+'" style="vertical-align:top">'+dpsby+' <a href="/ui/dps/d/ev?sid='+sid+'&ev1='+dpsby+'&ev2='+evtid+'">delete</a></td>';
			table+='<td><ul>'
			var list = dpsBy[dpsby];
			for(var j=0;j<list.length;j++){
				var opids = list[j].match(opidReg);
				var iids = list[j].match(iidReg).map(function(v){return v.substring(4)});
				var detailInfo = getIidDpsDetails(iids,iidDpsDetails);
				
				table+='<li title="click to see details"><a href="/ui/dps/d/op?sid='+sid+'&op1='+opids[0]+'&op2='+opids[1]+'">delete</a><a onclick="return false" href="/ui/cmp?sid='+sid+'&L='+encodeURI(list[j])+'" style="text-decoration:none;color:inherit">'+list[j].replace('->','<p>->').replace(/L:\(([^\)]*)\)/g,'<span style="color:green">$1</span>')+'</a><div>'+detailInfo+'</div></li>';
			}
			table+='</ul></td>';
			table+='</tr>'
		}
		table+='</table>';
		html+='<h4>Totaling '+count+': '+anchors+'</h4>'+table;

		html+='<hr><h4 id="dpsOn">Event '+evtid+' Depends On:</h4>';
		anchors = '';
		table='<table>';
		count=0;
		for(var dpson in dpsOn){
			count++;
			anchors+='<a href="#'+dpson+'">'+dpson+'</a>; ';
			table+='<tr>';
			table+='<td id="'+dpson+'"  style="vertical-align:top">'+dpson+' <a href="/ui/dps/d/ev?sid='+sid+'&ev1='+evtid+'&ev2='+dpson+'">delete</a></td>';
			table+='<td><ul>'
			var list = dpsOn[dpson];
			for(var j=0;j<list.length;j++){
				var opids = list[j].match(opidReg);
				var iids = list[j].match(iidReg).map(function(v){return v.substring(4)});
				var detailInfo = getIidDpsDetails(iids,iidDpsDetails);

				table+='<li title="click to see details"><a href="/ui/dps/d/op?sid='+sid+'&op1='+opids[0]+'&op2='+opids[1]+'">delete</a><a href="/ui/cmp?sid='+sid+'&L='+encodeURI(list[j])+'" style="text-decoration:none;color:inherit">'+list[j].replace('->','<p>->').replace(/L:\(([^\)]*)\)/g,'<span style="color:green">$1</span>')+'</a><div>'+detailInfo+'</div></li>';
			}
			table+='</ul></td>';
			table+='</tr>'
		}
		table+='</table>';
		html+='<h4>Totaling '+count+': '+anchors+'</h4>'+table;
		res.status(200).send(html).end();

	});
    app.get('/ui/dps/advanced',routes.advanced);
	//TODO	
	function removeDetItemByEv(sid,ev1,ev2){
		var detFile = jalangi_conf.logpath+sid+'_2.log.det';
		var lines = fs.readFileSync(detFile).toString().split('\n');
		var str = '';
		var rmed = '';
		for(var i=0;i<lines.length;i++){
			if(lines[i].indexOf(ev1+'->'+ev2)<0){
				str+=lines[i]+'\n';
			}else{
				rmed+=lines[i]+'<p>';
			}
		}
		fs.writeFileSync(detFile,str.slice(0,-1));
		return rmed;
	}
	function removeDetItemByOpid(sid,opid1,opid2){
		var detFile = jalangi_conf.logpath+sid+'_2.log.det';
		var lines = fs.readFileSync(detFile).toString().split('\n');
		for(var i=0;i<lines.length;i++){
			if(lines[i].indexOf(opid1)>=0 && lines[i].indexOf(opid2)>=0){
				var rmed = lines.splice(i,1);
				fs.writeFileSync(detFile,lines.join('\n'));
				return rmed;
			}
		}
		return "";
	}
	function restoreDet(sid){
		var detFile = jalangi_conf.logpath+sid+'_2.log';
		fs.writeFileSync(detFile,fs.readFileSync(detFile+'.bak'));
		fs.writeFileSync(detFile+'.det',fs.readFileSync(detFile+'.det.bak'));
	}
	function backupDet(sid){
		var detFile = jalangi_conf.logpath+sid+'_2.log';	
		fs.writeFileSync(detFile+'.bak',fs.readFileSync(detFile));	
		fs.writeFileSync(detFile+'.det.bak',fs.readFileSync(detFile+'.det'));
	}
	app.get('/ui/dps/update',function(req,res){
		var sid = req.query.sid;
		recalculateLog2(sid);
		res.status(200).send('ok').end();
	});
	app.get('/ui/dps/backup',function(req,res){
		var sid = req.query.sid;
		backupDet(sid);
		res.status(200).send('ok').end();
	});
	app.get('/ui/dps/d/ev',function(req,res){
		var sid = req.query.sid;
		var ev1 = req.query.ev1;
		var ev2 = req.query.ev2;
		var info = '<h3>sid:'+sid+'; evid:'+ev1+"->evid:"+ev2+"</h3><hr>removed items<p>";
		res.status(200).send(info+removeDetItemByEv(sid,ev1,ev2)).end();
	});
	app.get('/ui/dps/d/op',function(req,res){
		var sid = req.query.sid;
		var opid1 = req.query.op1;
		var opid2 = req.query.op2;
		var info = '<h3>sid:'+sid+'; '+opid1+"->"+opid2+"</h3><hr>removed items<p>";
		res.status(200).send(info+removeDetItemByOpid(sid,opid1,opid2)).end();
	});
	app.get('/ui/dps/restore',function(req,res){
		var sid = req.query.sid;
		restoreDet(sid);
		res.status(200).send('ok').end();
	});
	app.get('/ui/cmp',function(req,res){
		var sid = req.query.sid;
		var Locs = req.query.L;
		res.status(200).send(Locs).end();
	});
	//TODO
	app.get('/cmd/replay',function(req,res){
		var sid = req.query.sid;
		var env = fs.readFileSync(jalangi_conf.logpath + sid );
	});
	
	//***
	// express Ws
	var expressWs = require('express-ws')(app);
	app.ws('/:sid/:suffix',function(ws,req){
		ws.on('message',function(msg){
			appendToLog(req.params.sid,req.params.suffix,msg,true);
			logger.info('saving symbolic recordings to file: '+jalangi_conf.logpath+req.params.sid+'.'+req.params.suffix);
		});
	});
	app.listen(proxy_conf.rr_server_port, function() {
	    logger.info('web service running on port %d', proxy_conf.rr_server_port);
	});
	
	
	//************************** websocket ************************************
	//is used for uploading dependency data
	var WebSocketServer = require('ws').Server,wss = new WebSocketServer({ port: 3000});
	//console.log('WebSocket running on port '+ 3000);
	function removeFile(file){
		if(fs.existsSync(file)){
			fs.unlink(file);
		}
	}
	function appendToLog(sid,suffix,content,overwrite){
		var filename = jalangi_conf.logpath + sid + "." + suffix;
		if(overwrite){
			removeFile(filename);
		}
		if(content && content.length>0){
			if(content[content.length-1] !== '\n')
				content+='\n';
			fs.appendFileSync(filename, content, {flag:'a+'});
		}			
	}
	function getMin(obj){
		var dft = -1;
		if(obj instanceof Array){
			if(obj.length>0){
				obj.sort(function(a,b){
					return a-b;
				});
				return obj[0];
			}
			return dft;
		}else if(typeof obj === 'string' || typeof obj === 'number'){
			return parseInt(obj);
		}else{
			return dft;
		}
	}
	function Handler(pattern,func){
		this.pattern = pattern;
		this.handle = func;
		this.init = function (ctx){
			var url = ctx.url;
			var ms = url.match(this.pattern);
			if(ms){
				ctx.sid = ms[1];
				var prefix = jalangi_conf.logpath + ctx.sid;
				ctx.inited = true;
				removeFile(prefix + '.tmp');
				removeFile(prefix + '.alt');
			}
		}
	}


	var handler = new Handler(new RegExp('^\\/([^\\/]*)$'),function(message,ctx){
			var r = /([^;]*);(.*)/;
			var ms = message.match(r);
			if(ms){
				var sid = ctx.sid;
				var proto = ms[1];
				
				if(proto == 'tmp'){
					msg = message.substring(4);
					appendToLog(sid,'tmp',msg);
				}else if(proto == 'alt'){
					msg = message.substring(4);
					appendToLog(sid,'alt',msg);
				}else if(proto == 'end'){
					msg = message.substring(4);
					return end(msg,ctx);
				}
			}
	});

	function end(msg,ctx){
		var sid = ctx.sid;
		try{
			var msg = JSON.parse(msg);
		}catch(e){
			logger.error('invalid JSON message. socket:',ctx.url);
			throw e;
		}
		if(msg.statusCode == constants.AnalyseStatus.OK){
			return;
			if(!msg.errors) return;	
			//bakup sourcemap
			var iids = fs.readFileSync(config.instrumentedScripts + '/default/jalangi_sourcemap.js');
			fs.writeFileSync(config.logpath + sid + '_sourcemap.js',iids);
			try{
				J$.reloadIids(sid);
			}catch(e){
				logger.error('ERROR. load sourcemap error.',e);
			}
			var file = config.logpath+sid+'_'+ constants.REDUCE_EVENT_DPS+'.log';
			var ddg = new DDGReader({o:false,debug:true,dpsLevel:'opid',sid:sid,file:file,granularity:3});
			//find slice by errorid
			return ddg.getSlice(msg.errors.evs).list;
			/*	
			//find slice by assertion
			var faultCriterion = ddg.getFaultCriterionByAsserts(getMin(msg.errors.evs));
			res.assert = ddg.getSlice(faultCriterion,{sid:sid,file:fprefix+'.log.a',debug:true, request:msg}).list;
			*/
			
			/*
			//find slice by given location
			faultCriterion = ddg.getFaultCriterionByIids(J$.locationToIid(sid,function(rcd){
				if(rcd[0] == msg.errors.loc.file && msg.errors.loc.L<=rcd[1] && msg.errors.loc.H>=rcd[3]){
					return true;
				}
			}));
			res.precise = ddg.getSlice(faultCriterion,{sid:sid,file:fprefix+'.log.p',debug:true, request:msg}).list;

			return JSON.stringify(res);
			*/
		}else{
			logger.error('Dynamic slicing failed, the given log can not reproduce the failure. sid:',sid);
		}
	}



	wss.on('connection', function connection(ws) {
		var ctx = {inited:false,url:ws.upgradeReq.url};
		handler.init(ctx);
		ws.on('message', function incoming(message){
			try{
				var res = handler.handle(message, ctx);
				if(res){
					ws.send(res);
				}
			}catch(e){
				console.error('ERROR: failed to handle webSocket request:',ctx.url,'; caused by:'+e.message);
			}
		});
		ws.on('error',function(e){
			logger.error('[#ws.onerror...]',e);
		});
	});

})()	
