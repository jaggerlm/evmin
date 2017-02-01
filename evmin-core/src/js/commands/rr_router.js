(function(){
	var	urlparser = require('url');
	var fs = require('fs');
	var instUtil = require('./instUtil.js');

	var handlers = {
		'/rr_replay':new ReplayHandler(),
		'/rr_public':new PublicResource()
	}

	function ReplayHandler(){
		this.handle = function(req,res){
			var uri = urlparser.parse(req.url,true);
			var sid = uri.query.sid||"";
			var mode = uri.query.mode||'RUN';
			var base = uri.query.base ||"";
			var reduce = uri.query.reduce||false;
			var policy = uri.query.policy||'MIX';
			var subset = uri.query.subset||'';
			var content = fs.readFileSync('src/js/tpl/control.html').toString();
			var headerScript = instUtil.getHeaders(null,null,true).join('\n');
			content = content
				.replace(/\{\{sid\}\}/,sid)
				.replace(/\{\{mode\}\}/,mode)
				.replace(/\{\{reduce\}\}/,reduce)
				.replace(/\{\{base\}\}/,base)
				.replace(/\{\{policy\}\}/,policy)
				.replace(/\{\{rr_script\}\}/,headerScript)
				.replace(/\{\{subset\}\}/,subset);
			res.send(content);
		}
	}
	function AnalysisHandler(){
		this.handle = function(req,res){
			var m = req.method;
			if(m == 'get' || m == 'GET'){
				console.log('GET /rr_analysis');
			}else{
				console.log('POST /rr_analysis');
				
			}
		}
	}
	function PublicResource(){
		this.handle = function(req,res){
			try{
				var content = fs.readFileSync('public/'+req.query.js).toString();
				res.send(content);
			}catch(e){
			}
		}
	}
	var router = {
		route:function(url){
			var uri = urlparser.parse(url);
			var p = uri.path;
			if(uri.path.indexOf('?')>=0){
				p = uri.path.substring(0,uri.path.indexOf('?'));
			}
			return handlers[p];
		}
		
	}

	exports.router = router;
})()

