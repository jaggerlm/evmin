if (typeof J$ === 'undefined') {
    J$ = {};
}

(function (sandbox) {
    var isBrowser = false;
    var isInited = false;
	var fs = require('fs');

	sandbox.reloadIids = function(sid){
		delete sandbox.iids;
		//var f = process.cwd()+"/instrumentedScripts/default/jalangi_sourcemap.js";
		var f = process.cwd()+"/log/"+sid+"_sourcemap.js";
		try{
			require(f);
		}catch(e){
			console.log('[ERROR]',e.code+':',e.message);
		}
	}
    sandbox.iidToLocation = function (iid) {
        var ret;
        if (sandbox.iids) {
            if ((ret = sandbox.iids[iid])) {
                return "("+ret[0]/*.replace("_orig_.js", ".js")*/+":"+ret[1]+":"+ret[2]+":"+ret[3]+":"+ret[4]+")";
            }
        }
        return iid+"";
    };
	sandbox.iidToLine = function (iid) {
		var ret;
		if (sandbox.iids) {
			if ((ret = sandbox.iids[iid])) {
				return "("+ret[0]/*.replace("_orig_.js", ".js")*/+":"+ret[1]+":"+ret[3]+")";
			}
		}
	}

}(J$));
