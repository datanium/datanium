Ext.define('Datanium.view.Toolbar', {
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'basic-buttons',
	cls : 'button-view',
	id : 'basic-toolbar',
	alias : 'widget.top-toolbar',
	minHeight : 50,
	items : [ {
		xtype : 'button',
		id : 'newReportBtn',
		html : '<i class="icon-plus-sign icon-3x"></i>',
		tooltip : 'New Report',
		tooltipType : 'title',
		action : 'new-rpt'
	}, {
		xtype : 'tbseparator',
		height : 24
	}, {
		xtype : 'button',
		id : 'openBtn',
		html : '<i class="icon-folder-open icon-3x"></i>',
		tooltip : 'Open Report',
		tooltipType : 'title',
		action : 'open-rpt'
	}, {
		xtype : 'tbseparator',
		height : 24
	}, {
		xtype : 'button',
		id : 'saveBtn',
		html : '<i class="icon-save icon-3x"></i>',
		tooltip : 'Save Report',
		tooltipType : 'title',
		action : 'save-rpt'
	}, {
		xtype : 'tbseparator',
		height : 24
	}, {
		xtype : 'button',
		id : 'deleteBtn',
		html : '<i class="icon-trash icon-3x"></i>',
		tooltip : 'Delete Report',
		tooltipType : 'title',
		action : 'del-rpt'
	}, {
		xtype : 'tbseparator',
		height : 24
	}, {
		xtype : 'button',
		id : 'myPreBtn',
		html : '<i class="icon-cog icon-3x"></i>',
		tooltip : 'My Preference',
		tooltipType : 'title'
	}, {
		xtype : 'tbseparator',
		height : 24
	}, {
		xtype : 'button',
		id : 'helpBtn',
		html : '<i class="icon-info-sign icon-3x"></i>',
		tooltip : 'Help',
		tooltipType : 'title'
	} ]

});