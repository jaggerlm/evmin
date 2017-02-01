var proxy = require('./rewriting-proxy.js');
var jalangi_conf = require('../jalangi.config.js').config;
require('../rr.config.js');
var proxy_conf = R$.config;
var esnstrument = require("../jalangi/instrument/esnstrument.js");
var fs = require("fs");
var path = require("path");
var ArgumentParser = require('argparse').ArgumentParser;
var mkdirp = require('mkdirp');
var instUtil = require('./instUtil.js');
var router = require('./rr_router.js');

var outputDir = jalangi_conf.instrumentedScripts;

var ignoreInline = false;

function rewriter(src, metadata, sid) {
	if(!src) return '';
	if(!sid)
		sid='default';
	var odir = getOutputDir(sid);
	var url = metadata.url;
	if (ignoreInline && instUtil.isInlineScript(url)) {
		console.log("ignoring inline script " + url);
		return src;
	}
	var basename = instUtil.createFilenameForScript(url);
	var filename = path.join(odir, basename);
	if(!fs.existsSync(filename)){
		fs.writeFileSync(filename, src);
	}
    var instFileName = basename.replace(new RegExp(".js$"), "_jalangi_.js");

    var options = {
        wrapProgram: true,
        filename: basename,
        instFileName: instFileName,
        dirIIDFile: odir,
        metadata: true
    };
	var fpath = path.join(odir,instFileName);
	if(jalangi_conf.useCache && fs.existsSync(fpath)){
		instrumented = fs.readFileSync(fpath);
	}else{
	  	var instrumented = esnstrument.instrumentCodeDeprecated(src, options).code;
		fs.writeFileSync(fpath, instrumented);
	}
	return instrumented;
}
function getOutputDir(p) {
	var scriptDirToTry = outputDir;
	if(p){
		scriptDirToTry += '/'+ p;
	}
	if (!fs.existsSync(scriptDirToTry)) {
		mkdirp.sync(scriptDirToTry);
	}
	return scriptDirToTry;
}

function startProxy(headerCode,headerURLs,jswriter,port) {
	proxy.start({ headerCode:headerCode,headerURLs:headerURLs, rewriter: jswriter, port: port,router: router.router});
}

var parser = new ArgumentParser({ addHelp: true, description: "Jalangi instrumenting proxy server"});
parser.addArgument(['-o', '--outputDir'], { help: "output parent directory for instrumented scripts" } );
parser.addArgument(['-i', '--ignoreInline'], { help: "ignore all inline scripts", nargs: "?", defaultValue: false, constant: true});

var args = parser.parseArgs();
if (args.outputDir) {
	outputDir = args.outputDir;	
}
if (args.ignoreInline) {
	ignoreInline = args.ignoreInline;
}

var rrHeader = instUtil.getHeaders("record");
var replayHeader = instUtil.getHeaders("replay");
var analyseHeader = instUtil.getHeaders("analyse");
var weakAnalysisHeader = instUtil.getHeaders("weakAnalysis");

console.log("Record-replay proxy config:",JSON.stringify(proxy_conf.enables));

getOutputDir();

startProxy(null,rrHeader,null,proxy_conf.record_port);
console.log("Record proxy running on port "+proxy_conf.record_port);

startProxy(null,replayHeader,null,8002);
console.log("Replay/handler analysis proxy running on port ", 8002);

startProxy(null,analyseHeader,rewriter,proxy_conf.analyse_port);
console.log("Slicing-based dependency analysis proxy running on port "+proxy_conf.analyse_port);

var options = {
    wrapProgram: true,
    filename: 'SymbolicFunctions.js',
    instFileName: 'SymbolicFunctions_jalangi_.js',
    dirIIDFile: getOutputDir(),
	initIID: true,
    metadata: true
}
var ssrc = fs.readFileSync(path.join('./src/js/analyses2', 'SymbolicFunctions.js')).toString();
var instrumented = esnstrument.instrumentCodeDeprecated(ssrc, options).code;
var exec = require('child_process').exec;
mkdirp.sync('./log/SymbolicFunc/');
var cmd = 'cp '+getOutputDir()+'/jalangi* ./log/SymbolicFunc/';
exec(cmd, function(err){
	if(err){ console.log('[ERROR] An error occured while executing '+cmd);}
});
fs.writeFileSync(path.join('./log/SymbolicFunc', 'SymbolicFunctions_jalangi_.js'),instrumented);
startProxy(null,weakAnalysisHeader,rewriter,8502);
console.log("WeakAnalyze proxy running on port "+8502);
/*
fs.writeFileSync(outputDir+'/record_headerCode.js',rrHeaderCode);
fs.writeFileSync(outputDir+'/base_headerCode.js',replaycode);
fs.writeFileSync(outputDir+'/analyse_headerCode.js',analyseHeaderCode);
fs.writeFileSync(outputDir+'/weakAnalyse_headerCode.js',weakAnalysisCode);
*/

