Ext.define('Datanium.controller.Homepage', {
	extend : 'Ext.app.Controller',
	views : [ 'Toolbar', 'ReportTemplate', 'LeftPanel', 'CubeCombo', 'Accordion', 'DimensionTree', 'MeasureTree',
			'ElementPanel', 'DataPanel', 'InnerToolbar' ],
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
					if (Datanium.GlobalData.rptMode != 'grid') {
						Datanium.GlobalData.rptMode = 'grid';
						Datanium.util.CommonUtils.getCmpInActiveTab('datapanel').getLayout().setActiveItem(0);
					}
				}
			},
			'inner-toolbar > button[action=chart-mode]' : {
				click : function(btn) {
					if (Datanium.GlobalData.rptMode != 'chart') {
						Datanium.GlobalData.rptMode = 'chart';
						Datanium.util.CommonUtils.getCmpInActiveTab('datapanel').getLayout().setActiveItem(1);
					}
				}
			},
			'inner-toolbar > button[action=clear]' : {
				click : function(btn) {

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
					console.log(tmpstore);
					var dimensionTree = Datanium.util.CommonUtils.getCmpInActiveTab('dimensionTree');
					var measureTree = Datanium.util.CommonUtils.getCmpInActiveTab('measureTree');
					var dimensionData = {};
					var measureData = {};
					dimensionData.children = tmpstore.data.dimensions;
					dimensionTree.store.setRootNode(dimensionData);
					measureData.children = tmpstore.data.measures;
					measureTree.store.setRootNode(measureData);
					Datanium.GlobalData.qubeInfo.dimensions = tmpstore.data.dimensions;
					Datanium.GlobalData.qubeInfo.measures = tmpstore.data.measures;
					Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent('refreshElementPanel');
					mask.destroy();
				} else {
					console.log('cube loading failed');
					mask.destroy();
				}
			}
		});
	}
});