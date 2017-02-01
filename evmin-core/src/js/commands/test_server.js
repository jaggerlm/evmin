// QUnit test server
(function(){
	
	//****************** express server begin **************************
	var express = require('express');
	var proxy_conf = require('../rr.config.js').config;
	var app = express();
	var fs = require('fs');
	var instUtil = require('./instUtil.js');
	var esnstrument = require('../jalangi/instrument/esnstrument.js');
		
	var qunit_dir = __dirname + '/../../../qunit_test/';
	app.use(express.static(qunit_dir));

	app.get('/',function(req,res){
		res.redirect('/static/index.html');
	});
	
	app.use(function(req,res,next){
		res.set('Access-Control-Allow-Origin','*');
		res.set('Access-Control-Allow-Methods','*');
		res.set('Access-Control-Allow-Headers','*');
		next();
	})
	var testHeaders = instUtil.getHeaders("weakAnalysis",true,true);
	
	//handler the html file
	app.get('/html/:test/:name',function(req,res,next){
		try{
			var content = fs.readFileSync(qunit_dir +'static/'+req.params.test+'/'+req.params.name).toString();
			res.status(200).send(content.substring(0,content.indexOf('</head>')).concat(testHeaders+'</head>').concat(content.substring(content.indexOf('</head>')+7)));
		}catch(e){
			res.status(404).send(e.message);
		}
	});

	// handler the code to be tested
	app.get('/jalangi/:test/:name',function(req,res,next){
		var testdir = qunit_dir+'static/'+req.params.test+'/';
		var src = fs.readFileSync(testdir+req.params.name).toString();
		require('child_process').exec('cp ./instrumentedScripts/jalangi_initialIID.json '+ testdir);
		var instFileName = req.params.name.replace(new RegExp(".js$"), "_jalangi_.js");
		var ret = esnstrument.instrumentCodeDeprecated(src,{wrapProgram:true,dirIIDFile:testdir,filename:req.params.name,instFileName:instFileName,metadata:true,inlineIID:false});
		fs.writeFileSync(testdir+instFileName,ret.code);
		res.status(200).send(ret.code);	
	});
	app.listen(proxy_conf.test_server_port, function() {
	    console.log('Qunit test server running on port %d', proxy_conf.test_server_port);
		console.log('    To run a QUnit test, Please visit localhost:'+proxy_conf.test_server_port+'/html/:testDir/:testHtml');
	});
})()	
