Ext.define('Datanium.view.GridView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.gridview',
	layout : 'border',
	items : [ Ext.create('Datanium.view.DynamicDataGrid', {
		xtype : 'dynamicdatagrid',
		region : 'center',
		floatable : false,
		collapsible : false,
		header : false,
	// enableLocking : true
	}) ]
});
