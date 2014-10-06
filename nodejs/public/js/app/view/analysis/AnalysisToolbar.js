Ext.define('Datanium.view.analysis.AnalysisToolbar', {
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'basic-buttons',
	alias : 'widget.analysis-toolbar',
	shadowOffset : 10,
	minHeight : 38,
	padding : '0 5',
	initComponent : function() {
		this.callParent();
	},
	items : [ {
		xtype : 'splitbutton',
		iconCls : 'fa fa-database',
		cls : 'chartTypeBtn',
		scale : 'medium',
		text : 'Sample Indicator A',
		handler : function() {
			this.showMenu();
		},
		menu : [ {
			iconCls : 'fa fa-star-o',
			text : 'Sample Indicator A',
			handler : function() {
			}
		}, {
			text : 'Sample Indicator B',
			handler : function() {
			}
		}, {
			text : 'Sample Indicator C',
			handler : function() {
			}
		} ]
	}, {
		xtype : 'tbseparator',
		height : 14,
		margins : '0 0 0 1'
	}, {
		iconCls : 'fa fa-clock-o fa',
		cls : 'chartTypeBtn',
		scale : 'medium',
		tooltip : Datanium.GlobalStatic.label_time_s_analysis,
		tooltipType : 'title',
		text : Datanium.GlobalStatic.label_time_s_analysis,
		action : 'auto-scale',
		enableToggle : true,
		pressed : true
	}, {
		xtype : 'tbseparator',
		height : 14,
		margins : '0 0 0 1'
	}, {
		iconCls : 'fa fa-random fa',
		cls : 'chartTypeBtn',
		scale : 'medium',
		tooltip : Datanium.GlobalStatic.label_corr_analysis,
		tooltipType : 'title',
		text : Datanium.GlobalStatic.label_corr_analysis,
		action : 'hide-legend',
		enableToggle : true,
		pressed : true
	} ]
});