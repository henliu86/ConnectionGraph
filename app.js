
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

app.get('/', routes.index);
app.get('/users', user.list);


//////////////////////////
//get data from salesforce
app.get('/UserIdToSubscriberIds', function(req,res){
	res.send(myData.getUserIdToSubscriberIds());
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



