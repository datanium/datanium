Ext.define('Datanium.controller.Homepage', {
	extend : 'Ext.app.Controller',
	views : [ 'Toolbar', 'ReportTemplate', 'LeftPanel', 'CubeCombo', 'Accordion', 'DimensionTree', 'MeasureTree',
			'DataPanel', 'InnerToolbar' ],
	models : [ 'CubeName' ],
	stores : [ 'CubeNames' ],
	init : function() {
		this.control({
			'viewport reporttemplate' : {},
			'leftpanel > cubecombo' : {
				change : this.loadTrees
			},
			'inner-toolbar > button[action=grid-mode]' : {
				click : function(btn) {
					Datanium.GlobalData.rptMode = 'grid';
				}
			},
			'inner-toolbar > button[action=chart-mode]' : {
				click : function(btn) {
					Datanium.GlobalData.rptMode = 'chart';
				}
			}
		});

	},

	loadTrees : function(combobox, newValue, oldValue, eOpts) {
		var cubeInfoStore = this.getStore('CubeInfos');
		var leftpanel = Datanium.util.CommonUtils.getCmpInActiveTab('leftpanel');
		var mask = new Ext.LoadMask(leftpanel, {
			msg : "Loading..."
		});
		mask.show();
		cubeInfoStore.load({
			scope : this,
			params : {
				cubeName : combobox.getValue()
			},
			callback : function(records, operation, success) {
				if (success) {
					var tmpstore = records[0];
					var dimensionTree = Datanium.util.CommonUtils.getCmpInActiveTab('dimensionTree');
					var measureTree = Datanium.util.CommonUtils.getCmpInActiveTab('measureTree');
					var dimensionData = {};
					var measureData = {};
					dimensionData.children = tmpstore.data.dimensions;
					dimensionTree.store.setRootNode(dimensionData);
					measureData.children = tmpstore.data.measures;
					measureTree.store.setRootNode(measureData);
					mask.destroy();
				} else {
					console.log('cube loading failed');
					mask.destroy();
				}
			}
		});
	}
});