Ext.define('Datanium.view.analysis.DemoAnalysis', {
	extend : 'Ext.form.Panel',
	alias : 'widget.demo-analysis',
	fieldDefaults : {
		labelAlign : 'right',
		labelWidth : 115,
		msgTarget : 'side'
	},

	initComponent : function() {
		Ext.apply(this, {
			region : 'center',
			margin : '5 0 0 0',
			style : 'background:#fff',
			title : 'Analysis Mode',
			header : false,
			overflowY : 'scroll',
			defaults : {
				margin : '5 25 10 10'
			}
		});
		this.items = [ {
			xtype : 'splitbutton',
			cls : 'analysisIndicatorBtn',
			scale : 'medium',
			margin : '15 25 10 15',
			text : 'Sample Indicator A',
			handler : function() {
				this.showMenu();
			},
			menu : []
		}, {
			xtype : 'fieldset',
			title : 'Basic Analysis',
			defaultType : 'textfield',
			defaults : {
				columnLines : true,
				autoHeight : true,
				autoWidth : true,
				forceFit : true,
				viewConfig : {
					stripeRows : true
				}
			},
			items : [ {
				xtype : 'gridpanel',
				margin : '6 5 14 5',
				store : 'DemoAnalysisStats',
				columns : [ {
					text : 'Year',
					sortable : true,
					dataIndex : 'year'
				}, {
					text : 'Min',
					sortable : true,
					dataIndex : 'min'
				}, {
					text : 'Max',
					sortable : true,
					dataIndex : 'max'
				}, {
					text : 'Mean',
					sortable : true,
					dataIndex : 'mean'
				}, {
					text : 'Median',
					sortable : true,
					dataIndex : 'median'
				}, {
					text : 'STD',
					sortable : true,
					dataIndex : 'std'
				} ]
			} ]
		}, {
			xtype : 'fieldset',
			title : 'Time Series Analysis',
			defaultType : 'textfield',
			defaults : {
				columnLines : true,
				autoHeight : true,
				autoWidth : true,
				forceFit : true,
				viewConfig : {
					stripeRows : true
				}
			},
			items : []
		}, {
			xtype : 'fieldset',
			title : 'Correlation Analysis',
			defaultType : 'textfield',
			defaults : {
				columnLines : true,
				autoHeight : true,
				autoWidth : true,
				forceFit : true,
				viewConfig : {
					stripeRows : true
				}
			},
			items : [ {
				xtype : 'splitbutton',
				margin : '6 5 14 5',
				scale : 'medium',
				text : 'Select Another Indicator',
				handler : function() {
					this.showMenu();
				},
				menu : []
			} ]
		} ];

		this.callParent();
	},

// buttons : [ {
// text : 'Execute'
// } ]
});
