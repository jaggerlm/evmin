if(typeof R$ === 'undefined'){
	R$ = {};
}

(function(rr){
	var dps = rr.dps = rr.dps || {};
	var natives = {};

	var getConcrete = dps.AnotatedValue.getConcrete;
	natives.filters = {
		'Array':{
			type:rr.natives.Array,
			handle:function(node){
				//console.log('=============summarying Array:',node);
				if(node.__type == dps.OP_TYPE.DATA.F){
//					console.log('==============Array.call:',node);	
				}else if(node.__type == dps.OP_TYPE.DATA.G){

				}else if(node.__type == dps.OP_TYPE.DATA.P){

				}

			}
		}
	};
	natives.summary = function(node){
		if(node && node.__base){
			var base = getConcrete(node.__base);
			for(var i in natives.filters){
				if(base instanceof natives.filters[i].type){
					natives.filters[i].handle(node);
				}
			}
			
		}
	}
	dps.natives = natives;
})(R$);
