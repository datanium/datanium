Ext.define('Datanium.view.Toolbar', {
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'basic-buttons',
	cls : 'button-view',
	id : 'basic-toolbar',
	alias : 'widget.top-toolbar',
	minHeight : 45,
	items : [ {
		xtype : 'button',
		name : 'newReport',
		text : '<strong>New</strong>',
		scale : 'small',
		tooltip : 'New Report',
		tooltipType : 'title',
		icon : 'img/icons/add.png',
		action : 'new-rpt'
	}, '-', {
		xtype : 'button',
		id : 'saveBtn',
		icon : 'img/icons/disk.png',
		text : '<strong>Save</strong>',
		scale : 'small',
		tooltip : 'Save Report',
		tooltipType : 'title',
		action : 'save-rpt'
	}, '-', {
		xtype : 'button',
		icon : 'img/icons/disk_multiple.png',
		text : '<strong>Save As</strong>',
		scale : 'small',
		tooltip : 'Save As New Report',
		tooltipType : 'title'
	}, '-', {
		xtype : 'button',
		icon : 'img/icons/cog.png',
		text : '<strong>Preference</strong>',
		scale : 'small',
		tooltip : 'My Preference',
		tooltipType : 'title'
	}, '-', {
		xtype : 'button',
		icon : 'img/icons/information.png',
		text : '<strong>Help</strong>',
		scale : 'small',
		tooltip : 'Help',
		tooltipType : 'title'
	} ]

});