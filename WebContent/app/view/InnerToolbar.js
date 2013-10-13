Ext.define('Datanium.view.InnerToolbar', {
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'basic-buttons',
	cls : 'button-view',
	alias : 'widget.inner-toolbar',
	shadow : 'drop',
	shadowOffset : 10,
	minHeight : 35,
	padding : '0 5',
	items : [ {
		scale : 'small',
		tooltip : 'Run Query',
		tooltipType : 'title',
		html : '<i class="icon-play"></i>',
		action : 'manual-run'
	}, '-', {
		scale : 'small',
		tooltip : 'Auto Run',
		tooltipType : 'title',
		html : '<i class="icon-forward"></i>',
		action : 'auto-run',
		enableToggle : true,
		pressed : true
	}, '-', {
		scale : 'small',
		tooltip : 'Export Report',
		tooltipType : 'title',
		html : '<i class="icon-arrow-down"></i>',
		action : 'export'
	}, '-', {
		scale : 'small',
		tooltip : 'Clear Selection',
		tooltipType : 'title',
		html : '<i class="icon-remove"></i>',
		action : 'clear'
	} ]
});