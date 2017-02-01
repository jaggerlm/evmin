(function(){
	var log4js = require('log4js'); 
	log4js.configure('./src/js/log4js.json', { reloadSecs: 300 });
	var logger = log4js.getLogger();

	exports.logger = logger;
})();
		
