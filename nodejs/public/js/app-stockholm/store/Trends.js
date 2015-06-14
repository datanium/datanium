Ext.define('Stockholm.store.Trends', {
	extend : 'Ext.data.Store',
	model : 'Stockholm.model.Trend',
	proxy : {
		type : 'ajax',
		url : '/stockholm/loadtrend',
		reader : {
			type : 'json',
			idProperty : 'Day',
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