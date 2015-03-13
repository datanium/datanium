Ext.define('Stockholm.model.Quote', {
	extend : 'Ext.data.Model',
	fields : [ 'Symbol', 'Name', 'Close', 'Date', 'KDJ_K', 'KDJ_D', 'KDJ_J', 'Day_1_Differ', 'Day_1_Profit',
			'Day_1_INDEX_Change', 'Day_3_Differ', 'Day_3_Profit', 'Day_3_INDEX_Change', 'Day_9_Differ', 'Day_9_Profit',
			'Day_9_INDEX_Change' ]
});