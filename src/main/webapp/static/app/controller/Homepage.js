Ext.define('Datanium.controller.Homepage', {
	extend : 'Ext.app.Controller',
	views : [ 'Toolbar', 'ReportTemplate', 'LeftPanel', 'CubeCombo', 'Accordion', 'DimensionTree', 'MeasureTree',
			'DataPanel', 'InnerToolbar' ],
	models : [ 'CubeName' ],
	stores : [ 'CubeNames' ],
	init : function() {
		this.control({
			'viewport reporttemplate' : {}
		});
	}
});