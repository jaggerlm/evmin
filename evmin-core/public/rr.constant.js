if(typeof R$ == "undefined"){
	R$ = {};
}

(function(rr){
	var constants = rr.constants = {};
	constants.RR_CTRL_PHASE = {RECORD:'RECORD',REPLAY:'REPLAY'};
	constants.RR_REPLAY_MODE = {STEP:"STEP",RUN:"RUN"};
	constants.COOKIE_DATA_PREFIX = "cn.ac.iscas";
	constants.COOKIE_REPLAY_SETUP_KEY = constants.COOKIE_DATA_PREFIX +".RR_REPLAY_SETUP";
	
	constants.REDUCE_NOHANDLERS = '1';
	constants.REDUCE_EVENT_DPS = '2';
	constants.RefactorType = {
		'REMOVE':'RM',
		'ADD':'A'
	}
	constants.AnalyseStatus = {
		OK:'OK',
		FAILED:'FAILED',
		TEST:'TEST'
	}

	constants.SHARED_LABEL = {
			in:'I',
			out:'O',
			define:'D'
		}	

	

	if (typeof module == 'object' && typeof exports == 'object'){
		exports.constants = constants;
	}

})(R$);
