function each(arr, fn) {
	if (arr == null) return;
	for (var i = 0, l = arr.length, t; i < l; i++) {
		t = arr[i];
		if (fn(t, i) === false) break;
	}
}
//url参数和json互相转换 转换后存储在req.query属性中
! function(routefn, stringify) {
	routefn.intes.push(function(req, next) {
		if (req.query) {
			next();
			return;
		}
		req.query = {};
		var urlp = req.path.split('?')[1];
		if (!urlp) {
			next();
			return;
		}
		var a = urlp.split('&');
		var r = {};
		each(a, function(t, i) {
			var b = t.split('=');
			r[b[0]] = b[1];
		});
		req.query = r;
		next();
	});
}(routefn, util.stringify);