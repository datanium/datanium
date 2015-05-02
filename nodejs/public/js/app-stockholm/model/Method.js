Ext.define('Stockholm.model.Method', {
	extend : 'Ext.data.Model',
	fields : [ 'method_id', 'name', 'desc', 'method', 'user_id', 'user_name', 'Type', 'creation_date',
			'modification_date' ],
	proxy : {
		type : 'ajax',
		api : {
			read : '/stockholm/methods/load',
			update : '/stockholm/methods/save'
		},
		reader : {
			type : 'json',
			root : 'res'
		}
	}
});