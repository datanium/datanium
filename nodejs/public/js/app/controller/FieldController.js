Ext.define('Datanium.controller.FieldController', {
	extend : 'Ext.app.Controller',
	views : [ 'DimensionTree', 'MeasureTree', 'ElementPanel', 'FieldPanel', 'FieldToolBar' ],
	stores : [],
	models : [],
	init : function() {
		this.control({
			'elementPanel' : {
				selectionChange : this.elementSelChange
			}
		});
	},
	elementSelChange : function(me) {
		console.log('elementSelChange');
		this.getController('GridController').generateRpt();
	}
});