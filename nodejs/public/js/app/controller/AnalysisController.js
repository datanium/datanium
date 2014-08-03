Ext.define('Datanium.controller.AnalysisController', {
	extend : 'Ext.app.Controller',
	views : [ 'AnalysisView', 'analysis.DemoAnalysis', 'analysis.AnalysisToolbar' ],
	stores : [ 'DemoAnalysisStats', 'DemoAnalysisTimes', 'DemoAnalysisTimesT', 'DemoAnalysisTimesS',
			'DemoAnalysisTimesR', 'DemoAnalysisTimesF', 'DemoAnalysisCors', 'DemoAnalysisBoxes', 'DemoAnalysisCovs' ],
	models : [ 'DemoAnalysisStat', 'DemoAnalysisTime', 'DemoAnalysisCor', 'DemoAnalysisBox', 'DemoAnalysisCov' ],
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