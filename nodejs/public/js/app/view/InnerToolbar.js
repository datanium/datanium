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
		xtype : 'tbseparator',
		height : 14,
		margins : '0 0 0 1'
	}, {
		scale : 'medium',
		tooltip : 'Grid View',
		tooltipType : 'title',
		html : '<i class="fa fa-table fa-2x"></i>',
		action : 'grid-mode',
		enableToggle : true,
		pressed : true,
		toggleGroup : 'rptMode'
	}, {
		scale : 'medium',
		tooltip : 'Chart View',
		tooltipType : 'title',
		html : '<i class="fa fa-bar-chart-o fa-2x"></i>',
		action : 'chart-mode',
		enableToggle : true,
		pressed : false,
		toggleGroup : 'rptMode'
	}, {
		scale : 'medium',
		tooltip : 'Analysis View',
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
		tooltip : 'Auto Scale',
		tooltipType : 'title',
		html : '<i class="fa fa-arrows fa-2x"></i>',
		action : 'auto-scale',
		enableToggle : true,
		pressed : false,
		disabled : true
	} ]
});