Ext.define('Datanium.model.Measure', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'uniqueName',
		mapping : 'uniqueName',
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
		defaultValue : 'measure'
	}]
});