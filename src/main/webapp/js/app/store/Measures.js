Ext.define('Datanium.store.Measures', {
	extend : 'Ext.data.TreeStore',
	model : 'Datanium.model.Measure',
	storeId : 'measureStore',

	proxy : {
		type : 'memory',
		reader : {
			type : 'json',
			idProperty : 'uniqueName',
			root : 'children'
		}
	},
	listeners : {
		load : function(store) {
		}
	},
	folderSort: true,
	sorters : [ {
		property : 'name',
		direction : 'ASC'
	} ]
});