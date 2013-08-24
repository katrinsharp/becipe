define([
    'jquery',
    'cookie'
], function ($, cookie) {
	var redirectToLogin = function () {
		var locationhref = "user/login";
		var wHash = window.location.hash;
		if (wHash && wHash.length > 0) {
			locationhref = locationhref + "/" + wHash.substring(1);
		}
		//location.href = locationhref;
		window.location.hash = locationhref;
	};

	var $doc = $(document);
	$doc.ajaxSend(function (event, xhr) {
		console.log("ajaxSend: " + event.currentTarget.URL);
		var authToken = $.cookie('token');
		if (authToken) {
			xhr.setRequestHeader("token", authToken);
		}
	});

	$doc.ajaxError(function (event, xhr) {
		if (xhr.status == 401) {
			console.log("ajaxError");
			redirectToLogin();
		}
	});
});