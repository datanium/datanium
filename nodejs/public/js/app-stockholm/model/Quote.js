Ext.define('Stockholm.model.Quote', {
	extend : 'Ext.data.Model',
	fields : [ 'Symbol', 'Name', 'Date', 'Method', 'Type', 'Close', 'Change', 'Vol_Change', 'MA_5', 'MA_10', 'MA_20',
			'MA_30', 'KDJ_K', 'KDJ_D', 'KDJ_J', 
			'Day_1_Differ', 'Day_1_Profit', 'Day_1_INDEX_Change', 
			'Day_2_Differ', 'Day_2_Profit', 'Day_2_INDEX_Change', 
			'Day_3_Differ', 'Day_3_Profit', 'Day_3_INDEX_Change', 
			'Day_4_Differ', 'Day_4_Profit', 'Day_4_INDEX_Change', 
			'Day_5_Differ', 'Day_5_Profit', 'Day_5_INDEX_Change', 
			'Day_6_Differ', 'Day_6_Profit', 'Day_6_INDEX_Change', 
			'Day_7_Differ', 'Day_7_Profit', 'Day_7_INDEX_Change', 
			'Day_8_Differ', 'Day_8_Profit', 'Day_8_INDEX_Change', 
			'Day_9_Differ', 'Day_9_Profit', 'Day_9_INDEX_Change', 
			'Day_10_Differ', 'Day_10_Profit', 'Day_10_INDEX_Change' ]
});