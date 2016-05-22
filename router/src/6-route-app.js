var app = routefn();
app.use(function(req, next) {
	var path = window.decodeURI(req.path);
	req.path = path;
	next();
})
app.start = function() {
	window.onhashchange = function() {
		var path = util.getPath(location.href);
		app.run(path);
	}
	var path = util.getPath(location.href);
	app.run(path);
}