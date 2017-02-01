
exports.advanced = function(req, res){
	var sid = req.param('sid');
	res.render("pages/advanced",{sid:sid});
}
