Ext.define('Datanium.view.ChartView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.datachartview',
	initComponent : function() {
		Ext.apply(this, {
			layout : 'border',
			items : []
		});
		this.callParent();
	}
});
