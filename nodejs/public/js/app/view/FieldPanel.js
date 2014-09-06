Ext.define('Datanium.view.FieldPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.fieldpanel',
	border : false,
	layout : {
		type : 'vbox',
		padding : '0',
		align : 'stretch'
	},

	defaults : {
		margin : '0 0 0 0'
	},

	initComponent : function() {
		var me = this;

		Ext.apply(me, {
			items : [ {
				xtype : 'panel',
				border : false,
				layout : {
					type : 'hbox',
					padding : '3 12 4 0',
					align : 'stretch'

				},
				items : [ {
					xtype : 'label',
					cls : 'fa fa-bars fa-lg',
					height : 27,
					width : 40,
					padding : '7 11 7 13'
				}, {
					xtype : 'fieldtb',
					layout : 'column',
					cls : 'fdtoolbar',
					itemId : Datanium.util.CommonUtils.genItemId('dimField'),
					flex : 9,
					margin : 0
				} ]
			}, {
				xtype : 'panel',
				border : false,
				layout : {
					type : 'hbox',
					padding : '6 12 4 0',
					align : 'stretch'
				},
				items : [ {
					xtype : 'label',
					cls : 'fa fa-bar-chart-o fa-lg',
					height : 27,
					width : 40,
					padding : '7 12 7 12'
				}, {
					xtype : 'fieldtb',
					cls : 'fdtoolbar',
					layout : 'column',
					itemId : Datanium.util.CommonUtils.genItemId('meaField'),
					flex : 9,
					margin : 0
				} ]
			}, {
				xtype : 'panel',
				border : false,
				layout : {
					type : 'hbox',
					padding : '6 12 10 0',
					align : 'stretch'
				},
				items : [ {
					xtype : 'label',
					cls : 'fa fa-filter fa-lg',
					height : 27,
					width : 40,
					padding : '7 10 7 14'
				}, {
					xtype : 'fieldtb',
					cls : 'fdtoolbar',
					layout : 'column',
					itemId : Datanium.util.CommonUtils.genItemId('fltField'),
					flex : 9,
					margin : 0
				} ]
			} ]
		});
		me.callParent();
	}
});