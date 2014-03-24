Ext.define('Datanium.store.Dimensions', {
	extend : 'Ext.data.TreeStore',
	requires : [ 'ERMDashboard.model.Dimension' ],
	model : 'Datanium.model.Dimension',

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