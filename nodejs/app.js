/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var rest = require('./routes/rest');
var user = require('./routes/userController');
var indicator = require('./routes/indicatorController');
var others = require('./routes/others');
var http = require('http');
var path = require('path');
var cache = require('./utils/cacheUtil');

var nocache = function(req, res, next) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	next();
}

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
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

// init server cache
// cache.init();

app.get('/', routes.index);
app.post('/rest/query/result', rest.queryResult);
app.get('/rest/indicator/search', indicator.searchIndicator);
app.get('/rest/indicator/map', rest.indicatorMapping);
app.get('/rest/dimension/search', rest.dimensionValueSearch);
app.post('/rest/query/split', rest.querySplit);
app.get('/rest/query/topicSearch', rest.topicSearch);
app.post('/rest/save', rest.save);
app.post('/signup', user.saveUser);
app.post('/login', user.login);
app.get('/signout', nocache, user.signout);
app.get('/user/space', nocache, user.space);
app.post('/feedback/save', others.feedbacksave);
app.get('/:hashid', routes.index);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
