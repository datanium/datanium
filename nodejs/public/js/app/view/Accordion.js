Ext.define('Datanium.view.Accordion', {
	extend : 'Ext.panel.Panel',
	xtype : 'layout-accordion',
	alias : 'widget.accordion',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		Ext.apply(this, {
			items : [ {
				xtype : 'elementPanel',
				itemId : Datanium.util.CommonUtils.genItemId('elementPanel'),
				padding : '5',
				flex : 1,
				autoScroll : true
			} ]
		});
		this.callParent();
	}
});