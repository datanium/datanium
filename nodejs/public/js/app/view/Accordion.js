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
				xtype : 'elementPanel',
				itemId : Datanium.util.CommonUtils.genItemId('elementPanel'),
				padding : '0 0 5 0',
				flex : 1,
				title : 'My Dataset',
				autoScroll : true
			} ]
		});
		this.callParent();
	}
});