Ext.define('Datanium.view.Accordion', {
	extend : 'Ext.panel.Panel',
	xtype : 'layout-accordion',
	alias : 'widget.accordion',
	layout : {
		type : 'vbox',
		padding : '0 5',
		align : 'stretch'
	},
	defaults : {
		bodyPadding : 1
	},
	initComponent : function() {
		Ext.apply(this, {
			items : [ {
				xtype : 'dimensionTree',
				itemId : Datanium.util.CommonUtils.genItemId('dimensionTree'),
				padding : '0 0 5 0',
				flex : 1
			}, {
				xtype : 'measureTree',
				itemId : Datanium.util.CommonUtils.genItemId('measureTree'),
				padding : '0 0 5 0',
				flex : 1
			} ]
		});
		this.callParent();
	}
});