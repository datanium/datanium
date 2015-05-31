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
	collapsible : true,
	autoScroll : true,
	multiSelect : true,
	viewConfig : {
		stripeRows : true,
		enableTextSelection : true
	},

	initComponent : function() {
		this.columns = [ {
			text : '代码',
			width : 75,
			align : 'center',
			sortable : true,
			locked : true,
			dataIndex : 'Symbol',
			renderer : function(val) {
				var url = "http://q.stock.sohu.com/cn/" + val.substr(0, 6) + "/index.shtml";
				return '<a href="' + url + '" target="_blank" style="text-decoration: none">' + val + '</a>';
			}
		}, {
			text : '名称',
			width : 70,
			align : 'center',
			sortable : true,
			locked : true,
			dataIndex : 'Name'
		}, {
			text : '日期',
			width : 75,
			align : 'center',
			sortable : true,
			locked : true,
			// renderer : Ext.util.Format.dateRenderer('m/d/Y'),
			dataIndex : 'Date'
		}, {
			text : '选股方法',
			width : 85,
			align : 'center',
			sortable : true,
			locked : true,
			dataIndex : 'Method'
		}, {
			text : '基本指标',
			id : 'basicStCol',
			defaults : {
				sortable : true,
				lockable : false
			},
			columns : [ {
				text : '类型',
				width : 55,
				align : 'center',
				dataIndex : 'Type'
			}, {
				text : '收盘价',
				width : 55,
				align : 'right',
				dataIndex : 'Close'
			}, {
				text : '涨跌',
				width : 55,
				align : 'right',
				dataIndex : 'Change',
				renderer : convertRatio
			} ]
		}, {
			text : '详细技术指标',
			id : 'advStCol',
			hidden : true,
			defaults : {
				align : 'right',
				sortable : true,
				hidden : true,
				lockable : false
			},
			columns : [ {
				text : '成交量变化',
				width : 70,
				dataIndex : 'Vol_Change',
				renderer : convertRatio
			}, {
				text : '5日均线',
				width : 70,
				dataIndex : 'MA_5'
			}, {
				text : '10日均线',
				width : 70,
				dataIndex : 'MA_10'
			}, {
				text : '20日均线',
				width : 70,
				dataIndex : 'MA_20'
			}, {
				text : '30日均线',
				width : 70,
				dataIndex : 'MA_30'
			}, {
				text : 'KDJ/K',
				width : 50,
				renderer : convertFloat,
				dataIndex : 'KDJ_K'
			}, {
				text : 'KDJ/D',
				width : 50,
				renderer : convertFloat,
				dataIndex : 'KDJ_D'
			}, {
				text : 'KDJ/J',
				width : 50,
				renderer : convertFloat,
				dataIndex : 'KDJ_J'
			} ]
		}, {
			text : '收益回测',
			id : 'backTestCol',
			defaults : {
				width : 95,
				align : 'right',
				sortable : true,
				lockable : false,
				renderer : convertRatio
			},
			columns : [ {
				text : '1天实际收益 %',
				dataIndex : 'Day_1_Profit'
			}, {
				text : '2天实际收益 %',
				dataIndex : 'Day_2_Profit'
			}, {
				text : '3天实际收益 %',
				dataIndex : 'Day_3_Profit'
			}, {
				text : '4天实际收益 %',
				dataIndex : 'Day_3_Profit'
			}, {
				text : '5天实际收益 %',
				dataIndex : 'Day_5_Profit'
			}, {
				text : '6天实际收益 %',
				dataIndex : 'Day_5_Profit'
			}, {
				text : '7天实际收益 %',
				dataIndex : 'Day_5_Profit'
			}, {
				text : '8天实际收益 %',
				dataIndex : 'Day_5_Profit'
			}, {
				text : '9天实际收益 %',
				dataIndex : 'Day_9_Profit'
			}, {
				text : '10天实际收益 %',
				dataIndex : 'Day_9_Profit'
			} ]
		}, {
			text : '收益回测',
			id : 'backTestCol_all',
			hidden : true,
			defaults : {
				width : 95,
				align : 'right',
				sortable : true,
				lockable : false,
				renderer : convertRatio
			},
			columns : [ {
				text : '1天相对收益 %',
				dataIndex : 'Day_1_Differ'
			}, {
				text : '1天沪深300变化 %',
				dataIndex : 'Day_1_INDEX_Change'
			}, {
				text : '1天实际收益 %',
				dataIndex : 'Day_1_Profit'
			}, {
				text : '2天相对收益 %',
				dataIndex : 'Day_2_Differ'
			}, {
				text : '2天沪深300变化 %',
				dataIndex : 'Day_2_INDEX_Change'
			}, {
				text : '2天实际收益 %',
				dataIndex : 'Day_2_Profit'
			}, {
				text : '3天相对收益 %',
				dataIndex : 'Day_3_Differ'
			}, {
				text : '3天沪深300变化 %',
				dataIndex : 'Day_3_INDEX_Change'
			}, {
				text : '3天实际收益 %',
				dataIndex : 'Day_3_Profit'
			}, {
				text : '4天相对收益 %',
				dataIndex : 'Day_3_Differ'
			}, {
				text : '4天沪深300变化 %',
				dataIndex : 'Day_3_INDEX_Change'
			}, {
				text : '4天实际收益 %',
				dataIndex : 'Day_3_Profit'
			}, {
				text : '5天相对收益 %',
				dataIndex : 'Day_5_Differ'
			}, {
				text : '5天沪深300变化 %',
				dataIndex : 'Day_5_INDEX_Change'
			}, {
				text : '5天实际收益 %',
				dataIndex : 'Day_5_Profit'
			}, {
				text : '6天相对收益 %',
				dataIndex : 'Day_5_Differ'
			}, {
				text : '6天沪深300变化 %',
				dataIndex : 'Day_5_INDEX_Change'
			}, {
				text : '6天实际收益 %',
				dataIndex : 'Day_5_Profit'
			}, {
				text : '7天相对收益 %',
				dataIndex : 'Day_5_Differ'
			}, {
				text : '7天沪深300变化 %',
				dataIndex : 'Day_5_INDEX_Change'
			}, {
				text : '7天实际收益 %',
				dataIndex : 'Day_5_Profit'
			}, {
				text : '8天相对收益 %',
				dataIndex : 'Day_5_Differ'
			}, {
				text : '8天沪深300变化 %',
				dataIndex : 'Day_5_INDEX_Change'
			}, {
				text : '8天实际收益 %',
				dataIndex : 'Day_5_Profit'
			}, {
				text : '9天相对收益 %',
				dataIndex : 'Day_9_Differ'
			}, {
				text : '9天沪深300变化 %',
				dataIndex : 'Day_9_INDEX_Change'
			}, {
				text : '9天实际收益 %',
				dataIndex : 'Day_9_Profit'
			}, {
				text : '10天相对收益 %',
				dataIndex : 'Day_9_Differ'
			}, {
				text : '10天沪深300变化 %',
				dataIndex : 'Day_9_INDEX_Change'
			}, {
				text : '10天实际收益 %',
				dataIndex : 'Day_9_Profit'
			} ]
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