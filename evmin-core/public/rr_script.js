(function(rr){
	var config = rr.config;
	var constants = rr.constants;
	rr.natives = rr.natives || {};
	var logger = rr.common.util.logger;

	/***************** constant and data structure definition begin ********************/
	
	/**
	 *  ctrl params. stored in cookie.
	 */
	
	//rr.RECORD_SESSION_ID = "";
	
	var RR_RECORD_SEPERATOR = config.record_separator;
	var XPATH_MAPPING = {window:'/window',document:'/document'};
	var RR_COMSTERMIZE_EVENTS = {ENV:"rr_env"}
	
	var LOG_SERVICE = config.logService;
	var FILE_SERVICE = config.fileService;
	/**
	 * elements that have load event
	 */
	var LOAD_TAGS = ['body', 'frame', 'frameset', 'iframe', 'img', 'link', 'script'];
	
	var RR_NATIVE_FUNC = {};
	
	//Event with value true will be ignored while replaying
	var EVENT_PLAY_IGNORE={load:true};
	var _LOG_EVENTS_FOR_DEBUG = {
		'click':true,
		'input':true
	}
	var RR_LAST_TIMESTAMP = -1;
	/**
	 * EventRecord: a record in the event log file
	 * @param e real event generate by browser or a ManualEvent
	 */
	function EventRecord(e){
		for(var i=0;i<rr.config.DOM_STD.EVENT_RECORD_FEILDS.length;i++){
			var name = rr.config.DOM_STD.EVENT_RECORD_FEILDS[i];
			if(typeof e[name]!= 'undefined'){
				this[name] = e[name];
			}
		}
		
		for(i=0;i<rr.config.DOM_STD.EVENT_RECORD_XPATH.length;i++){
			var name = rr.config.DOM_STD.EVENT_RECORD_XPATH[i];
			if(e[name]){
				this[name] = util.xpath.getXpath(name,e['view'],e[name]);
			}
			if(name == 'target' && !e.target && e.type!='rr_end' && e.type!='Date'){
				logger.log("[ERROR] target is null",e,this);
			}
		}

		this.toJSON = function(){
			var res = {};
			for(var i in this){
				if(typeof this[i] != "function" && this[i])
					res[i] = this[i];
			}
			return util.json.stringify(res);

			/*
			var res = [];
			for(var i in this){
				if(typeof this[i] != "function" && this[i])
					res.push( '"'+i+'":"'+(this[i])+'"');
			}
			return "{"+res.join(',')+"}";
			*/
		}
		
	}
	
	/**
	 * ManualEvent: event to dispatch manually
	 * @param record record(json string) from log file
	 */
	function ManualEvent(record){
		if(!record){
			return this;
		}

		record = util.json.parseJson(record);
		
		/*for(var i=0;i<rr.config.DOM_STD.EVENT_RECORD_FEILDS.length;i++){
			var name = rr.config.DOM_STD.EVENT_RECORD_FEILDS[i];
			if(record[name]){
				this[name] = record[name];
			}
		}*/
		for(var f in record){
			this[f] = record[f];
		}
			
		this.view = window;
		if(record['view']){
			this.view = util.xpath.selectViewNode(record['view']);
		}
		for(var j=0;j<rr.config.DOM_STD.EVENT_RECORD_XPATH.length;j++){
			var name = rr.config.DOM_STD.EVENT_RECORD_XPATH[j];
			if(record[name] && name !='view'){
				var node = util.xpath.selectNodes(this.view,record[name])|| window;
				if(node){
					this[name] = node[0];
				}
				
			}
		}
		if(this.type == 'rr_end') this.target = window;
		if(this.type != 'Date' &&this['target'] == null){
			logger.log('#ERROR: Manual Event: target is null:'+record.id,record,this);
		}
	}
	/***************** data structure definition end ********************/
	function getChromeVersion(){     
		var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
		return raw ? parseInt(raw[2], 10) : false;
	}
	var chromeVersion = getChromeVersion();
	var util = {
			getEventTimeStamp:function(){
				var ts = new rr.natives.Date().getTime();
				if(getChromeVersion()>=49){
					ts = ts-performance.timing.navigationStart;
					ts = ts>0?ts:0;
				}
				return ts;
			},
			cookie:{
				setCookie:function(name,value,exp)
				{
				    var Days = 30;
				    var expstr = '';
				    if(exp){
				    	expstr = ";expires=" + exp.toGMTString();
				    }
				    document.cookie = name + "="+ escape (value)+";path=/"+expstr;
				},
				getCookie: function (name)
				{
				    var arr = document.cookie.match(new rr.natives.RegExp("(^| )"+name+"=([^;]*)(;|$)"));
				    if(arr != null) 
				    	return unescape(arr[2]);
				    return null;
	
				},
				delCookie: function (name)
				{
				    var exp = new rr.natives.Date();
				    exp.setTime(exp.getTime() - 1);
				    var cval=this.getCookie(name);
				    if(cval!=null) document.cookie= name + "="+cval+";path=/;expires="+exp.toGMTString();
				},
				clearCookies:function(){
					var res = document.cookie.match(/[^ =;]+(?=\=)/g);
					if(res && res.length>0){
						for(var i=0;i<res.length;i++){
							this.delCookie(res[i]);
						}
						
					}
				}
			},
			localStorage:{
				getData:function(key){
					return window.localStorage[key];
				},
				setData:function(key,value){
					window.localStorage[key] = value;
				},
				delData:function(key){
					delete window.localStorage[key];
				},
				clearData:function(){
					for(var key in window.localStorage){
						this.delData(key);
					}
				}
				
			},
			sessionStorage:{
				getData:function(key){
					return window.sessionStorage[key];
				},
				setData:function(key,value){
					window.sessionStorage[key] = value;
				},
				delData:function(key){
					delete window.sessionStorage[key];
				},
				clearData:function(){
					for(var key in window.sessionStorage){
						this.delData(key);
					}
				}
				
			},
			UUID:{
				genUUID:function(){
					return new rr.natives.Date().getTime();
				}
			},
			mode:{
				isEventDps:function(){
					if(rr.REPLAY_SETUP.REDUCE && rr.REPLAY_SETUP.REDUCEID == constants.REDUCE_EVENT_DPS){
						return true;
					}
					return false;
				}
			},
			html:{
				refresh:function(){
					window.location.reload();
				},
				domReady:function(dom,callback){
					dom.onreadystatechange = function(){
						if(dom.readyState=='complete'){
							callback();
						}
					}
				},
				initRR_LOG:function(){
					if(window.parent == window){
						rr.RR_LOG = [];	
						rr.RR_CID = 1;
						rr.RR_NONDS = [];
					}
				},
				getRR_LOG:function(){
					if(window.parent != window){
						return window.parent.R$.RR_LOG;
					}
					return rr.RR_LOG;
				},
				getRR_CID:function(){
					if(window.parent != window){
						return window.parent.R$.RR_CID;
					}
					return rr.RR_CID;

				},
				incRR_CID:function(){
					if(window.parent != window){
						return window.parent.R$.RR_CID++;
					}
					return rr.RR_CID++;	
				},
				getRR_NONDS:function(){
					if(window.parent != window){
						return window.parent.R$.RR_NONDS;
					}
					return rr.RR_NONDS;
				
				},
				setCurEvent:function(e){
					R$.reduce.RR_CUR_REPLAY_EVENT = e;
					return R$.reduce.RR_CUR_REPLAY_EVENT;
				},
				getCurEvent:function(){
					var cur_ev = R$.reduce.RR_CUR_REPLAY_EVENT;
					if(cur_ev && cur_ev.id){
						return cur_ev;
					}
					
					return null;
				},
				getReduce:function(){
					return R$.reduce?R$.reduce:R$.reduce={store:[],events:{}};
				},
				initReplaySetup:function(){
					if(window.parent == window){
						rr.REPLAY_SETUP	= util.json.parseJson(util.cookie.getCookie(rr.constants.COOKIE_REPLAY_SETUP_KEY));
						rr.REPLAY_SETUP.SUBSET = JSON.parse(util.localStorage.getData(rr.constants.COOKIE_REPLAY_SETUP_KEY));
						if(rr.REPLAY_SETUP)
							rr.REPLAY_SETUP.REDUCEID = parseInt(rr.REPLAY_SETUP.BASE||0)+1;
					}
					if(!rr.REPLAY_SETUP || !rr.REPLAY_SETUP.RID){
						rr.REPLAY_SETUP = rr.config.testAnalysis;
						rr.REPLAY_SETUP.testEnabled = true;
						if(typeof QTest === 'object' && QTest.config){
							rr.REPLAY_SETUP = rr.common.util.extend(rr.REPLAY_SETUP,QTest.config);
						}
					}

				},
				getReplaySetup:function(){
					if(window.parent!=window){
						return window.parent.R$ && window.parent.R$.REPLAY_SETUP ? window.parent.R$.REPLAY_SETUP : {};
					}
					return rr.REPLAY_SETUP?rr.REPLAY_SETUP:{};
				},
				setErrorEvs:function(arrOrFile, L, H){
					if(arrOrFile instanceof R$.natives.Array){
						R$.reduce.errorEvs = arrOrFile;
					}else if(arguments.length>=3){
						R$.reduce.errorLoc = {
							file:arrOrFile,L:L,H:H
						};
					}
				}
			},
			json:{
				stringifyRecords:function(recordList){
					return recordList.join(RR_RECORD_SEPERATOR);
				},
				stringifyError:function(error){
					var list = ['name','message','lineNumber','desc'];
					var e = {};
					for(var j=0;j<list.length;j++){
						if(error && error[list[j]])
							e[list[j]] = error[list[j]];
					}
					return this.stringify(e);
				},
				stringifyWithFilter:function(obj,feilds){
					if(obj == null || obj == undefined){
						return null;
					}
					if(!feilds)
						return this.stringify(obj);
					if(typeof feilds == 'string'){
						feilds = [feilds];
					}
					var res = {};
					for(var i=0;i<feilds.length;i++){
						if(obj[feilds[i]] != null){
							res[feilds[i]] = obj[feilds[i]];
						}
					}
					return this.stringify(res);
				},
				stringify:function(str){
					var m ={
					        "\b": '\\b',
					        "\t": '\\t',
					        "\n": '\\n',
					        "\f": '\\f',
					        "\r": '\\r',
					        '"': '\\"',
					        "\\": '\\\\'
					    };
					var JSON = {
						    useHasOwn: ({}.hasOwnProperty ? true: false),
						    pad: function(n) {
						        return n < 10 ? "0" + n: n;
						    },
						    encodeString: function(s) {
						        if (/["\\\x00-\x1f]/.test(s)) {
						            return '"' + s.replace(/([\x00-\x1f\\"])/g,
						            function(a, b) {
						                var c = m[b];
						                if (c) {
						                    return c;
						                }
						                c = b.charCodeAt();
						                return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
						            }) + '"';
						        }
						        return '"' + s + '"';
						    },
						    encodeArray: function(o) {
						        var a = ["["],b, i, l = o.length,v;
						        for (i = 0; i < l; i += 1) {
						            v = o[i];
						            switch (typeof v) {
						            case "undefined":
						            case "function":
						            case "unknown":
						                break;
						            default:
						                if (b) {
						                    a.push(',');
						                }
						                a.push(v === null ? "null": this.encode(v));
						                b = true;
						            }
						        }
						        a.push("]");
						        return a.join("");
						    },
						    encodeDate: function(o) {
						        return '"' + o.getFullYear() + "-" + pad(o.getMonth() + 1) + "-" + pad(o.getDate()) + "T" + pad(o.getHours()) + ":" + pad(o.getMinutes()) + ":" + pad(o.getSeconds()) + '"';},
						    encode: function(o) {
						        if (typeof o == "undefined" || o === null) {
						            return "null";
						        } else if (o instanceof rr.natives.Array) {
						            return this.encodeArray(o);
						        } else if (o instanceof Date ||(rr.natives && rr.natives && rr.natives.Date && o instanceof rr.natives.Date)) {
						            return this.encodeDate(o);
						        } else if (typeof o == "string") {
						            return this.encodeString(o);
						        } else if (typeof o == "number") {
						            return isFinite(o) ? String(o) : "null";
						        } else if (typeof o == "boolean") {
						            return String(o);
						        } else {
						            var self = this;
						            var a = ["{"],b,i,v;
						            for (i in o) {
						                if (!this.useHasOwn || o.hasOwnProperty(i)) {
						                    v = o[i];
						                    switch (typeof v) {
						                    case "undefined":
						                    case "function":
						                    case "unknown":
						                        break;
						                    default:
						                        if (b) {
						                            a.push(',');
						                        }
						                        a.push(self.encode(i), ":", v === null ? "null": self.encode(v));
						                        b = true;
						                    }
						                }
						            }
						            a.push("}");
						            return a.join("");
						        }
						    },
						    decode: function(json) {
						        return eval("(" + json + ')');
						    }
						};
					return JSON.encode(str);
				},
				parseJson:function(recordParam){
					if(typeof recordParam=="object"){
						return recordParam;
					}
					try{
						var record = eval("("+recordParam+")");
					}catch(e){
					}
					for(var name in record){
						record[name] = (record[name]);
					}
					return record;
				},
				escape:function(str){
					str = str||"";
					return str.replace(/"/g,'$quot;').replace(/{/g,"$lbrk;").replace(/}/g,"$rbrk;").replace(/:/g,"$maohao;").replace(/,/g,"$douhao;").replace(/&/g,'$yu;');
				},
				unescape:function(str){
					str = str ||"";
					return str.replace(/$quot;/g,'"').replace(/$lbrk;/g,"{").replace(/$rbrk;/g,"}").replace(/$maohao;/g,":").replace(/$douhao;/g,",").replace('$yu;','&');
				}
			},
			http: {
				connect:function(options){
					var oAjax = new rr.natives.XMLHttpRequest();
					oAjax.open(options.method, options.url, options.async===false?false:true);
					oAjax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");    
					if(options.data){
						oAjax.send(options.data);
					}else{
						oAjax.send();
					}
					oAjax.onreadystatechange=function(){

					    if(oAjax.readyState==4){
					     
						 	if(oAjax.status==200){
								if(typeof options.done == "function"){
					        		options.done(oAjax);
								}
					        }else{
					            if(typeof options.fail == "function"){
					                options.fail(oAjax);
					                logger.log('[error...]failed to do ajax request,options:',options);
					            }
					        }
					    }
					};
					return oAjax;
				}
			},
			xpath:{
				selectViewNode: function(viewxpath){
					if(!viewxpath){
						return window;
					}
					var frm = viewxpath.split('#');
					var topview = window;
					if(frm[0]){
						var views  = this.selectNodes(topview,frm[0]); 
						if(views && views.length>0)
							topview = views[0];
					}
					return topview[frm[1]];
				},

				selectNodes : function(view,xpath) {
					//enable to parse window object and document object

					if(!view){
						view = window;
					}

					var aNodes = new rr.natives.Array();  
					if(xpath && XPATH_MAPPING.window == xpath){
						aNodes.push(view.window||view.contentWindow);
						return aNodes;
					}else if(xpath && XPATH_MAPPING.document == xpath){
						aNodes.push(view.document||view.contentDocument);
						return aNodes;
					}
					var doc = view.document||view.contentDocument;
				    var oXPathExpress = doc.createExpression(xpath, null);  
				    var oResult = oXPathExpress.evaluate(doc,  
				            XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);  
				    if (oResult != null) {  
				        var oElement = oResult.iterateNext();  
				        while (oElement) {  
				            aNodes.push(oElement);  
				            oElement = oResult.iterateNext();  
				        }  
				    }  
				    return aNodes;  
				}, 
				getViewXpath : function(view){

					if(view.parent != view){
						view.rr_view_prefix = this.getXpath(null, view.parent, view.parent.document.activeElement);	
					}
					var xpath =  view.rr_view_prefix || "";
					if(xpath && view instanceof view.Window){
						xpath += "#contentWindow";
					}else if(xpath && view instanceof view.Document){
						xpath += "#contentDocument";
					}else{
						if(view instanceof view.Window){
							xpath += "#window";
						}else if(view instanceof view.Document){
							xpath += "#document";
						}
					}
					return xpath;
				},
				getXpath : function(type,view,dom){
					  if(!view)
						  view = window;
					  if(type =='view'){
						 return this.getViewXpath(view);
					  }
					  if(dom instanceof view.Window){
						  return XPATH_MAPPING.window;
					  }else if(dom instanceof view.Document){
						  return XPATH_MAPPING.document;
					  }

					  var path = ""; 
					  var topE = dom;
				      for (; dom && dom.nodeType == 1; dom = dom.parentNode) {  
						topE = dom;
				        var index = 1;  
				        for (var sib = dom.previousSibling; sib; sib = sib.previousSibling) {  
				          if (sib.nodeType == 1 && sib.tagName == dom.tagName)  
				            index++;  
				          }  
				        var xname =  dom.tagName.toLowerCase();  
				        if (dom.id) {  
				          xname += "[@id='" + dom.id + "']";  
				        } else {  
				          if (index > 0)  
				            xname += "[" + index + "]";  
				        }  
				        path = "/" + xname + path;  
				      } 
				      return path.replace("html[1]/body[1]","html/body");  
				}
			}
	}

	var baseInput = {
			getValue:function(target){
				if(target.type === 'checkbox'){
					//return null;
					return target.checked;
				}
				if(target.type === 'textarea'){
					console.log(target.value);
				}

				return target.value;
			},
			setValue:function(target,value){
				if(target.type==='checkbox'){
				    //return;
					target.checked = value;
				}
				target.value = value;
			}
	}
	var textInput = {
		getValue:function(target){
			if(target) return target.innerText;
		},
		setValue:function(target,value){
			if(target) target.innerText = value;
		}
	}

	var inputElements ={
		'HTMLInputElement':baseInput,
		'HTMLTextAreaElement':baseInput,
		'HTMLSelectElement':baseInput
	}

	
	var instrument = {
			addLoggingListener:function(){

				function toArray(a){
					var res = [];
					for(var i=0;i<a.length;i++){
						res.push(a[i]);
					}
					return res;
				}
				//var fms = toArray(document.getElementsByTagName('iframe')).concat(toArray(document.getElementsByTagName('frame')));
				//logger.log('[capture event...] frames:',fms);
				for(i in rr.config.DOM_STD.EVENTS){
					var useCapture = true;
					if(i=='mousedown'){
						console.log('*****************logging mousemove');
					}
					if(i=='error'){
						useCapture = false;
					}
						
					window.addEventListener(i,new LogEventHandler(window).handle,useCapture);

				}

				//window.addEventListener('error',function(e){
				//	logger.log('+++++++++++++++++error:',e);
				//},true);

				
			},
			addReplayObserver:function(){
				for(i in rr.config.DOM_STD.EVENTS){
					var useCapture = true;
					if(i=='error'){
						useCapture = false;
					}
					
					window.addEventListener(i,ReplayObserveHandler,useCapture);

				}	
			},
			removeReplayObserver:function(){
				for(i in rr.config.DOM_STD.EVENTS){
					window.removeEventListener(i,ReplayObserveHandler);
				}
			}
			,
			replaceNative:function(){
				/*** Date and random***/
				rr.natives.addEventListener = Element.prototype.addEventListener;
				rr.natives.removeEventListener = Element.prototype.removeEventListener;
				/*
				var fields = ['getDate','getDay','getMonth','getFullYear','getYear','getHours','getMinutes','getSeconds','getMilliseconds','getTime','getTimezoneOffset','getUTCDate','getUTCDay','getUTCMonth','getUTCFullYear','getUTCHours','getUTCMinutes','getUTCSeconds','getUTCMilliseconds','parse','setDate','setMonth','setFullYear','setYear','setHours','setMinutes','setSeconds','setMilliseconds','setTime','setUTCDate','setUTCMonth','setUTCFullYear','setUTCHours','setUTCMinutes','setUTCSeconds','setUTCMilliseconds','toSource','toString','toTimeString','toDateString','toGMTString','toUTCString','toLocaleString','toLocaleTimeString','toLocaleDateString','UTC','valueOf'];
				
				Date = function(){
					this.__date = null;
					
					if(rr.RR_CTRL_PHASE == rr.constants.RR_CTRL_PHASE.RECORD){
						var s = [];
						for(var i=0;i<arguments.length;i++){
							s.push('arguments['+i+']');  
						};
						this.__date = eval("(new rr.natives.Date("+s.join(',')+"))");
						var nond = new EventRecord({type:'Date',rr_value:this.__date.getTime()});
						var rr_nonds = util.html.getRR_NONDS();
						rr_nonds.push(nond.toJSON());
					}else{
						var rr_nonds = util.html.getRR_NONDS();
						var time = rr_nonds.shift();
						var e = new ManualEvent(time);
						this.__date = new rr.natives.Date(parseInt(e.rr_value));
					}
				}
				
				for(var i=0;i<fields.length;i++){
						var field = fields[i];
						Date.prototype[field] = eval('(function(){return this.__date["'+field+'"].apply(this.__date,arguments);})');
				}

				*/


				/*
				RR_NATIVE_FUNC['Math.random'] = Math.random;
				Math.random = function(){
					var v = RR_NATIVE_FUNC['Math.random']();
					var e = {};
					e.type = 'random';
					e.rr_value = v;
					e.timeStamp = new RR_NATIVE_FUNC['Date']();
					//logger.log('==========wraped Math.random');
					//service.logEvent(e);
					return v;
				}
				RR_NATIVE_FUNC['setTimeout'] = setTimeout;
				temp = setTimeout;
				setTimeout = function(func,time){
					var res;
					//logger.log('====================wraped setTimeout');
					res = RR_NATIVE_FUNC['setTimeout'].apply(window,arguments);
					var e = {};
					e.type='setTimeout';
					e.rr_value = res;
					e.timeStamp = new RR_NATIVE_FUNC['Date']();
					//service.logEvent(e);
					return res;
				}*/
				/* alert  */
				window.alert = function(msg,duration)
				{
				     duration = duration || 100;
					 var alert_view = document.createElement("div");
					 alert_view.setAttribute("style","position:absolute;top:40%;left:20%;background-color:white;");
					 alert_view.innerHTML = msg;
					 setTimeout(function(){
					     alert_view.parentNode.removeChild(alert_view);
					 },duration);
				     document.body.appendChild(alert_view);
				}
				/** for dependency analyse **/
			
				rr.wraped_listeners = {};
				function registerListener(type,func,useCapture,_ctx){
						if(!func) return;
						//logger.log("=====compare:",func,rr.RR_LOGGING_HANDLER);
						var hs = _ctx['rr_eventHandlers'] || {};
						type = rr.config.DOM_STD.MAPPING[type] == undefined?type:rr.config.DOM_STD.MAPPING[type];
						var hsArr = hs[type]||[];
						
						if(typeof(func) === 'function' || typeof func.handleEvent === 'function'){ 
							//Actually, the native addEventListener API can accept a function or an object contains method 
							hsArr.push(func);
							hs[type] = hsArr;
							_ctx['rr_eventHandlers'] = hs;
							var cur_rcd = util.html.getCurEvent();
							if(util.mode.isEventDps() && cur_rcd){
								if(func.ignore !=true){
									var hid = J$.analysis.invoke('putField2',rr.dps.HANDLER,_ctx,null,func);
								}
								func[rr.dps.HANDLER] = hid; 
								//logger.log('[register EventListener]',hid,_ctx,type,[func]);
							}	
						}
				}
				rr.wraped_listeners.R_addEventListener = function(type,func,useCapture){
						var _ctx = this;
						if(typeof J$ === 'object'){
							if(typeof J$.getConcrete === 'function'){
								type = J$.getConcrete(type);
								useCapture = J$.getConcrete(useCapture);
							}
						}
						if(rr.config.DOM_STD.EVENTS[type]&& func && func != ReplayObserveHandler){
							registerListener(type,func,useCapture,_ctx);	
						}
						if(rr.dps && rr.dps.AnotatedValue)
							rr.dps.AnotatedValue.isHandler(typeof func == 'function'?func:func.handleEvent,true);
						rr.natives.addEventListener.apply(_ctx,[type,func,useCapture]);
				}
				rr.wraped_listeners.R_registerDom0Listener = registerListener;
				
				function unregisterListener(type,func,_ctx){
					var cur_rcd = util.html.getCurEvent();
					type = rr.config.DOM_STD.MAPPING[type] == undefined?type:rr.config.DOM_STD.MAPPING[type];
					if(util.mode.isEventDps() && cur_rcd){
							var hs = _ctx['rr_eventHandlers'] || {};
							var hsArry = hs[type] || [];

							for(var i=0;i<hsArry.length;i++){
								if(hsArry[i]==func){
									hsArry.splice(i,1);
									var f_name = func[rr.dps.HANDLER];
									if(!f_name) continue;
									J$.analysis.invoke('putField',f_name,_ctx,null,null);
									return;
								}
							}
					}
				}
				rr.wraped_listeners.R_removeEventListener = function(type,func,useCapture){
						if(typeof J$ === 'object' && typeof J$.getConcrete === 'function'){
							type = J$.getConcrete(type);
							useCapture = J$.getConcrete(useCapture);
						}
						var _ctx = this;
						unregisterListener(type,func,_ctx);
						rr.natives.removeEventListener.apply(_ctx,[type,func,useCapture]);
				}
				rr.wraped_listeners.R_unregisterDom0Listener= unregisterListener;
				rr.wraped_listeners.R_getEventListener = function(type){
						var _ctx = this;
						type = rr.config.DOM_STD.MAPPING[type] == undefined?type:rr.config.DOM_STD.MAPPING[type];
						var hs = _ctx['rr_eventHandlers'] ||{};
						var res = (hs[type]||[]);
						return res;
				}
				if(rr.REPLAY_SETUP && rr.REPLAY_SETUP.REDUCE){
					Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener= rr.wraped_listeners.R_addEventListener;
					Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = rr.wraped_listeners.R_removeEventListener;
					Window.prototype.getEventListeners = Document.prototype.getEventListeners = Element.prototype.getEventListeners = rr.wraped_listeners.R_getEventListener;
				}
				
			},
			activations:{
				basicInput:function(e,target){
					util.html.setCurEvent(e);
					if(rr.RR_CTRL_PHASE == rr.constants.RR_CTRL_PHASE.REPLAY){
						var rv= e.rr_value;
						for(var i in inputElements){
							if(target instanceof e.view[i] && rv  != null){
								inputElements[i].setValue(target,rv);
								if(util.mode.isEventDps()){
									J$.analysis.invoke('putField2',rr.dps.INPUT,target,'value',rv);
								}
								return;
							}
						}
						if(rv){
							textInput.setValue(target,rv);	
							if(util.mode.isEventDps()){
								J$.analysis.invoke('putField2',rr.dps.INPUT,target,'innerText',rv);
							}
						}
					}else{
						if(e.type == 'keydown'){
							//rr.RECENT_KEY_EVENT = e;
							//return;
						}else if(e.type=='input'){

							for(var i in inputElements){
								if(target instanceof e.view[i]){
									var v = inputElements[i].getValue(target);
									if(v){
										e.rr_value = v;
										//rr.RECENT_KEY_EVENT.rr_value = v;
									}
									return;
								}
							}
							var v = textInput.getValue(target);
							if(v){
								e.rr_value = v;
								//rr.RECENT_KEY_EVENT.rr_value = v;
							}
						}

					}	
		
				},
				form:{
					/**
					 * @param e eventRecord or manualEvent
					 */
					"keydown":function(e,target){
						//console.log('-------------->keydown');
						//instrument.activations.basicInput(e,target);
					},
					"input":function(e,target){
						instrument.activations.basicInput(e,target);
					},
					"click":function(e,target){
						target.focus();
						if(target.type === 'checkbox')
							this.input(e,target);
					},
					"rr_end":function(e){ 
						rr.REPLAY_STATE= 'end';
						try{ 
							if(e.condition){ 
								var res = R$.callDone(); 
								if(res.error && res.error.length>0){
									logger.log('Failed to reproduce the error. exception:',res.error);
									alert('Failed');
									J$.analysis.invoke('sendFailed');
									return;
								}
								util.html.setCurEvent(e)

							}
							
							console.debug(rr.REPLAY_SETUP.POLICY);
							//if(rr.REPLAY_SETUP.POLICY == 'DELTA'){
								//alert('replay end!');
								rr.RR_CUR_TIME_END = new Date().getTime();
								rr.RR_CUR_RESULTVIEW = document.createElement('div');
								document.body.appendChild(rr.RR_CUR_RESULTVIEW);
								rr.RR_CUR_RESULTVIEW.style = "position:absolute; right:10px; top:10px; background:rgb(145,243,149);visibility:visible;";
								rr.RR_CUR_RESULTVIEW.id = 'result_'+rr.REPLAY_SETUP.RID;
								var len = rr.REPLAY_SETUP.SUBSET?rr.REPLAY_SETUP.SUBSET.length:rr.RR_CUR_REPLAY.length; 
								rr.RR_CUR_RESULTVIEW.innerHTML = '<div id="time">'+(rr.RR_CUR_TIME_END - rr.RR_CUR_TIME_BEGIN)+'</div>'
									+'<div id="length">'+len+'</div>';
							//}
							
							if(util.mode.isEventDps()){	
								J$.analysis.invoke('endExecution');
							}							
							if(rr.reduce.store && rr.reduce.store.length>0){		
								service.api.sendReduce(rr.REPLAY_SETUP,rr.reduce.store,function(){
								});
							}
							instrument.removeReplayObserver();
						}catch(e){
							logger.log('##rr_end error:',e);
						}
					}
					
				}
			}
	}
	var service = {
			getEnv:function(){
				var env = {};
				//used to setup environment
				env['type'] = RR_COMSTERMIZE_EVENTS.ENV;
				env['document.cookie'] = document.cookie;
				env['window.localStorage'] = window.localStorage;
				env['window.sessionStorage'] = window.sessionStorage;
				env['window.location.href'] = window.location.href;
				env['window.navigator.userAgent'] = window.navigator.userAgent;
				return env;
			},
			setupEnv:function(env){
				var e = env.env;
						function resetCookie(){
							util.cookie.clearCookies();
							
							var cookies = (e['document.cookie']||"").split(';');
							for(var i=0;i<cookies.length;i++){
								if(cookies[i].indexOf(rr.constants.COOKIE_DATA_PREFIX)>0){
									continue;
								}
								document.cookie = cookies[i];
							}
						}
						
						function resetLocalStorage(){
							util.localStorage.clearData();
							
							var dataset = e['window.localStorage'];
							for(var key in dataset){
								util.localStorage.setData(key,dataset[key]);
							}
							
						}
						
						function resetSessionStorage(){
							util.sessionStorage.clearData();
							
							var dataset = e['window.sessionStorage'];
							for(var key in dataset){
								util.sessionStorage.setData(key,dataset[key]);
							}				
						}
						
						resetCookie();
						resetLocalStorage();
						resetSessionStorage();
						logger.log('setupenv:',env);
						
						util.cookie.setCookie(rr.constants.COOKIE_REPLAY_SETUP_KEY,util.json.stringify(env.setup));
						util.localStorage.setData(rr.constants.COOKIE_REPLAY_SETUP_KEY,util.json.stringify(env.SUBSET));
						console.debug('Replaying:'+e['window.location.href']);
						window.location.href = e['window.location.href'];
			},
			/**
			 * set a new sid if not exist && default state is record
			 */
			setReplayId:function(sid){
				util.cookie.setCookie(COOKIE_REPLAY_KEY,sid);
			},
			deleteReplayId:function(){
				util.cookie.delCookie(COOKIE_REPLAY_KEY);
			},
			/*set a new sid*/
			getSID:function(){
				if(!rr.RECORD_SESSION_ID){
					rr.RECORD_SESSION_ID = util.UUID.genUUID();
				}
				//logger.log('===========reset id',rr.RECORD_SESSION_ID);
				return rr.RECORD_SESSION_ID;	
			},
			//for record phase
			initClientState:function(){
				rr.util.html.getReduce();
				var phase = rr.RR_CTRL_PHASE;
				if(phase == rr.constants.RR_CTRL_PHASE.RECORD){
					util.html.initRR_LOG();
					rr.RR_ENV = util.json.stringify(service.getEnv());
					//this.resetSID();
					logger.log('[record setup...] RR_LOG=[], SID',rr.service.getSID());
				}else{
					util.html.initReplaySetup();
					rr.REPLAY_SETUP = util.html.getReplaySetup();
					logger.log('[replay setup...]', rr.REPLAY_SETUP);
				}
			},
			refactorInterval:function(orgIntv){
				orgIntv = orgIntv||0;
				if(!rr.REPLAY_SETUP.REDUCE || rr.REPLAY_SETUP.REDUCEID == constants.REDUCE_NOHANDLERS || orgIntv<=0)
					return orgIntv || 1;
				return orgIntv<10?50:orgIntv+100;
			},
			executeSubset:function(){
				var subset = rr.REPLAY_SETUP.SUBSET;
				subset.push(rr.RR_CUR_REPLAY.length);
				var timeout=0;
				for(var i=0;i<subset.length;i++){
					var curRecord = JSON.parse(rr.RR_CUR_REPLAY[subset[i]-1]);
					curRecord.seqid = subset[i];
					timeout += rr.service.refactorInterval(curRecord.intv);
					setTimeout(rr.service.replayEvent,timeout,curRecord,i+1,subset.length);
				}
				
			},
			//jumpto: to execut event sequence [from, to], from and to is the sequence id( 1<=1id<=rr.RR_CUR_REPLAY.length) of  the record
			//for example:
			//	execute(2,5): replay events 2,3,4,5
			//	execute(5): replay event 5
			//	execute(): replay all events, [1,rr.RR_CUR_REPLAY.length]
			execute:function(fromIdx, toIdx){
				if(arguments.length==0){
					fromIdx = 1; toIdx = rr.RR_CUR_REPLAY.length;
				}else if(arguments.length==1){
					toIdx = fromIdx;
				}
				var timeout = 0;
				var curRecord;
				for(var i=fromIdx;i<=toIdx;i++){ 
					var rcd = rr.RR_CUR_REPLAY[i-1] = util.json.parseJson(rr.RR_CUR_REPLAY[i-1]);
					rcd.seqid = i;
					timeout += rr.service.refactorInterval(rcd.intv);
					setTimeout(rr.service.replayEvent,timeout,rcd,i,rr.RR_CUR_REPLAY.length);
				}
			},
			//replay mode
			initReplay:function(){
				if(util.mode.isEventDps()){
					rr.ddg = new rr.dps.DependencyGraph(rr.dps.mode[rr.REPLAY_SETUP.POLICY]);
					if(rr.REPLAY_SETUP.POLICY == 'WEAK')	
						J$.analysis = new rr.dps.ChainedAnalysis(new rr.dps.EventDependencyEngine(), new rr.dps.WeakAnalysis());
					else
						J$.analysis = new rr.dps.EventDependencyEngine();
					J$.analysis.invoke('init');
				}	

				//only initialize in the top frame
				if(window.parent != window){
					return;
				}

				//1. test mode, need to manually set event id using rr.util.html.setCurEvent in the src code.
				if(rr.REPLAY_SETUP.testEnabled && util.mode.isEventDps()){
					util.html.setCurEvent({id:1});	
					window.addEventListener('load', function(){
						instrument.addReplayObserver();
					});
					return;
				}
				
				//2. automatically replay by downloading an event trace.
				//mode: RUN, automatically execute the whole trace
				//mode: DEBUG, can use step, execute.. commands to control the execution
				var sid = rr.REPLAY_SETUP.RID;
				var mode = rr.REPLAY_SETUP.MODE;
				var base = rr.REPLAY_SETUP.BASE;
				var reduce = rr.REPLAY_SETUP.REDUCE;
				var reduceid = rr.REPLAY_SETUP.REDUCEID;
				var subset = rr.REPLAY_SETUP.SUBSET;
				var __self = this;
				var req = __self.api.loadNond(sid);
				console.log(subset, rr.REPLAY_SETUP);
				(function(req){
					var nondstr = req.responseText||'';	
					rr.RR_NONDS = nondstr.split(RR_RECORD_SEPERATOR);
					logger.log('[#load nonds ok...]',rr.RR_NONDS);
				})(req);
				
				function onLoadAction(){
					var req = __self.api.loadLog(rr.REPLAY_SETUP);
					
					(function(req){
						var logString = req.responseText||''; 
						rr.RR_CUR_REPLAY = logString.split(RR_RECORD_SEPERATOR);
						logger.log('[#load log ok...] start to replay. sid:'+sid
								+',mode:'+mode+',events:'+rr.RR_CUR_REPLAY.length,',setup:',rr.REPLAY_SETUP);
						if(util.mode.isEventDps()){
							instrument.addReplayObserver();
						}
						if(mode == rr.constants.RR_REPLAY_MODE.RUN){
							rr.RR_CUR_TIME_BEGIN = new Date().getTime();
							console.debug('RR_CUR_TIME_BEGIN:',rr.RR_CUR_TIME_BEGIN);
							if(rr.REPLAY_SETUP.POLICY == 'DELTA')
								rr.service.executeSubset();
							else
								rr.service.execute();	
						}else{
							R$.command.help();
							R$.command.timing.begin();
						}
						if(reduce){
							rr.reduce.ENDE= util.json.parseJson(rr.RR_CUR_REPLAY[rr.RR_CUR_REPLAY.length-1]);
							if(util.mode.isEventDps()){
								if( rr.reduce.ENDE&&rr.reduce.ENDE.eid>0){
									rr.reduce.errorEvs = [rr.reduce.ENDE.eid];
								}else{
									var defaultErrorEnv = util.json.parseJson(rr.RR_CUR_REPLAY[rr.RR_CUR_REPLAY.length-2])||{};

									rr.reduce.errorEvs = [defaultErrorEnv.id];
								}
								logger.log('[init errorid...]',rr.reduce.errorEvs);
							}
						}
					})(req);
	
					util.cookie.delCookie(rr.constants.COOKIE_REPLAY_SETUP_KEY);
				}
				onLoadAction.ignore = true;
				window.addEventListener('load', onLoadAction);
			},
			/**
			 * to log a event
			 * @param e an real event happened in the browser
			 */
			logEvent:function(e){
				if(rr.config.DOM_STD.SWITCH[e.type] == false){
					return;
				}
				if(RR_LAST_TIMESTAMP>0)
					e.intv = Math.ceil(e.timeStamp - RR_LAST_TIMESTAMP);
				else
					e.intv = 0;
				RR_LAST_TIMESTAMP = e.timeStamp;

				var record = new EventRecord(e);

				if(typeof instrument.activations.form[e.type] == 'function'){
					instrument.activations.form[e.type](e,e.target);
					record.rr_value = e.rr_value;
				}
				if(e.type == "error"){
					if(ui.autoSendLog(e)){
						return;
					}
				}
				/*
				if(e.type=='input'){
					var prv = JSON.parse(rr.RR_LOG[rr.RECENT_KEY_EVENT.id-1]);
					prv.rr_value = e.rr_value;
					rr.RR_LOG[rr.RECENT_KEY_EVENT.id-1] = new EventRecord(rr.RECENT_KEY_EVENT).toJSON();
				}*/
				
				//press alt+shift+t to send log
				if(e.type == "keydown" && e.altKey && e.shiftKey && e.keyCode == 84){
					if(ui.confirmSendLog()){
						return;
					}
					
				}
				e.id=record.id = util.html.incRR_CID();
				util.html.getRR_LOG().push(record.toJSON());
				
				logger.log('[#logEvent:'+util.html.getRR_LOG().length+']['+e.type+']',record.timeStamp,record);
			},
			/**
			 * replay an event
			 * @param record(String) a record retrieved from the log file
			 */
			replayEvent:function(record,step, total){
				var me = new ManualEvent(record);
				
				if(me && !me.target){
					return;
				}

				if(EVENT_PLAY_IGNORE[me.type]){
					logger.log('[ignore replayEvent] record:',record);
					return;
				}
				logger.log('[#replayEvent:'+(me.id||"")+':'+me.type+']','step:'+(step)+"/"+(total)+'\n',me);
				var etype = rr.config.DOM_STD.EVENTS[me.type];

				//trigger defaut activity
				if(typeof instrument.activations.form[me.type] == "function"){
					instrument.activations.form[me.type](me,me.target);
				}		


				if(etype){
					/**
					 * begin
					 */
					var doc = me.view.document || me.view.contentDocument;
					switch(etype){
						case "KeyboardEvent":
							var ev = doc.createEvent(etype);
							Object.defineProperty(ev, 'keyCode', {
								 get : function() {
									 return this.keyCodeVal;
								 }
							});
							Object.defineProperty(ev, 'which', {
								get : function() {
									return this.keyCodeVal;
								}
							});
							ev.keyCodeVal = me.keyCode;
							ev.initKeyboardEvent(me.type,me.bubbles,me.cancelable,me.view,
									me.detail,me.keyCode,me.location,me.modifiersList,me.repeat);
							break;
						case "WheelEvent":
							var ev = new WheelEvent("mousewheel",{bubbles:me.bubbles,cancelable:me.cancelable,view:me.view,detail:me.detail,screenX:me.screenX,screenY:me.screenY,clientX:me.clientX,clientY:me.clientY,button:me.button,relatedTarget:me.relatedTarget,modifiersList:me.modifiersList,deltaX:me.deltaX,deltaY:me.deltaY,deltaZ:me.deltaZ,deltaMode:me.deltaMode});
							//var ev = doc.createEvent(etype);
							//ev.initWheelEvent(me.type,me.bubbles,me.cancelable,me.view,
							//		me.detail,me.screenX,me.screenY,me.clientX,me.clientY,
							//		me.button,me.relatedTarget,me.modifiersList,me.deltaX,
							//		me.deltaY,me.deltaZ,me.deltaMode);
							break;
						case "MouseEvent":
							var ev = doc.createEvent('MouseEvent');
							ev.initMouseEvent(me.type,me.bubbles,me.cancelable,me.view,
									me.detail,me.screenX,me.screenY,me.clientX,me.clientY,
									me.ctrlKey,me.altKey,me.shiftKey,me.metaKey,me.button,me.relatedTarget);
							break;
						case "FocusEvent":
						case "UIEvent":
							var ev = doc.createEvent('UIEvent');
							ev.initUIEvent(me.type,me.bubbles,me.cancelable,me.view
									,me.detail);
							break;
							
						default:
							var ev = doc.createEvent('Event');
							ev.initEvent(me.type,me.bubbles,me.cancelable);
						
					
					}
					if(rr.REPLAY_SETUP && rr.REPLAY_SETUP.REDUCE){
						ev.xpath = util.xpath.getXpath(null,me.view,me.target);
						ev.id = me.id;
						rr.reduce.events[ev.id] = ev;
						if(me.rr_value) ev.rr_value = me.rr_value;	

						//no handlers check:	
						if(rr.REPLAY_SETUP.REDUCEID == constants.REDUCE_NOHANDLERS && me.target){
							var ele = me.target;
							var len = 0;
							
							while(ele != null){
								if(typeof ele.getEventListeners == "function" ){
									var ls = ele.getEventListeners(me.type);
									if(ls.length>0){
										break;
									}
								}
								ele = ele.parentNode;
							}
							if(!ele){
								if(me.view.getEventListeners(me.type).length>0){
									ele = me.view;
								}
							}

							if(ele || me.type =='input' || me.type=='click'){
								rr.reduce.store =  rr.reduce.store|| [];
								rr.reduce.store.push(me.id);
								//logger.log('#handlers:',me.type,me.target,ls);
							}else{
								//logger.log('#no handlers: skip.',me.target);
								return;
							}
						}
					}
					var st = me.target.dispatchEvent(ev);
					
					//console.log('##dispatch event',me,ev);
					//if(!st)
					//	console.log('ERROR: event is not dispatched!',ev);
					/************** end **********************
					 *  or use jquery $(me.target)[me.type](); 
					 ****************************************/
					
				}else if(etype !='rr_end'){
					//console.log('[ERROR] invalid event type, ignore event',me);
				}


				
			},
			analyse:{
				calDependentEvent_old:function(){
					var res = J$.analysis.getEventDependency(rr.reduce.errorEvs);
					rr.reduce.store = [];
					for(var i in res){
						rr.reduce.store.push(i);
					}
				}
				/*,
				calDependentEvents:function(){
					var options = {
						done:function(){
							logger.log('analyse success');
						},
						fail:function(){
							logger.log('anlyse failed');
						}
					}
					J$.analysis.startAnalyze(options);
					
				},
				*/
			}
			,
			api:{
				sendLog:function(sid,log,callback){
					var options = {};
					options.url = LOG_SERVICE;
					options.method = 'post';
				
					if(!sid){
						sid = rr.service.getSID();
					}
					var error = rr.RR_ERROR;
					if(!log){
						log = util.html.getRR_LOG();
						
					}
					options.data = 'log='+util.json.stringifyRecords(log)+"&sid="
						+ sid+"&env="+rr.RR_ENV+"&error="+util.json.stringifyError(error)+"&nonds="+util.json.stringifyRecords(rr.RR_NONDS)+'&host='+window.location.host+";"+window.location.href;
					logger.log('[#sending log...] sid:',sid);
					//logger.log(log);
					options.done = function(req){
						alert('send log ok! sid:'+ sid);
						if(typeof callback == "function"){
							callback(req);
						}
					}
					util.http.connect(options);
				},
				sendAnalyse:function(sid,content,callback){
					var options = {};
					options.url = FILE_SERVICE;
					options.method = 'post';
					options.data = 'filename='+sid+'.tmp&content='+(content||'');
					options.done = function(req){
						callback(req,true);
					}
					options.fail = function(req){
						callback(req,false);
					}
					return util.http.connect(options);
				},
				loadLog:function(setup,callback){
					var options = {};
					options.url = LOG_SERVICE+"?sid="+setup.RID+"&reduceid="+setup.BASE;
					options.method = 'get';
					options.async = false;
					options.done = callback;
					return util.http.connect(options);
				},
				loadNond:function(sid,callback){
					var options = {};
					options.url = FILE_SERVICE+"?filename="+sid+".nond";
					options.method = 'get';
					options.async=false;
					options.done = callback;
					return util.http.connect(options);
					
				},
				loadEnv:function(sid,callback){
					var options = {};
					options.url = FILE_SERVICE+"?filename="+sid+".env";
					options.method = 'get';
					options.done = callback;
					return util.http.connect(options);
				},
				sendReduce:function(setup,log,callback){
					var options = {};
					options.url = LOG_SERVICE;
					options.method = 'post';
					logger.log('[#send reduce...]',setup,log);

					options.data = 'log='+util.json.stringifyRecords(log||[])+"&sid="
						+ setup.RID + "&reduceid=" + setup.REDUCEID;
					options.done = function(req){
						alert('send reduced log trace ok! sid:'+ setup.RID);
						if(typeof callback == "function"){
							callback();
						}
					}
					util.http.connect(options);
				}
			}
	}
	function LogEventHandler(view){
		this.__view = view || window;
		var self = this;
		this.handle = function(e){
			if(!e.view){
				e.view = self.__view;
			}
			if(e.type == "error"){
				e.eid = util.html.getRR_CID();
			}
			service.logEvent(e);
		}
	}
	function ReplayObserveHandler(e){
		util.html.setCurEvent(e);
		/*
		if(e.id){
			if(R$.reduce.errorEvs && e.id == R$.reduce.errorEvs[0]){
				console.log('[before error event...]',e.id);
				util.html.setCurEvent({id:'assert'})
				eval(rr.reduce.ENDE.condition);
				var res = R$.callBefore();
				if(res.error && res.error.length>0){
					logger.log('[***Waring***] Error occurs in the before statements');	
				}
			}
		}*/
	}
	ReplayObserveHandler.ignore = true;
	//var RR_LOGGING_HANDLER = function(e){
	//	service.logEvent(e);
	//}
	/** ui */
	var ui = {
			execute:function(e){
				logger.log(e);
				var command = this.div.getElementsByClassName('command')[0].value;
				this.div.getElementsByClassName('command')[0].value='';
				eval(command);
			},
			createCtrlPanel:function(){
				var panelHtml = '<div><textarea style="width:100%;height:130px" class="command"></textarea><div>\
								<div><button style="width:100%" onclick="ui.execute(this)">execute</button></div>';
				this.div = document.createElement('div');
				this.div.setAttribute('class','RR_PANEL');
				this.div.setAttribute('style','width:250px;height:150px;position:fixed;top:0;right:0;');
				this.div.innerHTML = panelHtml;
				document.body.appendChild(this.div);
				
			},
			autoSendLog:function(e){
				/*
				if(confirm("Error:"+(e.name||"")+" "+(e.message||"")+"! send bug report?")){
					e.desc = "unsurpported yet!";
					e = new EventRecord(e);
					var rr_log = util.html.getRR_LOG();
					rr_log.splice(e.eid);
					rr_log.push(e.toJSON());
					service.api.sendLog(null,rr_log);
					return true;
				}
				return false;	
				*/
			},
			confirmSendLog:function(){
				var e = {};
				e.name = "manual";
				e.message = "manually send bug report";
				if(confirm("send bug report?")){
					e.desc = "unsurpported yet!";
					rr.RR_ERROR = util.json.stringifyError(e);
					command.record.sendLog();
					return true;
				}
				return false;
			}
	}
	
	
	/**
	 *  use logger to execute task:
	 *  	command.record.restartRecord();//创建session，重新开启记录
	 *  	command.record.sendLog();//发送当前session记录脚本
	 *  	command.replay.replay(sid,mode); // 设置重放,默认为单步调试
	 *  	command.replay.replayLatest(mode); // 重放最近一次记录,默认为单步调试
	 *   
	 */
	var command = {
			help:function(){
				console.log('********* execute manually ************');
				console.log('Usage: (Note that the params are seqid, not event id)\n'
						+'	R$.command.debug.seqid(eid)\n'
						+'	R$.command.debug.seqid(eid)\n'
						+'	R$.command.debug.list(seqid)\n'
						+'	R$.command.debug.step(seqid)\n'
						+'	R$.command.debug.execute(from,to)\n'
						+'	R$.command.timing.begin()\n'
						+'	R$.command.timing.end()\n');
			},
			record:{
				restart:function(){
					//service.resetSID();
					util.html.refresh();
				},
				sendLog:function(){
					var ts = util.getEventTimeStamp();
					var r = new EventRecord({id:util.html.getRR_CID(),type:'rr_end',timeStamp:ts,intv:ts-RR_LAST_TIMESTAMP});
					var rr_log = util.html.getRR_LOG();
					rr_log.push(r.toJSON());
					service.api.sendLog(null,rr_log);
					
				}
			},
			debug:{
				step:function(seqid){
					rr.service.execute(seqid, seqid);
				},
				execute:function(){
					rr.service.execute.apply(this,arguments);
				},
				seqid:function(eid){
					var mps = this.list();
					return mps[eid];
				},
				list:function(){
					if(this.mappings)
						return this.mappings;
					this.mappings = {};
					for(var i=1;i<rr.RR_CUR_REPLAY.length;i++){
						var rcd = rr.util.json.parseJson(rr.RR_CUR_REPLAY[i-1]);
						this.mappings[rcd.id] = i; 
					}
					return this.mappings;	
				}
			},
			timing:{
				intv:function(intv){
					if(!this.intvs)
						this.intvs = [];
					this.intvs.push(intv);
				},
				begin:function(){
					this.curBegin = new Date().getTime();
					console.debug('interval begin:',this.curBegin);
					return this.curBegin;
				},
				end:function(){
					var newIntv = {};
					newIntv.b = this.curBegin;
					newIntv.e = new Date().getTime();
					newIntv.ms = newIntv.e - newIntv.b;
					this.intv(newIntv);

					if(!this.totalMs)
						this.totalMs = 0;
					this.totalMs += newIntv.ms;
					console.debug('interval end:', newIntv.e);
					console.debug('interval time (ms):', newIntv.ms);
					console.debug('total time (ms):', this.totalMs);
				},
				total:function(){
					console.log('intervals:',this.intvs);
					return this.totalMs;
				}
			},
			replay:{
				
				replay:function(sid,mode,reduce,base,policy,subset){
					function setup(sid,mode,reduce,base,policy,subset){
						service.api.loadEnv(sid,function(req){
							var envString = req.responseText||'';
							var REPLAY_SETUP = {RID:sid,REDUCE:reduce,MODE:mode,BASE:base,POLICY:policy};

							var env ={ setup:REPLAY_SETUP,env:util.json.parseJson(envString)};
							if(!env.env){
								console.log('[Warning] Faild to load envrionment');
								env.env={};
							}
							if(policy == 'DELTA'){
								env.SUBSET = eval(subset);
							}
							logger.log('[env] load and setup envrionment:',env);

							service.setupEnv(env);
						});
	
					}
					setup(sid,mode,reduce,base,policy,subset);
				},
				// 'STEP' || 'RUN'
				replayLatest:function(mode){
					var sid = service.getSID();
					if(!sid){
						alert("没有最近一次的记录信息");
						return;
					};
					this.replay(sid, mode);
				}
			},
			printLog:function(){
				if(!rr.RR_LOG){
					logger.log("[error] there is no log yet!");
				}
				for(var i=0;i<rr.RR_LOG.length;i++){
					logger.log('[record]'+rr.RR_LOG[i].type,rr.RR_LOG[i]);
				}
			}
	}

	rr.util = util;
	rr.instrument = instrument;
	rr.service = service;
	rr.command = command;
	rr.ui = ui;
	setErrors = rr.setErrors = util.html.setErrorEvs;
})(R$);

