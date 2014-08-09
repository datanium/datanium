Ext.define('Datanium.store.DemoAnalysisBoxes', {
	extend : 'Ext.data.Store',
	model : 'Datanium.model.DemoAnalysisBox',
	data : [ {
		"indicator" : "Sample Indicator A",
		"data" : 14
	}, {
		"indicator" : "Sample Indicator B",
		"data" : 19
	}, {
		"indicator" : "Sample Indicator C",
		"data" : 7
	} ]
});