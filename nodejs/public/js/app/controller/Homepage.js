Ext.define('Datanium.controller.Homepage', {
	extend : 'Ext.app.Controller',
	views : [ 'Toolbar', 'ReportTemplate', 'LeftPanel', 'CubeCombo', 'IndicatorSearchCombo', 'Accordion',
			'DimensionTree', 'MeasureTree', 'ElementPanel', 'DataPanel', 'InnerToolbar' ],
	models : [ 'CubeName', 'Indicator' ],
	stores : [ 'CubeNames', 'Indicators' ],
	init : function() {
		this.control({
			'viewport reporttemplate' : {},
			'leftpanel > cubecombo' : {
				select : this.loadTrees
			},
			'leftpanel > searchcombo' : {
				select : this.addIndicator
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
					Datanium.GlobalData.queryParam = {
						dimensions : [],
						measures : [],
						groups : []
					};
					Datanium.GlobalData.QueryResult = null;
					Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent('refreshElementPanel');
				}
			},
			'inner-toolbar > button[action=auto-run]' : {
				click : function(btn) {
					if (btn.pressed) {
						Datanium.GlobalData.autoRun = true;
					} else {
						Datanium.GlobalData.autoRun = false;
					}
				}
			},
			'inner-toolbar > button[action=manual-run]' : {
				click : function(btn) {
					this.getController('GridController').generateRpt(true);
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
	},
	addIndicator : function(combobox, newValue, oldValue, eOpts) {
		var leftpanel = Datanium.util.CommonUtils.getCmpInActiveTab('leftpanel');
		var mask = new Ext.LoadMask(leftpanel, {
			msg : "Loading..."
		});
		mask.show();
		var requestConfig = {
			url : '/rest/indicator/map?idc=' + combobox.getValue(),
			timeout : 300000,
			success : function(response) {
				mask.destroy();
				var result = Ext.JSON.decode(response.responseText, true);
				Datanium.GlobalData.qubeInfo.dimensions = Datanium.util.CommonUtils.pushElements2Array(
						result.dimensions, Datanium.GlobalData.qubeInfo.dimensions);				
				Datanium.GlobalData.qubeInfo.measures = Datanium.util.CommonUtils.pushElements2Array(result.measures,
						Datanium.GlobalData.qubeInfo.measures);				
				Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent('refreshElementPanel');
			},
			failure : function() {
				mask.destroy();
			}
		};
		if(this.isValidMeasures()){
		Ext.Ajax.request(requestConfig);
		}else{
			Ext.MessageBox.alert("Alert","Sorry, you cannot add more than 10 measures!");
			mask.destroy();
		}

	},
	isValidMeasures : function() {
		var measures = Datanium.GlobalData.qubeInfo.measures;
		if(measures.length>=10){
			return false;
		}else{
			return true;
		}
	}
	
});