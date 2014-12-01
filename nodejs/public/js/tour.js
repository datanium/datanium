// Instance the tour
var time = new Date();
var tour = new Tour({
	name : time.getTime(),
	backdrop : false,
	onStart : function() {
		console.log('tour start...');
	},
	onEnd : function() {
		console.log('tour end...');
	},
	steps : [ {
		path : "/",
		element : "#searchBoxAnchor",
		placement : "bottom",
		title : msg_tour_step1_title,
		content : msg_tour_step1_content
	}, {
		path : "/",
		element : "#datasetBox",
		placement : "top",
		title : msg_tour_step2_title,
		content : msg_tour_step2_content
	}, {
		path : "/",
		element : "#dataPanel",
		placement : "left",
		title : msg_tour_step3_title,
		content : msg_tour_step3_content
	}, {
		path : "/",
		element : "#chartViewBtn",
		placement : "bottom",
		title : msg_tour_step4_title,
		content : msg_tour_step4_content
	}, {
		path : "/",
		element : "#apply_filter_btn",
		placement : "left",
		title : msg_tour_step5_title,
		content : msg_tour_step5_content
	},
	// {
	// path : "/",
	// element : "#chartTypeBtn",
	// placement : "right",
	// title : msg_tour_step6_title,
	// content : msg_tour_step6_content
	// },
	{
		path : "/",
		element : "#saveBtn",
		placement : "bottom",
		title : msg_tour_step7_title,
		content : msg_tour_step7_content
	} ]
});

// Initialize the tour
tour.init();

// Start the tour
var checkExist = setInterval(function() {
	if ($('#searchBoxAnchor').length) {
		var page = window.location.pathname.split('/').pop();
		if (page === '') {
			tour.start();
			clearInterval(checkExist);
		}
	}
}, 1000);