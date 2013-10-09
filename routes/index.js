/*
 * GET home page.
 */
var org;
exports.boot = function(myOrg){
	org = myOrg;
} 
exports.index = function(req, res){
	console.log("in /index!! source: "+req.params.sourceUserId + " target: "+req.params.targetUserId);
	if(req.session.code)
	{
		console.log("GO HOME");
		res.render('index', { title: 'Graph APP' });
	}
	else
	{
		console.log("GO GET AUTH");
		res.redirect('/auth/salesforce');
	}
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
			console.log('redirect To: ' + '/index?sourceUserId='+req.params.sourceUserId+'&targetUserId='+req.params.targetUserId);
			res.redirect('/index?sourceUserId='+req.params.sourceUserId+'&targetUserId='+req.params.targetUserId);
		} else {
			console.log('Error: ' + err.message);
		}
    });

	
};
 