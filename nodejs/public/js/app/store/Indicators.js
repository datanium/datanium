Ext.define('Datanium.store.Indicators', {
	extend : 'Ext.data.Store',
	model : 'Datanium.model.Indicator',
	proxy : {
		type : 'ajax',
		url : '/indicator/search',
		reader : {
			type : 'json',
			idProperty : 'uniqueName',
			root : 'indicators'
		}
	},
	listeners : {
		load : function(store, node, records, successful, eOpts) {
			if (successful) {
			}
		}
	},
	autoLoad : true,
	sorters : [ {
		property : 'text',
		direction : 'ASC'
	} ]
});