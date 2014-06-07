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
		var dimensions = Datanium.GlobalData.queryParam.dimensions;
		var primaryDim = Datanium.GlobalData.queryParam.primaryDimension;
		if (dimensions != null && dimensions.length > 0 && primaryDim != null) {
			var dimSwitch = Ext.getCmp('dimSwitch');
			dimSwitch.menu.removeAll();
			Ext.Array.each(dimensions, function(dim) {
				var iconClsTxt = '';
				if (primaryDim == dim.uniqueName) {
					dimSwitch.setText(dim.text);
					iconClsTxt = 'fa fa-star-o';
				}
				var item = new Ext.menu.Item({
					iconCls : iconClsTxt,
					text : dim.text,
					handler : function() {
						this.parentMenu.ownerButton.setText(dim.text);
						Datanium.util.CommonUtils.markSelection(this);
					}
				});
				dimSwitch.menu.add(item);
			});
		}
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