Ext.define('Datanium.view.InnerToolbar', {
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'basic-buttons',
	cls : 'button-view',
	alias : 'widget.inner-toolbar',
	shadow : 'drop',
	shadowOffset : 10,
	minHeight : 38,
	padding : '0 5',
	items : [ {
		scale : 'medium',
		tooltip : Datanium.GlobalStatic.label_run_query,
		tooltipType : 'title',
		html : '<i class="fa fa-play-circle fa-2x"></i>',
		action : 'manual-run'
	}, {
		scale : 'medium',
		tooltip : Datanium.GlobalStatic.label_auto_query,
		tooltipType : 'title',
		html : '<i class="fa fa-play-circle-o fa-2x"></i>',
		action : 'auto-run',
		enableToggle : true,
		pressed : true
	}
	/*
	 * , { scale : 'medium', tooltip : 'Save Analysis', tooltipType : 'title',
	 * html : '<i class="fa fa-floppy-o fa-2x"></i>', action : 'export',
	 * disabled : true }
	 */, {
		scale : 'medium',
		tooltip : Datanium.GlobalStatic.label_clear_sel,
		tooltipType : 'title',
		html : '<i class="fa fa-times-circle-o fa-2x"></i>',
		action : 'clear'
	}, {
		id : 'show_field_panel_btn',
		scale : 'medium',
		tooltip : Datanium.GlobalStatic.label_show_field_p,
		tooltipType : 'title',
		html : '<i class="fa fa-list-alt fa-2x"></i>',
		action : 'show-fields',
		enableToggle : true,
		pressed : true
	}, {
		id : 'apply_filter_btn',
		xtype : 'splitbutton',
		scale : 'medium',
		tooltip : Datanium.GlobalStatic.label_apply_filter,
		tooltipType : 'title',
		html : '<i class="fa fa-filter fa-2x"></i>',
		handler : function() {
			this.showMenu();
		},
		menu : [],
		disabled : true
	}, {
		xtype : 'tbseparator',
		height : 14,
		margins : '0 0 0 1'
	}, {
		id : 'gridViewBtn',
		scale : 'medium',
		tooltip : Datanium.GlobalStatic.label_grid_view,
		tooltipType : 'title',
		html : '<i class="fa fa-table fa-2x"></i>',
		action : 'grid-mode',
		enableToggle : true,
		pressed : true,
		toggleGroup : 'rptMode'
	}, {
		id : 'chartViewBtn',
		scale : 'medium',
		tooltip : Datanium.GlobalStatic.label_chart_view,
		tooltipType : 'title',
		html : '<i class="fa fa-bar-chart-o fa-2x"></i>',
		action : 'chart-mode',
		enableToggle : true,
		pressed : false,
		toggleGroup : 'rptMode'
	}, {
		id : 'analysisViewBtn',
		scale : 'medium',
		tooltip : Datanium.GlobalStatic.label_analysis_view,
		tooltipType : 'title',
		html : '<i class="fa fa-puzzle-piece fa-2x"></i>',
		action : 'analysis-mode',
		enableToggle : true,
		pressed : false,
		toggleGroup : 'rptMode',
		disabled : true
	}, {
		xtype : 'tbseparator',
		height : 14,
		margins : '0 0 0 1'
	}, {
		scale : 'medium',
		tooltip : Datanium.GlobalStatic.label_exp_pdf,
		tooltipType : 'title',
		html : '<i class="fa fa-file-pdf-o fa-2x"></i>',
		action : 'export-pdf',
		disabled : true
	}, {
		scale : 'medium',
		tooltip : Datanium.GlobalStatic.label_exp_twitter,
		tooltipType : 'title',
		html : '<i class="fa fa-twitter fa-2x"></i>',
		action : 'export-twitter',
		disabled : true
	}, {
		scale : 'medium',
		tooltip : Datanium.GlobalStatic.label_exp_weibo,
		tooltipType : 'title',
		html : '<i class="fa fa-weibo fa-2x"></i>',
		action : 'export-weibo',
		disabled : true
	} ]
});