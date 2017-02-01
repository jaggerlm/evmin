arguments = process.argv.splice(2);
require('../iidToLocation.js');
J$.reloadIids(arguments[0]);
for(var i=1;i<arguments.length;i++){
	res = J$.iidToLocation(arguments[i]);
	console.log("ToLocation:",arguments[i],res);
	res = J$.iidToLine(arguments[i]);
	console.log("ToLine:",arguments[i],res);
}
