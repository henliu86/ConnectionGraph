/*
 * GET home page.
 */
exports.index = function(req, res){
	res.render('index', { title: 'Graph APP' });
};

/*
 * direct to salesforce oauth page
 */
exports.oauth = function(req, res){
	//console.log(req.session.oauth);
	/*
	{
		id: 'https://login.salesforce.com/id/00D30000001bK7XEAU/00530000008L9njAAC',
		issued_at: '1377556186889',
		instance_url: 'https://na1.salesforce.com',
		signature: '2+fP+59uJc1g+NjdL4XEXPnQqiJ53EOFXQpCJ+6KCDY=',
		access_token: '00D30000001bK7X!AQwAQBzjJmc7IyGtxEApY__sI.sVRc62rkvtlZmZmkXFu9WNdkrShLwbSOypgaO71shP.T.NvSelJXYTEToUnj8RnFObj.IP' 
	}
	*/
	var myOauth = new Object();

	//myOauth.id = 'https://login.salesforce.com/id/00D30000001bK7XEAU/00530000008L9njAAC';
	//myOauth.issued_at = '1377556186889';
	//myOauth.instance_url = 'https://na1.salesforce.com';
	//myOauth.signature = '2+fP+59uJc1g+NjdL4XEXPnQqiJ53EOFXQpCJ+6KCDY=';
	
	myOauth.code = req.query.code;
	//console.log('sesion token: ' + req.session.oauth);
	
	//oauth.instance_url = 
	//oauth.userId = requestContext.userId;
	//console.log('access token: ');
	//console.log(myOauth.access_token);
	req.session.oauth = myOauth;
	
	//res.send('go back to index.ejs');
	res.redirect('/index/');
};
 