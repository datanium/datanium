var data = require('../data/sampleData');

var indicator = require('../data/indicator');
var IndicatorSchema = indicator.Indicator;

exports.cubeList = function(req, res) {
	res.send(data.cubeListJSON);
};

exports.cubeInfo = function(req, res) {
	res.send(data.cubeInfoJSON);
};

exports.queryResult = function(req, res) {
	res.send(data.queryResultJSON);
};

exports.indicatorMapping = function(req, res) {
	var indicatorMappingJSON ={};
	var query = require('url').parse(req.url, true).query;
	var idc = query.idc;
	console.log(idc);
	var dimensions = [];
	var measures = [];
	IndicatorSchema.find({indicator_key:idc},function(err, doc) {
			doc.forEach(function(item, index){
				console.log(item.indicator_key);
				console.log(item.indicator_text);
				var tempDimensions = item.dimension;
				tempDimensions.forEach(function(dimension,index){
					var tempDimension ={
						"uniqueName" : dimension.dimension_key,
						"name" : dimension.dimension_key,
						"text" : dimension.dimension_text
					};
					dimensions.push(tempDimension);
				});
				var tempMesureJson = {
					"uniqueName" : item.indicator_key,
					"name" : item.indicator_key,
					"text" : item.indicator_text
				};
				measures.push(tempMesureJson);
			});
			indicatorMappingJSON = {
				"dimensions" : dimensions,
				"measures" : measures
				};
				console.log(indicatorMappingJSON);
	res.send(indicatorMappingJSON);	        
	    });
	/*if (idc == '[Measures].[CPI]') {
		indicatorMappingJSON = {
			"dimensions" : [ {
				"uniqueName" : "[GEO].[COUNTRY]",
				"name" : "COUNTRY",
				"text" : "Country"
			}, {
				"uniqueName" : "[TIME].[YEAR]",
				"name" : "YEAR",
				"text" : "Year"
			} ],
			"measures" : [ {
				"uniqueName" : "[Measures].[CPI]",
				"name" : "CPI",
				"text" : "CPI"
			} ]
		};
	} else if (idc == '[Measures].[GDP]') {
		indicatorMappingJSON = {
			"dimensions" : [ {
				"uniqueName" : "[GEO].[REGION]",
				"name" : "REGION",
				"text" : "Region"
			}, {
				"uniqueName" : "[GEO].[COUNTRY]",
				"name" : "COUNTRY",
				"text" : "Country"
			} ],
			"measures" : [ {
				"uniqueName" : "[Measures].[GDP]",
				"name" : "GDP",
				"text" : "GDP"
			} ]
		};
	} else if (idc == '[Measures].[Interest Rate]') {
		indicatorMappingJSON = {
			"dimensions" : [ {
				"uniqueName" : "[GEO].[COUNTRY]",
				"name" : "COUNTRY",
				"text" : "Country"
			} ],
			"measures" : [ {
				"uniqueName" : "[Measures].[Interest Rate]",
				"name" : "Interest Rate",
				"text" : "Interest Rate"
			} ]
		};
	}
	res.send(indicatorMappingJSON);*/
}

exports.indicatorSearch = function(req, res) {
	var query = require('url').parse(req.url, true).query;
	if (query.query != null) {
		var key = query.query.toLowerCase();
		var results =[];
		IndicatorSchema.find({indicator_key:{$regex:key}},function(err, doc) {
			doc.forEach(function(item, index){
				console.log(item.indicator_key);
				console.log(item.indicator_text);
				var tempJson = {
					"uniqueName" : item.indicator_key,
					"text" : item.indicator_text
				};
				results.push(tempJson);
			});
			var indicatorResultJSON = {
				"indicators" : results
				};
	res.send(indicatorResultJSON);	        
	    });
	}
};