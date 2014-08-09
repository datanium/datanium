/*
 * GET home page.
 */

exports.index = function(req, res) {
	var hashid = req.url.substr(1);
	console.log(hashid);
	res.render('index', {
		hashid : hashid
	});
};

exports.helloworld = function(req, res) {
	res.send('Hello, World!');
};