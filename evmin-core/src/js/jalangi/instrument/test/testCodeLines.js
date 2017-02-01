require('../esnstrument.js');
//fs = require('fs');
//var src = fs.readFileSync('codeLines.js').toString();
res = J$.getCodeLines('console.log("haha");\nvar a = 1;');
console.log(res);
///*
res = J$.getCodeLines(function (){
	var a = 1;
	var b = 2;
	var c = a+b;
});
//*/
console.log(res);
