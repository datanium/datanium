var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var cache = require('./utils/cacheUtil');
var moment = require('moment');
var ejs = require('ejs');
ejs.open = '$[';
ejs.close = ']';
ejs.filters.dateformat = function(obj, format) {
	if (format == undefined) {
		format = 'YYYY-MM-DD HH:mm:ss';
	}
	var ret = moment(obj).format(format);
	return ret == 'Invalid date' ? '0000-00-00' : ret;
};

// routes config
var data = require('./routes/dataController');
var user = require('./routes/userController');
var indicator = require('./routes/indicatorController');
var report = require('./routes/reportController');
var others = require('./routes/others');

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

// i18n
var i18n = require('i18n-2');
i18n.expressBind(app, {
	locales : [ 'zh', 'en' ],
	defaultLocale : 'zh',
	extension : ".json",
	cookieName : 'locale',
	directory : __dirname + '/locales'
});

app.use(function(req, res, next) {
	req.i18n.setLocaleFromCookie();
	// req.i18n.setLocaleFromQuery();
	next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// for request disable cache
var nocache = function(req, res, next) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	next();
};

// init server cache
// cache.init();

app.get('/', routes.newIndex);
app.get('/reports', routes.allReports);
app.get('/r', routes.report);
app.get('/dimension/search', others.dimensionValueSearch);
app.get('/indicator/search', indicator.searchIndicator);
app.get('/indicator/map', indicator.indicatorMapping);
app.get('/indicator/topicSearch', indicator.topicSearch);
app.get('/indicator/countrySearch', indicator.countrySearch);
app.get('/indicator/countryLoad', indicator.countryLoad);
app.post('/data/result', data.queryResult);
app.post('/data/split', data.querySplit);
app.get('/c/:hashid', data.loadChart);
app.post('/signup', user.saveUser);
app.post('/login', user.login);
app.get('/signout', nocache, user.signout);
app.get('/user/space', nocache, user.space);
app.get('/user/settings', nocache, user.settings);
app.post('/user/saveSettings', user.saveSettings);
app.post('/report/save', report.save);
app.get('/report/remove/:rptId', report.remove);
app.get('/report/loadall', report.loadall);
app.post('/feedback/save', others.feedbacksave);
app.get('/release_notes', others.release_notes);
app.get('/r/:hashid', routes.report);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
