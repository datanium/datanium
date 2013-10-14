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
		html : '<i class="icon-play-sign icon-2x"></i>',
		action : 'manual-run'
	}, {
		xtype : 'tbseparator',
		height : 14,
		margins : '0 0 0 1'
	}, {
		scale : 'medium',
		tooltip : 'Auto Run',
		tooltipType : 'title',
		html : '<i class="icon-play-circle icon-2x"></i>',
		action : 'auto-run',
		enableToggle : true,
		pressed : true
	}, {
		xtype : 'tbseparator',
		height : 14,
		margins : '0 0 0 1'
	}, {
		scale : 'medium',
		tooltip : 'Export Report',
		tooltipType : 'title',
		html : '<i class="icon-download icon-2x"></i>',
		action : 'export'
	}, {
		xtype : 'tbseparator',
		height : 14,
		margins : '0 0 0 1'
	}, {
		scale : 'medium',
		tooltip : 'Clear Selection',
		tooltipType : 'title',
		html : '<i class="icon-remove-circle icon-2x"></i>',
		action : 'clear'
	} ]
});