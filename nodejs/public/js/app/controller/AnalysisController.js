Ext.define('Datanium.controller.AnalysisController', {
	extend : 'Ext.app.Controller',
	views : [ 'AnalysisView', 'analysis.BasicAnalysis' ],
	stores : [],
	models : [],
	init : function() {
		this.control({
			'basic-analysis' : {
				analysisInit : this.onBasicAnalysisReady
			}
		});
	},
	onBasicAnalysisReady : function() {
		console.log('onBasicAnalysisReady');
		Ext.Msg.alert('Notification', 'This is a Sample of Basic Analysis.');
	}
});