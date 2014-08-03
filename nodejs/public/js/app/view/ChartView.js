Ext.define('Datanium.view.ChartView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.datachartview',
	initComponent : function() {
		Ext.apply(this, {
			layout : 'border',
			items : [ {
				region : 'south',
				xtype : 'chart-toolbar',
				width : '100%',
				border : false
			} ]
		});
		this.callParent();
	}
});
