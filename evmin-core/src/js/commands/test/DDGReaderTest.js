(function(){
	var fs = require('fs');
	var DDGReader = require('../DDGReader.js').DDGReader;
	require('../../jalangi/instrument/locationToiid.js');

	// options to retrieve all the instruction dps for each event dps: {dpsLevel:'opid',o:false}
	// options to retrieve 1 representitive dps(optimize) for per event dps: {dpsLevel:'opid',o:true}
	// options for line summaries: {dpsLevel:'line',o:true}
	//
	global = {
		weak:false,
		optimize:false
	}

	var arguments = process.argv.splice(2)
	if(arguments.length>2){
		var op = arguments[0];
		if(op == '-w'){
			op = '-s';
			global.weak = true;
		}
		
		if(op == '-s'){
			if(arguments.length >2) {
				var sid = arguments[1];
				var granularity = arguments[2];
				var cut = arguments.splice(3);
				
				J$.reloadIids(sid);
				var file = './log/'+sid+'_2.log';
				var reader = new DDGReader(sid,granularity,{file:file,debug:true,dpsLevel:'opid',o:global.optimize,weak:global.weak});
				var res = reader.getSlice(cut).list;
				console.log('------------------get Slice result for sid=',sid, ',length of result:',res.length);
				console.log('ecut:',cut.join(','));
				console.log('result:',res.join(','));
			}
		}else if(op == '-p'){
			if(arguments.length>4){
				var sid = arguments[1];
				var file = arguments[2];
				var L = parseInt(arguments[3]);
				var H = parseInt(arguments[4]);
				var errorids = arguments.splice(5);
				J$.reloadIids(sid);
				var info = 'sid:'+sid+','+'source file:'+file+','+'low:'+L+','+'high:'+H+',errorids:'+errorids.join(',');
				console.log(info);	
				var ddg = new DDGReader(sid);
				console.log('sid param:',sid);
				faultCriterion = ddg.getFaultCriterionByIids2(errorids,J$.locationToIid(sid,function(rcd){
					if(rcd[0] == file && L<=rcd[1] && H>=rcd[3]){
						return true;
					}
				}));
				var file = './log/'+sid+'_2.log.p';
				var precise = ddg.getSlice(faultCriterion,{file:file,debug:true,request:info}).list;
				console.log('------------------get precise Slice result for sid=',sid, ',length of result:',precise.length);
				console.log('ecut:',faultCriterion.join(','));
				console.log('result:',precise.join(','));
			}
		}
		
	}
	
})()
