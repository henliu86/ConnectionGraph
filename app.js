
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var url = require('url');
var path = require('path');
var nforce = require('nforce');
var app = express();

app.use(express.cookieParser());
app.use(express.session( {secret : 'henryliusecret'} ));

//controller to get data from salesforce
var myData = require('./controllers/processConnections');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//setup salesforce oauth
var org = nforce.createConnection({
	clientId: '3MVG99OxTyEMCQ3gG9qUh.ce54NOXg4vsqI4PZP8f965xeGUWTcuFiRHtuJWlowCQw993i51po9G4WECLNlSW',
	clientSecret: '8428401456520732541',
	redirectUri: 'https://damp-castle-2728.herokuapp.com/oauth/callback?', //'http://localhost:3000/oauth/callback?',
	apiVersion: 'v28.0',  // optional, defaults to current salesforce API version
	environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
	mode: 'multi' // optional, 'single' or 'multi' user mode, multi default
});
app.set('alreadyOAuth',false);

//routes
routes.boot(org); //pass org in here to route index.js


app.get('/index/:sourceUserId/:targetUserId',function(req, res){
	console.log("in /index with params!! source: "+req.params.sourceUserId + " target: "+req.params.targetUserId);
	myData.setSourceAndTargetUserId(req.params.sourceUserId,req.params.targetUserId);
	res.redirect('/index');
});
/*
app.get('/',function(req, res){
	console.log(req.route);
	console.log(req.originalUrl);
	console.log("in /index with params old way1!! source: "+req.query.sourceUserId + " target: "+req.query.targetUserId);
	console.log("in /index with params old way2!! source: "+req.param('sourceUserId') + " target: "+req.param('targetUserId'));
	console.log("in /index with params old way3!! source: "+req.body.sourceUserId + " target: "+req.body.targetUserId);
	
	myData.setSourceAndTargetUserId( req.param('sourceUserId'),req.param('targetUserId') );
	res.redirect('/index');
});
*/
app.get('/index',routes.index);

/*
app.get('/index?sourceUserId=:sourceUserId&targetUserId=:targetUserId',function(req, res){
	console.log("in /index with params!! source: "+req.params.sourceUserId + " target: "+req.params.targetUserId);
	myData.setSourceAndTargetUserId(req.params.sourceUserId,req.params.targetUserId);
	res.redirect('/index');
});
*/
app.get('/sourceUserId', function(req,res){
	console.log('Node get source User Id:');
	console.log(myData.getSourceAndTargetUserId().sourceUserId);
	res.send(myData.getSourceAndTargetUserId().sourceUserId);
});
app.get('/targetUserId', function(req,res){
	res.send(myData.getSourceAndTargetUserId().targetUserId);
});
app.get('/oauth/callback', routes.oauth);

app.get('/users', user.list);
app.get('/auth/salesforce',function(req, res){
	res.redirect(org.getAuthUri());
});

//////////////////////////
//get data from salesforce
app.get('/UserIdToSubscriberIds', function(req,res){
	myData.getUserIdToSubscriberIds(org, req, res);
});
app.get('/ChatterGroupIdToSubscriberIds', function(req,res){
	myData.getChatterGroupIdToSubscriberIds(org, req, res);
});
app.get('/UserIdToChatterGroupIds', function(req,res){
	myData.getUserIdToChatterGroupIds(org, req, res);
});
app.get('/IdToName', function(req,res){
	myData.getIdToName(org, req, res);
});
//return oauth object
app.get('/oauth', function(req,res){
	res.send( JSON.stringify(req.session.oauth) );
});
//////////////////////////




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});