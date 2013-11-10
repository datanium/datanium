Ext.define('Datanium.model.Dimension', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'uniqueName',
		mapping : 'uniqueName', //mapping name in JSON
		type : 'string'
	}, {
		name : 'name',
		mapping : 'name', 
		type : 'string'
	}, {
		name : 'caption',
		mapping : 'caption',
		type : 'string'
	}, {
		name : 'data_type',
		type : 'String',
		defaultValue : 'dimension'
	}]
});