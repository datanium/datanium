Ext.define('Stockholm.store.JobDates', {
	extend : 'Ext.data.Store',
	model : 'Stockholm.model.JobDate',
	sorters : [ {
		property : 'date_str',
		direction : 'DESC'
	} ],
	proxy : {
		type : 'ajax',
		url : '/stockholm/dates',
		reader : {
			type : 'json',
			idProperty : 'date_str',
			root : 'res'
		}
	},
	listeners : {
		load : function(res, operation, success) {
			if (success) {
				var records = res.data.items;
				if (records.length > 0) {
					Ext.getCmp('dateSelect').select(records[0].data['date_str']);
				}
			}
		}
	},
	autoLoad : true
});