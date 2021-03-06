if(typeof R$ == 'undefined'){ R$ = {};}
if(typeof J$ == 'undefined'){ J$ = {};}

(function(sandbox){
	if(!sandbox.config){
		sandbox.config = {};
	}
	var config = sandbox.config;

	//services
	config.rr_server_port = 8080;
	
	//test cases server
	config.test_server_port = 8081; 

	//mugshot record proxy
	config.record_port = 8001;

	//analysis record proxy
	config.analyse_port = 8501;

	//use socket to upload analysis middle values
	config.rr_socket_port = 3000;
	config.rr_socket_bufLimit = 3000;

	var serverIp = '192.168.137.2';
	config.rr_server = serverIp + ':'+config.rr_server_port;
	config.rr_socket_server = serverIp + ':'+ config.rr_socket_port;
	
	config.record_separator =';;;';

	//max log size to upload
	config.MAX_LOG_SIZE = '500mb';
	
	config.logService = 'http://'+config.rr_server + '/service/log';
	config.fileService = 'http://'+config.rr_server + '/service/file';
	config.analyseService = 'http://'+config.rr_server + '/service/analyse';
	
	//is enable log
	config.enables = {
		qtest:true,
		useShadow:true,
		dpsDetail:true // whether to print dependence detail to file
	}
	config.testAnalysis = {
		RID:'test_'+new Date().getTime(),
		MODE:'REPLAY',
		REDUCE:true,
		REDUCEID:2,
		POLICY:'DATA',
		Dir:'qunit_test'
	}
	config.headers={
		'X-RR-SID':'x-rr-sid'
	}

	var natives = sandbox.natives = sandbox.natives||{};
	if(typeof XMLHttpRequest == 'function')
		natives.XMLHttpRequest = XMLHttpRequest;
	if(typeof window === 'object'){
		sandbox.global = window;
	}
	natives.RegExp = RegExp;
	natives.Date = Date;
	natives.Array = Array;
	natives.String = String;
	natives.Number = Number;
	natives.Function = Function;
	natives.Boolean = Boolean;
	natives.Object = Object;
	
	if(typeof Event == 'function')
		natives.Event = Event;
	if(typeof Node == 'function')
		natives.Node = Node;
	natives.console = console;
	natives.parseInt = parseInt;
	natives.parseFloat = parseFloat;


	/**
	 * Events to log
	 */
	config.DOM_STD = {
		EVENTS:{
			 "abort":"Event", 
			 "beforeinput":"InputEvent",
			 "blur":"FocusEvent",
			 "click":"MouseEvent",
			 "compositionstart":"CompositionEvent",
			 "compositionupdate":"CompositionEvent",
			 "compositionend":"CompositionEvent",
			 "dblclick":"MouseEvent",
			 "error":"Event",
			 "focus":"FocusEvent",
			 "focusin":"FocusEvent",
			 "focusout":"FocusEvent",
			 "input":"Event",
			 "keydown":"KeyboardEvent",
			 "keyup":"KeyboardEvent",
			 "load":"Event",
			 "mousedown":"MouseEvent",
			 "mouseenter":"MouseEvent",
			 "mouseleave":"MouseEvent",
			 "mousemove":"MouseEvent",
			 "mouseout":"MouseEvent",
			 "mouseover":"MouseEvent",
			 "mouseup":"MouseEvent",
	         "resize":"UIEvent",
	         "scroll":"UIEvent",
	         "select":"Event",
	         "unload":"Event",
	         "wheel":"WheelEvent",
	         "mousewheel":"WheelEvent", 
			 //***legacy or removed by dom3
	         "keypress":"KeyboardEvent",
	 		 "change":"HTMLEvents",
	 		 "reset":"HTMLEvents",
	 		 "submit":"HTMLEvents"


		},
		MAPPING:{
			'mousewheel':'wheel'
		},
		MUTATIONS:[
		     'DOMSubtreeModified',
		     /*'DOMNodeInserted',
		     'DOMNodeRemoved',
		     'DOMNodeRemovedFromDocument',
		     'DOMNodeInsertedIntoDocument',
		     'DOMAttrModified',
		     'DOMCharacterDataModified',*/
		     'rr_mutations'
		],
		//event with value false will not be logged
		SWITCH:{
			'mousemove':true,'mouseout':true,'mouseover':true
		},
		//event attributes to record
		EVENT_RECORD_FEILDS:[
		                     'altKey',
		                     'button',
		                     'bubbles',
		                     'cancelable',
		                     'clientX',
		                     'clientY',
		                     'ctrlKey',
							 'metaKey',
		                     'detail',
		                     'deltaX',
		                     'deltaY',
		                     'deltaZ',
		                     'deltaMode',
		                     'keyCode',
		                     'location',
		                     'metaKey',
							 'keyIdentifier',
		                     'modifiersList',
		                     'relatedTarget',
		                     'repeat',
		                     'screenX',
		                     'screenY',
		                     'shiftKey',
		                     'target',
		                     'timeStamp',
		                     'type',
		                     'which',
							 'clipboardData',
		                     "rr_value",
							 "id",
							 "intv"
		                     ]
		,
		//event attributes need to be recored as xpath value
		EVENT_RECORD_XPATH:['target','relatedTarget','view']
		
	
	};
	
	config.DOM0_STD = {};
	for(var i in config.DOM_STD.EVENTS){
		config.DOM0_STD['on'+i] = true;
	}
	if (typeof module == 'object' && typeof exports == 'object'){
		exports.config = config;
	}
})(R$);

