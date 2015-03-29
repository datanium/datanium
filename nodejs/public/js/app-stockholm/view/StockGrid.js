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
			dataIndex : 'Symbol',
			renderer : function(val) {
				var url = "http://q.stock.sohu.com/cn/" + val.substr(0, 6) + "/index.shtml";
				return '<a href="' + url + '" target="_blank" style="text-decoration: none">' + val + '</a>';
			}
		}, {
			text : '名称',
			width : 70,
			sortable : true,
			dataIndex : 'Name'
		}, {
			text : '日期',
			width : 75,
			sortable : true,
			// renderer : Ext.util.Format.dateRenderer('m/d/Y'),
			dataIndex : 'Date'
		}, {
			text : '收盘价',
			width : 55,
			align : 'right',
			sortable : true,
			dataIndex : 'Close'
		}, {
			text : '涨跌',
			width : 55,
			align : 'right',
			sortable : true,
			dataIndex : 'Change',
			renderer : convertRatio
		}, {
			text : '成交量变化',
			width : 70,
			align : 'right',
			sortable : true,
			dataIndex : 'Vol_Change',
			renderer : convertRatio
		}, {
			text : '10天均线',
			width : 70,
			align : 'right',
			sortable : true,
			dataIndex : 'MA_10'
		}, {
			text : 'KDJ/K',
			width : 50,
			sortable : true,
			align : 'right',
			renderer : convertFloat,
			dataIndex : 'KDJ_K',
			hidden : true
		}, {
			text : 'KDJ/D',
			width : 50,
			sortable : true,
			align : 'right',
			renderer : convertFloat,
			dataIndex : 'KDJ_D',
			hidden : true
		}, {
			text : 'KDJ/J',
			width : 50,
			sortable : true,
			align : 'right',
			renderer : convertFloat,
			dataIndex : 'KDJ_J',
			hidden : true
		}, {
			text : '1天相对收益 %',
			width : 95,
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_1_Differ'
		}, {
			text : '1天沪深300变化 %',
			width : 95,
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_1_INDEX_Change'
		}, {
			text : '1天实际收益 %',
			width : 95,
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_1_Profit'
		}, {
			text : '3天相对收益 %',
			width : 95,
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_3_Differ'
		}, {
			text : '3天沪深300变化 %',
			width : 95,
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_3_INDEX_Change'
		}, {
			text : '3天实际收益 %',
			width : 95,
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_3_Profit'
		}, {
			text : '5天相对收益 %',
			width : 95,
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_5_Differ'
		}, {
			text : '5天沪深300变化 %',
			width : 95,
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_5_INDEX_Change'
		}, {
			text : '5天实际收益 %',
			width : 95,
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_5_Profit'
		}, {
			text : '9天相对收益 %',
			width : 95,
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_9_Differ'
		}, {
			text : '9天沪深300变化 %',
			width : 95,
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_9_INDEX_Change'
		}, {
			text : '9天实际收益 %',
			width : 95,
			sortable : true,
			align : 'right',
			renderer : convertRatio,
			dataIndex : 'Day_9_Profit'
		} ];

		this.dockedItems.push({
			xtype : 'pagingtoolbar',
			store : this.store,
			dock : 'bottom',
			displayInfo : true,
			listeners : {
				afterrender : function() {
					Ext.Array.each(this.items.items, function(item) {
						item.hide();
					});
					this.child('tbfill').show();
					this.child('#displayItem').show();
				}
			}
		});
		this.callParent();
	}
});