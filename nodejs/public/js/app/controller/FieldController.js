Ext.define('Datanium.controller.FieldController', {
	extend : 'Ext.app.Controller',
	views : [ 'DimensionTree', 'MeasureTree', 'ElementPanel', 'FieldPanel', 'FieldToolBar', 'FilterBox' ],
	stores : [],
	models : [],
	init : function() {
		this.control({
			'elementPanel' : {
				selectionChange : this.elementSelChange,
				popFilter : this.searchDimensionValue,
				submitFilter : this.submitFilter
			}
		});
	},
	elementSelChange : function(me) {
		console.log('elementSelChange');
		this.getController('GridController').generateRpt();
	},
	searchDimensionValue : function(key, name) {
		console.log('searchDimensionValue');
		var tab = Datanium.util.CommonUtils.getCurrentTab();
		var mask = new Ext.LoadMask(tab, {
			msg : "Loading..."
		});
		mask.show();
		Datanium.GlobalData.dimensionValues = [];
		Datanium.GlobalData.popDimensionKey = null;
		Datanium.GlobalData.popDimension = null;
		var requestConfig = {
			url : '/rest/dimension/search?dim=' + key,
			timeout : 300000,
			success : function(response) {
				mask.destroy();
				var result = Ext.JSON.decode(response.responseText, true);
				Datanium.GlobalData.dimensionValues = result.dimensionValues;
				Datanium.GlobalData.popDimensionKey = key;
				Datanium.GlobalData.popDimension = name;
				Ext.create('widget.filterbox').show();
			},
			failure : function() {
				mask.destroy();
			}
		};
		Ext.Ajax.request(requestConfig);

	},
	submitFilter : function() {
		console.log('submitFilter');
		this.getController('GridController').generateRpt(true);
	}
});