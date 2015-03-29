Ext.define('Stockholm.controller.StockController', {
	extend : 'Ext.app.Controller',
	views : [ 'StockGrid', 'DockToolbar' ],
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
			}
		});
	}
});