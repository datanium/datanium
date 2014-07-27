Ext.define('Datanium.view.DataPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.datapanel',
	initComponent : function() {
		Ext.apply(this, {
			defaults : {
				border : false,
				floatable : false,
				collapsible : false,
				header : false
			},
			itemId : Datanium.util.CommonUtils.genItemId('dataViewBox'),
			layout : 'card',
			border : false,
			items : [ {
				xtype : 'datagridview',
				itemId : Datanium.util.CommonUtils.genItemId('dataGridView')
			}, {
				xtype : 'datachartview',
				itemId : Datanium.util.CommonUtils.genItemId('dataChartView')
			}, {
				xtype : 'dataanalysisview',
				itemId : Datanium.util.CommonUtils.genItemId('dataAnalysisView')
			} ]
		});
		this.callParent();
	}
});
