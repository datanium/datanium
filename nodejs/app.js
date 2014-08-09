/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var rest = require('./routes/rest');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/:hashid', routes.index);
app.get('/helloworld', routes.helloworld);
app.post('/rest/query/result', rest.queryResult);
app.get('/rest/indicator/search', rest.indicatorSearch);
app.get('/rest/indicator/map', rest.indicatorMapping);
app.get('/rest/dimension/search', rest.dimensionValueSearch);
app.post('/rest/query/split', rest.querySplit);
app.get('/rest/query/topicSearch', rest.topicSearch);
app.post('/rest/save', rest.save);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
