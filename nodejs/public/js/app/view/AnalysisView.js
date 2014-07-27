Ext.define('Datanium.view.AnalysisView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.dataanalysisview',
	initComponent : function() {
		Ext.apply(this, {
			layout : 'border',
			items : [ {
				xtype : 'basic-analysis',
				width : '100%'
			} ]
		});
		this.callParent();
	}
});
