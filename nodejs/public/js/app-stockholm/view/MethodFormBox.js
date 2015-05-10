Ext.define('Stockholm.view.MethodFormBox', {
	extend : 'Ext.window.Window',
	alias : 'widget.methodformbox',
	layout : 'fit',
	id : 'methodDetailWindow',
	modal : true,
	title : '新建选股方法',
	items : [],
	tbar : [ {
		id : 'mtd_tb_open',
		scale : 'medium',
		text : '开盘价'
	}, {
		id : 'mtd_tb_close',
		scale : 'medium',
		text : '收盘价'
	} ]

});