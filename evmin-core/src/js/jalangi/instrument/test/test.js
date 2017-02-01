require('../esnstrument.js');
fs = require('fs');
var src = fs.readFileSync('src.js').toString();
var ret = J$.instrumentCode(src,{wrapProgram:false,isEval:false});
console.log('****code:',ret.code);
console.log('****iidSourceInfo:',ret.iidSourceInfo);
