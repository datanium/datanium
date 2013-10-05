Ext.define('Datanium.view.InnerToolbar', {
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'basic-buttons',
	cls : 'button-view',
	alias : 'widget.inner-toolbar',
	shadow : 'drop',
	shadowOffset : 10,
	minHeight : 35,
	items : [ {
		scale : 'small',
		tooltip : 'New Report',
		tooltipType : 'title',
		icon : 'img/icons/add.png',
		action : 'report-new'
	}, '-', {
		scale : 'small',
		tooltip : 'Save Report',
		tooltipType : 'title',
		icon : 'img/icons/disk.png',
		action : 'save-rpt'
	}, '-', {
		scale : 'small',
		tooltip : 'Run Query',
		tooltipType : 'title',
		icon : 'img/icons/control_play_blue.png',
		action : 'manual-run'
	}, '-', {
		scale : 'small',
		tooltip : 'Auto Run',
		tooltipType : 'title',
		icon : 'img/icons/control_fastforward_blue.png',
		action : 'auto-run',
		enableToggle : true,
		pressed : true
	} ]
});