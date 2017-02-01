require('../../jalangi/instrument/esnstrument.js');
require('../../rr.util.js');
require('../AnotatedValue.js');
require('../../analysis2.js');

require('../Assert.js');
//R$.setErrors([107]);

R$.before(function(){
	x = 1;
	R$.observe(x);	
});

R$.done(function(Assert){
	//var text = $('#day-1 .todo-item span').text();
	text = 'text string';
	Assert.assertTrue(text!=null);
});

R$.callBefore();
R$.callDone();
