Ext.define('Stockholm.controller.StockController', {
	extend : 'Ext.app.Controller',
	views : [ 'StockGrid', 'DockToolbar', 'MethodBox', 'MethodGrid' ],
	models : [ 'Quote', 'JobDate' ],
	stores : [ 'Quotes', 'JobDates' ],
	init : function() {
		this.control({
			'stockgrid' : {},
			'dock-toolbar > button[action=next-day]' : {
				click : function(btn) {
					var currentSel = Ext.getCmp('dateSelect').getValue();
					var dateStore = Ext.getCmp('dateSelect').getStore().data.items;
					dateStore.forEach(function(item, idx) {
						if (item.data['date_str'] == currentSel) {
							if (dateStore[idx + 1] != null) {
								var combo = Ext.getCmp('dateSelect')
								combo.select(dateStore[idx + 1].data['date_str']);
								combo.fireEvent('select', combo);
							} else {
								console.log("No next!");
							}
						}
					});
				}
			},
			'dock-toolbar > button[action=prev-day]' : {
				click : function(btn) {
					var currentSel = Ext.getCmp('dateSelect').getValue();
					var dateStore = Ext.getCmp('dateSelect').getStore().data.items;
					dateStore.forEach(function(item, idx) {
						if (item.data['date_str'] == currentSel) {
							if (dateStore[idx - 1] != null) {
								var combo = Ext.getCmp('dateSelect')
								combo.select(dateStore[idx - 1].data['date_str']);
								combo.fireEvent('select', combo);
							} else {
								console.log("No previous!");
							}
						}
					});

				}
			},
			'dock-toolbar > button[action=show-basic-st]' : {
				toggle : function(btn) {
					var basicStCol = Ext.getCmp('basicStCol');
					if (btn.pressed) {
						basicStCol.show();
					} else {
						basicStCol.hide();
					}
				}
			},
			'dock-toolbar > button[action=show-adv-st]' : {
				toggle : function(btn) {
					var advStCol = Ext.getCmp('advStCol');
					if (btn.pressed) {
						advStCol.show();
					} else {
						advStCol.hide();
					}
				}
			},
			'dock-toolbar > button[action=show-back-test]' : {
				toggle : function(btn) {
					var backTestCol = Ext.getCmp('backTestCol');
					if (btn.pressed) {
						backTestCol.show();
					} else {
						backTestCol.hide();
					}
				}
			},
			'dock-toolbar > button[action=run-test]' : {
				click : function(btn) {
					var mask = new Ext.LoadMask(Ext.getBody(), {
						msg : '正在执行...'
					});
					mask.show();
					var requestConfig = {
						url : '/stockholm/runtest',
						timeout : 300000,
						success : function(response) {
							mask.destroy();
							var result = Ext.JSON.decode(response.responseText, true);
							Ext.Msg.alert('结果', result['msg']);

						},
						failure : function() {
							mask.destroy();
							Ext.Msg.alert('结果', '发生未知错误...');
						}
					};
					Ext.Ajax.request(requestConfig);
				}
			},
			'dock-toolbar > button[action=show-method]' : {
				click : function(btn) {
					var mask = new Ext.LoadMask(Ext.getBody(), {
						msg : '处理中...'
					});
					mask.show();
					var requestConfig = {
						url : '/stockholm/methods/load',
						timeout : 300000,
						success : function(response) {
							mask.destroy();
							var result = Ext.JSON.decode(response.responseText, true);
							console.log(result);
							Ext.create('widget.methodbox').show();
						},
						failure : function() {
							mask.destroy();
							Ext.Msg.alert('结果', '发生未知错误...');
						}
					};
					Ext.Ajax.request(requestConfig);
				}
			}
		});
	}
});