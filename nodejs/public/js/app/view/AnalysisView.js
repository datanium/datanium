Ext.define('Datanium.view.AnalysisView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.dataanalysisview',
	initComponent : function() {
		Ext.apply(this, {
			layout : 'border',
			items : [ {
				region : 'south',
				xtype : 'analysis-toolbar',
				width : '100%',
				border : false
			}, {
				xtype : 'demo-analysis',
				width : '100%'
			} ]
		});
		this.callParent();
	}
});
