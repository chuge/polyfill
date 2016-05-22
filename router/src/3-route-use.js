// 各种路由实现
! function(mix, TYPE) {
	//获取处理后的path  去掉问好 和多余的/
	function pathfn(path) {
		var a = path.split('?');
		if (a[1]) path = a[0];
		path = path.split('//').join('/');
		return path;
	}
	//function interceptor
	function get1(fn, cb) {
		return function(req, next) {
			if (fn(pathfn(req.path))) cb(req, next);
			else next();
		}
	}
	//regExp interceptor
	function get2(reg, cb) {
		return function(req, next) {
			reg.lastIndex = 0;
			var para = reg.exec(pathfn(req.path));
			if (para) {
				req.para = para;
				cb(req, next);
			} else next();
		}
	}
	//:xxx  xxx是可以扩展的
	function get3(ps, cb) {
		var reg = use.type[ps[1]];
		return function(req, next) {
			var path = pathfn(req.path);
			var para = path.substr(ps[0].length);
			if (pathfn(req.path).indexOf(ps[0]) == 0 && reg.test(para)) {
				req.para = para;
				cb(req, next);
			} else next();
		}
	}
	//通配符  /xxxx*  *后面不允许有字符
	function get4(os, cb) {
		return function(req, next) {
			if (pathfn(req.path).indexOf(os[0]) == 0) cb(req, next);
			else next();
		}
	}
	//string interceptor
	function get5(path, cb) {
		var isroute = cb && cb.type == 'route';
		return function(req, next) {
			var rpath = pathfn(req.path)
			if (isroute) { //如果 cb是路由
				if (rpath.indexOf(path) == 0) {
					cb.run(util.getPath('#' + rpath.substr(path.length)), next);
				} else next();
				return;
			}
			if (path == pathfn(req.path)) {
				cb(req, next);
			} else next();
		}
	}

	function use(self) {
		return function(path, cb) {
			if (TYPE.isArray(path)) {
				for (var i = 0, l = path.length; i < l; i++) arguments.callee(path[i]);
				return;
			}
			if (TYPE.isArray(cb)) {
				for (var i = 0, l = cb.length; i < l; i++) arguments.callee(path, cb[i]);
				return;
			}
			//匹配路径支持的7中情况
			if (path && path.type == 'route') {
				self.intes.push(function(req, next) {
					path.run(req.path, next);
				});
				return;
			}
			if (TYPE.isFunction(path) && cb == null) {
				self.intes.push(path);
				return;
			}

			function throwerr() {
				if (cb && cb.type == 'route') {
					if (window.console) console.warn('use函数  第一个参数必须为字符串 第二个参数才能是路由')
					return true;
				}
			}
			if (TYPE.isFunction(path)) {
				if (throwerr()) return;
				self.intes.push(get1(path, cb));
			}
			if (TYPE.isRegExp(path)) {
				if (throwerr()) return;
				self.intes.push(get2(path, cb));
			}
			if (!TYPE.isString(path)) {
				return;
			}
			var a = path.split(':');
			if (a.length != 1) {
				if (throwerr()) return;
				self.intes.push(get3(a, cb));
				return;
			}
			var b = path.split('*');
			if (b.length != 1) {
				if (throwerr()) return;
				self.intes.push(get4(b, cb));
				return;
			}
			self.intes.push(get5(path, cb));
		}
	}
	//可以通过 routefn.mix('use').type.newtyep=/reg/..扩展
	use.type = {
		'number': /^\d+$/,
		'string': /^[^\/]+$/,
		'date': /^[0-9]{8,8}$/
	};
	mix({
		use: use
	});
}(routefn.mix, util.type);