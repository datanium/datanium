Ext.define('Datanium.view.GridView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.gridview',
	initComponent : function() {
		Ext.apply(this, {
			layout : 'border',
			items : [ {
				xtype : 'dynamicdatagrid',
				itemId : ERMDashboard.utils.GlobalUtil.genERMItemId('dynamicdatagrid'),
				region : 'center',
				floatable : false,
				collapsible : false,
				header : false
			} ]
		});
		this.callParent();
	}
});
