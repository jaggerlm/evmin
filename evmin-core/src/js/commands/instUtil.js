/*
 * Copyright 2013 Samsung Information Systems America, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Author: Manu Sridharan

/*jslint node: true */
var fs = require('fs');
var path = require('path');
var urlParser = require('url');

var commonHeaderResource = [
	'src/js/rr.constant.js',
	'src/js/rr.util.js',
	'src/js/rr.config.js'
];

/**
 * which source files are required for Jalangi to run in the browser?
 */
var analyseHeaderResource = [
	"src/js/analyses2/AnotatedValue.js",
	'src/js/analyses2/DataStorage.js',
	"src/js/analyses2/DFG.js",
    "src/js/jalangi/Config.js",
	"src/js/analysis2.js",
    "node_modules/escodegen/escodegen.browser.js",
    "node_modules/acorn/acorn.js",
    "src/js/jalangi/utils/astUtil.js",
    "src/js/jalangi/instrument/esnstrument.js",
	"src/js/analyses2/EventDependency.js",
	'src/js/analyses2/Assert.js'
	];
var recordReplayResource = [
	'src/js/rr_script.js'
]
var symbolicResource = [
	'src/js/analyses2/InputManager.js',
	//'log/SymbolicFunc/SymbolicFunctions_jalangi_.js',
	'src/js/analyses2/SymbolicFunctions.js',
	'src/js/analyses2/ChainedAnalysis.js',
	'src/js/analyses2/ExecutionIndex.js',
	'src/js/analyses2/Symbolics.js',
	'src/js/analyses2/FromCharCodePredicate.js',
	'src/js/analyses2/ToStringPredicate.js',
	'src/js/analyses2/SymbolicStringPredicate.js',
	'src/js/analyses2/SymbolicRecorder.js',
	'src/js/analyses2/WeakAnalysis.js'
];

var setupResource = {
	record:['src/js/setup.record.js'],
	replay:['src/js/setup.replay.js']
}

/**
 * concatenates required scripts for Jalangi to run in the browser into a single string
 */

var cache = {};
function __getHeaders(mode,inline,wrap){
	var resources = commonHeaderResource;
	for (var idx in arguments){
		if(idx<=2) continue;
		var item = arguments[idx];
		resources = resources.concat(item);
	}
	if(cache[mode]){
		return cache[mode];
	}
	if(inline){
		var res = "";
		resources.forEach(function(src){
			var info = '//source.rr:'+src+"\n";
			try{
				res += info + fs.readFileSync(src).toString();
			}catch(e){
				console.log('[ERROR] source file not exist:',src);
			}
		});
		if(wrap){
			res = '<script type="text/javascript">'+res+'</script>';
		}
	}else{
		var res = [];
		resources.forEach(function(src){
			var filename = src.substring(src.lastIndexOf('/'));
			fs.writeFileSync('public/'+filename,fs.readFileSync(src));
			var uri = '/rr_public?js='+filename;
			if(wrap) uri = '<script type="text/javascript" src="'+uri+'"></script>';
			res.push(uri);
		});
	}
	cache[mode]=res;
	return res;
}
function getHeaders(mode,inline,wrap){
	if(mode == "record"){
		return __getHeaders(mode,inline,wrap,recordReplayResource,setupResource.record);
	}else if(mode == 'replay'){
		return __getHeaders(mode,inline,wrap,recordReplayResource,setupResource.replay);
	}else if(mode=='analyse'){
		return __getHeaders(mode,inline,wrap,analyseHeaderResource,recordReplayResource,setupResource.replay);
	}else if(mode == 'weakAnalysis'){
		return __getHeaders(mode,inline,wrap,analyseHeaderResource,symbolicResource,recordReplayResource,setupResource.replay);
	}else if(mode=='test'){
		return __getHeaders(mode,inline,wrap,analyseHeaderResource);
	}else{
		mode = "base";
		return __getHeaders(mode,inline,wrap,recordReplayResource);
	}
}

var inlineRegexp = /#(inline|event-handler|js-url)/;

/**
 * Does the url (obtained from rewriting-proxy) represent an inline script?
 */
function isInlineScript(url) {
    return inlineRegexp.test(url);
}

/**
 * generate a filename for a script with the given url
 */
function createFilenameForScript(url) {
    // TODO make this much more robust
    var parsed = urlParser.parse(url);
    if (inlineRegexp.test(url)) {
        return parsed.hash.substring(1) + ".js";
    } else {
        return parsed.pathname.substring(parsed.pathname.lastIndexOf("/") + 1);
    }
}
exports.getHeaders = getHeaders;
exports.isInlineScript = isInlineScript;
exports.createFilenameForScript = createFilenameForScript;
