R$.setErrors([107]);

R$.before(function(){
	x = getx();
	R$.observe(x);	
});

R$.done(function(Assert){
	var text = $('#day-1 .todo-item span').text();
	Assert.assertTrue(text!=null);
});
