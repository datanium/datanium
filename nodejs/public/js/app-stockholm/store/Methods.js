Ext.define('Stockholm.store.Methods', {
	extend : 'Ext.data.Store',
	model : 'Stockholm.model.Method',
	proxy : {
		type : 'ajax',
		url : '/stockholm/methods/load',
		reader : {
			type : 'json',
			root : 'res'
		}
	},
	listeners : {
		load : function(res, operation, success) {
			if (success) {
			}
		}
	},
	autoLoad : true
});