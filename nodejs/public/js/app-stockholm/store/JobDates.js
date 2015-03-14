Ext.define('Stockholm.store.JobDates', {
	extend : 'Ext.data.Store',
	model : 'Stockholm.model.JobDate',
	sorters : [ {
		property : 'Date',
		direction : 'DESC'
	} ],
	proxy : {
		type : 'ajax',
		url : '/stockholm/dates',
		reader : {
			type : 'json',
			idProperty : 'Date',
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