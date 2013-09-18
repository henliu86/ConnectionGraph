/*
 * GET home page.
 */
var org;
exports.boot = function(myOrg){
	org = myOrg;
} 
exports.index = function(req, res){
	if(req.session.code)
		res.render('index', { title: 'Graph APP' });
	else
		res.redirect('/');
};

/*
 * direct to salesforce oauth page
 */
exports.oauth = function(req, res){
	//var myOauth = new Object();
	//myOauth.code = req.query.code;
	req.session.code = req.query.code;
	console.log("access code: " + req.session.code);
	//res.send('go back to index.ejs');

	//get access_token
	org.authenticate({ code: req.session.code }, function(err, oauth){
		if(!err) 
		{
			console.log('oauth: ')
			console.log(oauth);        
			req.session.oauth = oauth; //assign session.oath to the result of oauth
			res.redirect('/index/');
		} else {
			console.log('Error: ' + err.message);
		}
    });

	
};
 