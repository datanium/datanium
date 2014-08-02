Ext.define('Datanium.store.DemoAnalysisTimes', {
	extend : 'Ext.data.Store',
	model : 'Datanium.model.DemoAnalysisTime',
	proxy : {
		type : 'ajax',
		url : '/data/demo_analysis2.json',
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