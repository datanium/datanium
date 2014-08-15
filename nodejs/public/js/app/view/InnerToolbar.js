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
		tooltip : 'Run Query',
		tooltipType : 'title',
		html : '<i class="fa fa-play-circle fa-2x"></i>',
		action : 'manual-run'
	}, {
		scale : 'medium',
		tooltip : 'Auto Run',
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
		tooltip : 'Clear Selection',
		tooltipType : 'title',
		html : '<i class="fa fa-times-circle-o fa-2x"></i>',
		action : 'clear'
	}, {
		scale : 'medium',
		tooltip : 'Show Field Panel',
		tooltipType : 'title',
		html : '<i class="fa fa-list-alt fa-2x"></i>',
		action : 'show-fields',
		enableToggle : true,
		pressed : true
	}, {
		xtype : 'tbseparator',
		height : 14,
		margins : '0 0 0 1'
	}, {
		id : 'gridViewBtn',
		scale : 'medium',
		tooltip : 'Grid View',
		tooltipType : 'title',
		html : '<i class="fa fa-table fa-2x"></i>',
		action : 'grid-mode',
		enableToggle : true,
		pressed : true,
		toggleGroup : 'rptMode'
	}, {
		id : 'chartViewBtn',
		scale : 'medium',
		tooltip : 'Chart View',
		tooltipType : 'title',
		html : '<i class="fa fa-bar-chart-o fa-2x"></i>',
		action : 'chart-mode',
		enableToggle : true,
		pressed : false,
		toggleGroup : 'rptMode'
	}, {
		id : 'analysisViewBtn',
		scale : 'medium',
		tooltip : 'Analysis View',
		tooltipType : 'title',
		html : '<i class="fa fa-puzzle-piece fa-2x"></i>',
		action : 'analysis-mode',
		enableToggle : true,
		pressed : false,
		toggleGroup : 'rptMode',
		disabled : false
	}, {
		xtype : 'tbseparator',
		height : 14,
		margins : '0 0 0 1'
	}, {
		scale : 'medium',
		tooltip : 'Export to PDF',
		tooltipType : 'title',
		html : '<i class="fa fa-file-pdf-o fa-2x"></i>',
		action : 'export-pdf',
		disabled : true
	}, {
		scale : 'medium',
		tooltip : 'Export to Twitter',
		tooltipType : 'title',
		html : '<i class="fa fa-twitter fa-2x"></i>',
		action : 'export-twitter',
		disabled : true
	}, {
		scale : 'medium',
		tooltip : 'Export to Weibo',
		tooltipType : 'title',
		html : '<i class="fa fa-weibo fa-2x"></i>',
		action : 'export-weibo',
		disabled : true
	} ]
});