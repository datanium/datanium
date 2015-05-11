Ext.define('Stockholm.view.MethodFormBox', {
	extend : 'Ext.window.Window',
	alias : 'widget.methodformbox',
	layout : 'fit',
	id : 'methodDetailWindow',
	modal : true,
	title : '新建选股方法',
	items : [],
	dockedItems : [ {
		xtype : 'toolbar',
		border : false,
		dock : 'top',
		enableOverflow : true,
		items : [ {
			id : 'mtd_tb_and',
			scale : 'medium',
			text : 'AND',
			handler : function() {
				var txt = ' and ';
				methodExpUpdate(txt);
			}
		}, {
			id : 'mtd_tb_or',
			scale : 'medium',
			text : 'OR',
			handler : function() {
				var txt = ' or ';
				methodExpUpdate(txt);
			}
		}, {
			id : 'mtd_tb_gt',
			scale : 'medium',
			text : '>',
			handler : function() {
				var txt = '>';
				methodExpUpdate(txt);
			}
		}, {
			id : 'mtd_tb_lt',
			scale : 'medium',
			text : '<',
			handler : function() {
				var txt = '<';
				methodExpUpdate(txt);
			}
		}, {
			id : 'mtd_tb_eq',
			scale : 'medium',
			text : '=',
			handler : function() {
				var txt = '==';
				methodExpUpdate(txt);
			}
		}, {
			id : 'mtd_tb_plus',
			scale : 'medium',
			text : '+',
			handler : function() {
				var txt = '+';
				methodExpUpdate(txt);
			}
		}, {
			id : 'mtd_tb_minus',
			scale : 'medium',
			text : '-',
			handler : function() {
				var txt = '-';
				methodExpUpdate(txt);
			}
		}, {
			id : 'mtd_tb_multi',
			scale : 'medium',
			text : 'x',
			handler : function() {
				var txt = '*';
				methodExpUpdate(txt);
			}
		}, {
			id : 'mtd_tb_div',
			scale : 'medium',
			text : '/',
			handler : function() {
				var txt = '/';
				methodExpUpdate(txt);
			}
		}, {
			id : 'mtd_tb_lft_brac',
			scale : 'medium',
			text : '(',
			handler : function() {
				var txt = ' (';
				methodExpUpdate(txt);
			}
		}, {
			id : 'mtd_tb_rgt_brac',
			scale : 'medium',
			text : ')',
			handler : function() {
				var txt = ') ';
				methodExpUpdate(txt);
			}
		} ]
	}, {
		xtype : 'toolbar',
		border : false,
		dock : 'top',
		enableOverflow : true,
		defaults : {
			menu : [ {
				text : '当天',
				handler : function() {
					var txt = 'day(0).{' + this.parentMenu.ownerButton['val_key'] + '}';
					methodExpUpdate(txt);
				}
			}, {
				text : '前1天',
				handler : function() {
					var txt = 'day(-1).{' + this.parentMenu.ownerButton['val_key'] + '}';
					methodExpUpdate(txt);
				}
			}, {
				text : '前2天',
				handler : function() {
					var txt = 'day(-2).{' + this.parentMenu.ownerButton['val_key'] + '}';
					methodExpUpdate(txt);
				}
			}, {
				text : '前3天',
				handler : function() {
					var txt = 'day(-3).{' + this.parentMenu.ownerButton['val_key'] + '}';
					methodExpUpdate(txt);
				}
			}, {
				text : '前4天',
				handler : function() {
					var txt = 'day(-4).{' + this.parentMenu.ownerButton['val_key'] + '}';
					methodExpUpdate(txt);
				}
			}, {
				text : '前5天',
				handler : function() {
					var txt = 'day(-5).{' + this.parentMenu.ownerButton['val_key'] + '}';
					methodExpUpdate(txt);
				}
			} ]
		},
		items : [ {
			id : 'mtd_tb_open',
			scale : 'medium',
			text : '开盘',
			val_key : 'Open'
		}, {
			id : 'mtd_tb_close',
			scale : 'medium',
			text : '收盘',
			val_key : 'Close'
		}, {
			id : 'mtd_tb_high',
			scale : 'medium',
			text : '最高',
			val_key : 'High'
		}, {
			id : 'mtd_tb_low',
			scale : 'medium',
			text : '最低',
			val_key : 'Low'
		}, {
			id : 'mtd_tb_vol',
			scale : 'medium',
			text : '成交量',
			val_key : 'Volume'
		}, {
			id : 'mtd_tb_change',
			scale : 'medium',
			text : '价格变化(%)',
			val_key : 'Change'
		}, {
			id : 'mtd_tb_vol_change',
			scale : 'medium',
			text : '成交量变化(%)',
			val_key : 'Vol_Change'
		}, {
			id : 'mtd_tb_ma_10',
			scale : 'medium',
			text : '10日均价',
			val_key : 'MA_10'
		}, {
			id : 'mtd_tb_kdj_k',
			scale : 'medium',
			text : 'KDJ指标K',
			val_key : 'KDJ_K'
		}, {
			id : 'mtd_tb_kdj_d',
			scale : 'medium',
			text : 'KDJ指标D',
			val_key : 'KDJ_D'
		}, {
			id : 'mtd_tb_kdj_j',
			scale : 'medium',
			text : 'KDJ指标J',
			val_key : 'KDJ_J'
		} ]
	} ]

});

var methodExpUpdate = function(txt) {
	var exp = Ext.getCmp('methodFormExp');
	var newVal = exp.getValue() + txt;
	exp.setValue(newVal);
	exp.focus();
}