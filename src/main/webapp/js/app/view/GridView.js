Ext.define('Datanium.view.GridView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.datagridview',
	initComponent : function() {
		Ext.apply(this, {
			layout : 'border',
			items : []
		});
		this.callParent();
	}
});
