Ext.define('Datanium.controller.AnalysisController', {
	extend : 'Ext.app.Controller',
	views : [ 'AnalysisView', 'analysis.DemoAnalysis' ],
	stores : [ 'DemoAnalysisStats', 'DemoAnalysisTimes' ],
	models : [ 'DemoAnalysisStat', 'DemoAnalysisTime' ],
	init : function() {
		this.control({
			'demo-analysis' : {
				analysisInit : this.onDemoAnalysisReady
			}
		});
	},
	onDemoAnalysisReady : function() {
		console.log('onDemoAnalysisReady');
		Ext.Msg.alert('Notification', 'This is just a Demo of Analysis View with dummy data.');
	}
});