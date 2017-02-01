/*jslint node: true */
/*global require console Buffer __dirname process*/
var http = require('http'),
    path = require('path'),
    urlparser = require('url'),
    HTML5 = require('html5'),
    jsdom = require('jsdom'),
	fs = require('fs'),
	express = require('express'),
	proxy = require('express-http-proxy');

var core = jsdom.browserAugmentation(jsdom.level(3));
var impl = new core.DOMImplementation();
var unparseable_count = 0;

function rewriteScript(src, metadata, rewriteFunc) {
	if(typeof rewriteFunc != "function"){
		return src;
	}
	var result;
	var prefix = "";
	if (src.match(/^javascript:/i)) {
		prefix = src.substring(0, "javascript".length + 1);
		src = src.substring(prefix.length);
	}
	try {
		result = rewriteFunc(src, metadata);
	} catch (e) {
		console.error("exception while rewriting script " + metadata.url);
		//console.error(e);
		return src;
	}
	result = prefix + result;
	return result;
}

var script_counter = 0,
	event_handler_counter = 0,
	js_url_counter = 0;
// event handler attributes
var event_handler_attribute_names = ["onabort", "onblur", "onchange", "onclick", "ondblclick",
	"onerror", "onfocus", "onkeydown", "onkeypress", "onkeyup",
	"onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover",
	"onmouseup", "onreset", "onresize", "onselect", "onsubmit", "onunload"
];
// attributes that may contain URLs (unsure whether all of these can actually contain 'javascript:' URLs)
var url_attribute_names = ["action", "cite", "code", "codebase", "data", "href", "manifest", "poster", "src"];

function getHeadScripts(headerCode,headerURLs){
	var res = "";
    if (headerCode) {
        res = "<script>" + headerCode + "</script>" + res;
    }
    if (headerURLs) {
        var urlTags = "";
        for (var i = 0; i < headerURLs.length; i++) {
            urlTags += "<script type='text/javascript' src=\"" + headerURLs[i] + "\"></script>";
        }
        res = urlTags + res;
    }
	return res;
}

function rewriterHeader(node,url, headerCode, headerURLs){
	var head = node.getElementsByTagName('head')[0];
    var innerHTML = head.innerHTML;
    head.innerHTML = getHeadScripts(headerCode,headerURLs)+innerHTML;
}
function walkDOM(node, url, rewriteFunc, headerCode, headerURLs) {
    var src, metadata;
    var tagName = (node.tagName || "").toLowerCase();
    if (tagName === 'head' && (headerCode || headerURLs)) {
        // first, recursively process any child nodes
        for (var ch=node.firstChild;ch;ch=ch.nextSibling) {
            walkDOM(ch, url, rewriteFunc, headerCode, headerURLs);
        }
        // then, insert header code as first child
        var innerHTML = node.innerHTML;
        node.innerHTML = getHeadScripts(headerCode,headerURLs)+innerHTML;
        return;
    } else if(tagName === 'script' && node.hasChildNodes()) {
	// handle scripts (but skip empty ones)
	// scripts without type are assumed to contain JavaScript
	if (!node.getAttribute("type") || node.getAttribute("type").match(/JavaScript/i)) {
	    // only rewrite inline scripts; external scripts are handled by request rewriting
	    if (!node.getAttribute("src")) {
		src = "";
		for (var ch=node.firstChild;ch;ch=ch.nextSibling)
		    src += ch.nodeValue;
		metadata = {
		    type: 'script',
		    inline: true,
		    url: url + "#inline-" + (script_counter++)
		};
		node.textContent = rewriteScript(src, metadata, rewriteFunc);
	    }
	}else{
			console.log('[warn] escape instrument inline script: not javascript');
		}
    } else if(node.nodeType === 1) {
	// handle event handlers and 'javascript:' URLs
	event_handler_attribute_names.forEach(function(attrib) {
	    if (node.hasAttribute(attrib)) {
		var src = node.getAttribute(attrib)+"";
		metadata = {
		    type: 'event-handler',
		    url: url + "#event-handler-" + (event_handler_counter++)
		};
		node.setAttribute(attrib, rewriteScript(src, metadata, rewriteFunc));
	    }
	});
	url_attribute_names.forEach(function(attrib) {
	    var val = node.getAttribute(attrib)+"";
	    if (val && val.match(/^javascript:/i)) {
		metadata = {
		    type: 'javascript-url',
		    url: url + "#js-url-" + (js_url_counter++)
		};
		node.setAttribute(attrib, rewriteScript(val, metadata, rewriteFunc));
	    }
	});
    }

    if (node.childNodes && node.childNodes.length)
	for (var i=0,n=node.childNodes.length;i<n;++i)
	    walkDOM(node.childNodes[i], url, rewriteFunc, headerCode, headerURLs);
}

/**
 * rewrite all the scripts in the given html string, using the rewriteFunc function
 */

function rewriteHTML(html, url, rewriter, headerCode, headerURLs) {
    //assert(rewriter, "must pass a rewriting function");
    var document = impl.createDocument();
    var parser = new HTML5.JSDOMParser(document, core);
    parser.parse(html);
	if(typeof rewriter != "function"){
		rewriterHeader(document,url, headerCode, headerURLs);
	}else{
		//console.log('[info]rewrite html: rewriter is not null');
   		walkDOM(document, url, rewriter, headerCode, headerURLs);
	}
    return document.innerHTML;
}
function start(options) {
	//assert(options.rewriter, "must provide rewriter function in options.rewriter");
	var headerCode = options.headerCode;
    var headerURLs = options.headerURLs;
	var rewriteFunc = options.rewriter;
	var router = options.router;

	var app = express();
	app.set('development', function(){
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});
	
	app.use(function(req,res,next){
		var handler = router.route(req.url);
		if(handler){
			handler.handle(req,res);
			return;
		}
		next();
	});
	var targetPort;
	app.use(proxy(function(req){
		return urlparser.parse(req.url).hostname;
	},{
		forwardPath: function(req, res){
			targetPort = urlparser.parse(req.url).port;
			return urlparser.parse(req.url).path;
		},
		intercept: function(rsp, data, req, res, callback){
			res.set('Access-Control-Allow-Origin','*');
			res.set('Access-Control-Allow-Methods','*');
			res.set('Access-Control-Allow-Headers','*');
			var content = data.toString();
			
			var tp = res.get('content-type')||'';
			if(tp.match(/JavaScript/i) || tp.match(/text/i) && req.url.match(/\.js$/i)){
				data = rewriteScript(content,{type: 'script',inline: false,url: req.url,source: content}, rewriteFunc);
			}else if(tp.match(/HTML/i)){
				if(content.match(/\s*<[^>]*>\s*/i))
					data = rewriteHTML(content, req.url, rewriteFunc, headerCode, headerURLs);
			}
			callback(null,data);
		},
		decorateRequest: function(req) {
			delete req.headers['accept-encoding'];
			req.port = targetPort;
			return req;
		}
	}));

	app.listen(options.port ? options.port : 8080);
}
exports.start = start;
exports.rewriteHTML = rewriteHTML;
