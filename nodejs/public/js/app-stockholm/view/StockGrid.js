var convertRatio = function(val) {
	if (typeof (val) == 'number') {
		val = (val * 100).toFixed(2);
		if (val > 0) {
			return '<span style="color:' + '#cf4c35' + '">' + val + '%</span>';
		} else if (val < 0) {
			return '<span style="color:' + '#73b51e' + ';">' + val + '%</span>';
		}
	}
	return val;
};

var convertFloat = function(val) {
	if (typeof (val) == 'number') {
		val = val.toFixed(2);
	}
	return val;
};

Ext.define('Stockholm.view.StockGrid', {
	extend : 'Ext.grid.Panel',
	xtype : 'stockgrid',
	store : 'Quotes',
	stateful : true,
	collapsible : true,
	autoScroll : true,
	multiSelect : true,
	stateId : 'stateGrid',
	title : '程序推荐选股组合',
	viewConfig : {
		stripeRows : true,
		enableTextSelection : true
	},

	initComponent : function() {
		this.columns = [ {
			text : '代码',
			width : 75,
			sortable : true,
			dataIndex : 'Symbol'
		}, {
			text : '名称',
			sortable : true,
			dataIndex : 'Name'
		}, {
			text : '日期',
			width : 75,
			sortable : true,
			// renderer : Ext.util.Format.dateRenderer('m/d/Y'),
			dataIndex : 'Date'
		}, {
			text : '价格',
			width : 75,
			align : 'right',
			sortable : true,
			dataIndex : 'Close'
		}, {
			text : 'KDJ/K',
			width : 75,
			sortable : true,
			align : 'right',
			renderer : convertFloat,
			dataIndex : 'KDJ_K'
		}, {
			text : 'KDJ/D',
			width : 75,
			sortable : true,
			align : 'right',
			renderer : convertFloat,
			dataIndex : 'KDJ_D'
		}, {
			text : 'KDJ/J',
			width : 75,
			sortable : true,
			align : 'right',
			renderer : convertFloat,
			dataIndex : 'KDJ_J'
		}, {
			text : '1天相对收益（%）',
			width : 'auto',
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_1_Differ'
		}, {
			text : '1天沪深300变化（%）',
			width : 'auto',
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_1_INDEX_Change'
		}, {
			text : '1天实际收益（%）',
			width : 'auto',
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_1_Profit'
		}, {
			text : '3天相对收益（%）',
			width : 'auto',
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_3_Differ'
		}, {
			text : '3天沪深300变化（%）',
			width : 'auto',
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_3_INDEX_Change'
		}, {
			text : '3天实际收益（%）',
			width : 'auto',
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_3_Profit'
		}, {
			text : '9天相对收益（%）',
			width : 'auto',
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_9_Differ'
		}, {
			text : '9天沪深300变化（%）',
			width : 'auto',
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_9_INDEX_Change'
		}, {
			text : '9天实际收益（%）',
			width : 'auto',
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_9_Profit'
		} ];

		this.callParent();
	}
});