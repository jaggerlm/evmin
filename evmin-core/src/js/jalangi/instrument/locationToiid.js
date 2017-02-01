if (typeof J$ === 'undefined') {
    J$ = {};
}

(function (sandbox) {
    var isBrowser = false;
    var isInited = false;

    sandbox.locationToIid = function (sid,accept) {
        if (!isInited) {
            isInited = true;
            try {
				//var f = process.cwd()+"/instrumentedScripts/default/jalangi_sourcemap.js";
				var f = process.cwd()+'/log/'+sid+'_sourcemap.js';
				require(f);
            } catch (e) {
                   // don't crash if we can't find sourcemap file
				console.log('Error:exception reading sourcemap');
				console.log(e);
            }
        }
		var res = {};
		if (sandbox.iids && typeof accept==='function') {
			for(var iid in sandbox.iids){
				if(accept(sandbox.iids[iid])){
					res[iid] = true;;
				}
			}
		}
        return res;
    };

}(J$));
