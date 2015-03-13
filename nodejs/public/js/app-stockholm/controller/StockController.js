Ext.define('Stockholm.controller.StockController', {
	extend : 'Ext.app.Controller',
	views : [ 'StockGrid' ],
	models : [ 'Quote', 'JobDate' ],
	stores : [ 'Quotes', 'JobDates' ],
	init : function() {
		this.control({
			'stockgrid' : {}
		});
	}
});