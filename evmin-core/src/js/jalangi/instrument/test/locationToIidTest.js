require('../locationToiid.js');
var sid = 1423639779807;
var file = 'Chart.js';
var L = 1958;
var H = 1967;

var res = J$.locationToIid(sid,function(rcd){
	if(rcd[0] == file && L<=rcd[1] && H>=rcd[3]){
		console.log(rcd);
		return true;
	}
});
console.log('----------------res');
console.log(res);
