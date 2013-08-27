
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
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
	redirectUri: 'http://localhost:3000/oauth/callback?', //damp-castle-2728.herokuapp.com
	apiVersion: 'v28.0',  // optional, defaults to current salesforce API version
	environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
	mode: 'multi' // optional, 'single' or 'multi' user mode, multi default
});
app.set('alreadyOAuth',false);

//routes
app.get('/',function(req, res){
	res.redirect(org.getAuthUri());
});
app.get('/index',routes.index);
app.get('/oauth/callback', routes.oauth);
app.get('/users', user.list);
app.get('/auth/salesforce',function(req, res){
	res.redirect(org.getAuthUri());
});


//////////////////////////
//get data from salesforce
app.get('/UserIdToSubscriberIds', function(req,res){
	res.send(myData.getUserIdToSubscriberIds(org, req));
});
app.get('/ChatterGroupIdToSubscriberIds', function(req,res){
	res.send(myData.getChatterGroupIdToSubscriberIds());
});
app.get('/UserIdToChatterGroupIds', function(req,res){
	res.send(myData.getUserIdToChatterGroupIds());
});
app.get('/IdToName', function(req,res){
	res.send(myData.getIdToName());
});
//////////////////////////




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});