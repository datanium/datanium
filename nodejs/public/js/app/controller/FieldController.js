Ext.define('Datanium.controller.FieldController', {
	extend : 'Ext.app.Controller',
	views : [ 'ElementPanel', 'FieldPanel', 'FieldToolBar', 'FilterBox' ],
	stores : [],
	models : [],
	init : function() {
		this.control({
			'elementPanel' : {
				selectionChange : this.elementSelChange,
				popFilter : this.searchDimensionValue,
				submitFilter : this.submitFilter,
				popDesc : this.loadIndicatorValue
			}
		});
	},
	elementSelChange : function(me) {
		console.log('elementSelChange');
		this.getController('ChartController').reloadDimSwitchMenu()
		this.getController('GridController').generateRpt();
	},
	searchDimensionValue : function(key, name) {
		console.log('searchDimensionValue');
		var tab = Datanium.util.CommonUtils.getCurrentTab();
		var mask = new Ext.LoadMask(tab, {
			msg : Datanium.GlobalStatic.label_loading
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
		Datanium.util.CommonUtils.updateFilterFields();
		this.getController('GridController').generateRpt(true);
		this.getController('ChartController').reloadFilterSwitchMenu();
	},
	loadIndicatorValue : function(key, name) {
		console.log('loadIndicatorValue');
		var measures = Datanium.GlobalData.qubeInfo.measures;
		Ext.Array.forEach(measures, function(m) {
			if (m.uniqueName == key) {
				var desc = m.source_note;
				var title = m.data_source;
				if (desc == null || desc.length == 0) {
					desc = Datanium.GlobalStatic.label_no_desc;
				}
				Ext.Msg.alert(title, desc);
				return;
			}
		});
	}
});