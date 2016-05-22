//内置中间件
! function(routefn, util, win) {
	function forword(path, obj) {
		var req = this;
		req.path = util.getPath("#" + path);
		req.query = obj;
		req.next(0);
	}

	function redirect(path, obj) {
		if (path.indexOf('?') === -1 && obj) {
			path += '?' + util.stringify(obj);
		}
		win.location.hash = path;
	}
	routefn.intes.push(function(req, next) {
		req.forword = forword;
		req.redirect = redirect;
		next();
	});
}(routefn, util, this);