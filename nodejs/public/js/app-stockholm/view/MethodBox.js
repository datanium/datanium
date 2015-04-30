Ext.define('Stockholm.view.MethodBox', {
	extend : 'Ext.window.Window',
	alias : 'widget.methodbox',
	autoScroll : true,
	height : 360,
	width : 720,
	border : false,
	layout : 'fit',
	title : '选股方法',
	modal : true,
	buttonAlign : 'right',
	items : [ {
		header : false,
		xtype : 'methodgrid',
		store : 'Methods',
		dockedItems : []
	} ],
	buttons : [ {
		text : 'Ok',
		handler : function() {
			console.log('ok');
		}
	} ]
});