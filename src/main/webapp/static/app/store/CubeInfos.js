Ext.define('Datanium.store.CubeInfos', {
	extend : 'Ext.data.Store',
	model : 'Datanium.model.CubeInfo',
	proxy : {
		type : 'ajax',
		url : 'data/cube_data_sample.json',
		reader : {
			type : 'json',
			idProperty : 'uniqueName',
			timeout : 300000,
			root : ''
		}
	},
	listeners : {
		load : function(store, node, records, successful, eOpts) {

		}
	},

	sorters : [ {
		property : 'cubeName',
		direction : 'ASC'
	} ]
});