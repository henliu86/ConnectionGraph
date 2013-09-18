/*
 * GET home page.
 */
var org;
exports.getOrg = function()
{
	return org;
}

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

	var myorg = nforce.createConnection({
		clientId: '3MVG99OxTyEMCQ3gG9qUh.ce54NOXg4vsqI4PZP8f965xeGUWTcuFiRHtuJWlowCQw993i51po9G4WECLNlSW',
		clientSecret: '8428401456520732541',
		redirectUri: 'https://damp-castle-2728.herokuapp.com/oauth/callback?', //'http://localhost:3000/oauth/callback?',
		apiVersion: 'v28.0',  // optional, defaults to current salesforce API version
		environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
		mode: 'multi' // optional, 'single' or 'multi' user mode, multi default
	});
	org = myorg;
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
 