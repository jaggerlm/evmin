//Record phase
(function(rr){
	var init = function(){
		if(rr.inited){
			return;
		}
		rr.inited = true;
		rr.RR_CTRL_PHASE = rr.constants.RR_CTRL_PHASE.RECORD;
		
		rr.service.initClientState();
		rr.instrument.replaceNative();
		rr.util.html.domReady(document,function(){
			rr.instrument.addLoggingListener();
		});
	}
	init();
})(R$);
