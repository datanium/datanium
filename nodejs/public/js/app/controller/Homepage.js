Ext.define('Datanium.controller.Homepage', {
	extend : 'Ext.app.Controller',
	views : [ 'Toolbar', 'ReportTemplate', 'LeftPanel', 'IndicatorSearchCombo', 'Accordion', 'ElementPanel',
			'DataPanel', 'InnerToolbar', 'SearchBox' ],
	models : [ 'Indicator' ],
	stores : [ 'Indicators' ],
	init : function() {
		this.control({
			'viewport reporttemplate' : {},
			'searchcombo' : {
				select : this.addIndicator
			},
			'inner-toolbar > button[action=grid-mode]' : {
				toggle : function(btn) {
					if (Datanium.GlobalData.rptMode != 'grid') {
						Datanium.GlobalData.rptMode = 'grid';
						Datanium.util.CommonUtils.getCmpInActiveTab('datapanel').getLayout().setActiveItem(0);
					}
				}
			},
			'inner-toolbar > button[action=chart-mode]' : {
				toggle : function(btn) {
					if (Datanium.GlobalData.rptMode != 'chart') {
						Datanium.GlobalData.rptMode = 'chart';
						Datanium.util.CommonUtils.getCmpInActiveTab('datapanel').getLayout().setActiveItem(1);
					}
				}
			},
			'inner-toolbar > button[action=analysis-mode]' : {
				toggle : function(btn) {
					if (Datanium.GlobalData.rptMode != 'analysis') {
						Datanium.GlobalData.rptMode = 'analysis';
						Datanium.util.CommonUtils.getCmpInActiveTab('datapanel').getLayout().setActiveItem(2);
						Datanium.util.CommonUtils.getCmpInActiveTab('demo-analysis').fireEvent('analysisInit');
					}
				}
			},
			'inner-toolbar > button[action=clear]' : {
				click : function(btn) {
					Datanium.util.CommonUtils.cleanData();
				}
			},
			'inner-toolbar > button[action=show-fields]' : {
				toggle : function(btn) {
					var fieldpanel = Datanium.util.CommonUtils.getCmpInActiveTab('fieldpanel');
					if (btn.pressed) {
						fieldpanel.show();
					} else {
						fieldpanel.hide();
					}
				}
			},
			'inner-toolbar > button[action=auto-run]' : {
				toggle : function(btn) {
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
	addIndicator : function(combobox) {
		var key = null;
		var dim_key = null;
		var dim_value = null;
		if (typeof combobox === 'object') {// from extjs combobox
		// var keys = combobox.getValue().split('///');
		// if (keys.length > 1) {
		// dim_key = keys[1];
		// dim_value = keys[2];
		// }
		// key = keys[0];
			key = combobox.getValue();
		}
		if (typeof combobox === 'string') // from outside page search box
			key = combobox
		var leftpanel = Datanium.util.CommonUtils.getCmpInActiveTab('leftpanel');
		var mask = new Ext.LoadMask(leftpanel, {
			msg : "Loading..."
		});
		mask.show();
		if (dim_key !== null) {
			// to be added: apply filter directly base on keyword
		}
		var requestConfig = {
			url : '/rest/indicator/map?idc=' + key,
			timeout : 300000,
			success : function(response) {
				mask.destroy();
				var result = Ext.JSON.decode(response.responseText, true);
				Datanium.GlobalData.qubeInfo.dimensions = Datanium.util.CommonUtils.pushElements2Array(
						result.dimensions, Datanium.GlobalData.qubeInfo.dimensions);
				Datanium.GlobalData.qubeInfo.measures = Datanium.util.CommonUtils.pushElements2Array(result.measures,
						Datanium.GlobalData.qubeInfo.measures);
				// clean up the query param/result when adding indicator.
				// should enhance this to keeping param in the future.
				// Datanium.util.CommonUtils.cleanData();
				Datanium.util.CommonUtils.getCmpInActiveTab('elementPanel').fireEvent('refreshElementPanel',
						result.measures);
				Datanium.util.CommonUtils.checkEnableFilter();
			},
			failure : function() {
				mask.destroy();
			}
		};
		if (this.isValidMeasures()) {
			Ext.Ajax.request(requestConfig);
		} else {
			Ext.MessageBox.alert("Alert", "Sorry, you cannot add more than 10 measures.");
			mask.destroy();
		}
	},
	isValidMeasures : function() {
		var measures = Datanium.GlobalData.qubeInfo.measures;
		if (measures.length >= 10) {
			return false;
		} else {
			return true;
		}
	}
});