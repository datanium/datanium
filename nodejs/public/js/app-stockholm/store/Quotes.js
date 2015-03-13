Ext.define('Stockholm.store.Quotes', {
	extend : 'Ext.data.Store',
	model : 'Stockholm.model.Quote',
	proxy : {
		type : 'ajax',
		url : '/stockholm/load',
		reader : {
			type : 'json',
			idProperty : 'Symbol',
			root : 'res'
		}
	},
	listeners : {
		load : function(res, operation, success) {
			if (success) {
				var records = res.data.items;
				if (records.length > 0) {
					Ext.getCmp('dateSelect').select(records[0].data['Date']);
				}
			}
		}
	},
	autoLoad : true
});