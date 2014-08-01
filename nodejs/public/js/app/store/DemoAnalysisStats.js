Ext.define('Datanium.store.DemoAnalysisStats', {
	extend : 'Ext.data.Store',
	model : 'Datanium.model.DemoAnalysisStat',
	proxy : {
		type : 'ajax',
		url : '/data/demo_analysis.json',
		reader : {
			type : 'json',
			root : 'root'
		}
	},
	listeners : {
		load : function(store, node, records, successful, eOpts) {
			if (successful) {
			}
		}
	},
	autoLoad : true
});