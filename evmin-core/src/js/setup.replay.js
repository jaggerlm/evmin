if(typeof R$ == "undefined"){
	R$ = {};

}
(function(rr){
	var init = function(){
		if(rr.inited){
			return;
		}
		rr.inited = true;
		rr.RR_CTRL_PHASE = rr.constants.RR_CTRL_PHASE.REPLAY;

		rr.service.initClientState();
		rr.instrument.replaceNative();
		rr.service.initReplay();
	}
	init();

})(R$);
	
