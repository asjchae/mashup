
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'Enter three movies you\'ve seen' });
};