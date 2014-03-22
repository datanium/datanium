Ext.define('Datanium.store.CubeNames', {
	extend : 'Ext.data.Store',
	model : 'Datanium.model.CubeName',
	proxy : {
		type : 'ajax',
		url : '/rest/cube/list',
		reader : {
			type : 'json',
			idProperty : 'uniqueName',
			root : 'cubes'
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
		property : 'name',
		direction : 'ASC'
	} ]
});