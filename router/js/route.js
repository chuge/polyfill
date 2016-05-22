!function(root,fn){
	if (typeof exports === 'object') {
        // Node.
        module.exports = fn.call(root);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function(){ return fn.call(root) });
    } else {
        // Browser globals (root is window)
        root.diqye = fn.call(root);
    }
}(this,function(){

/*=======================*/
//数据类型判断
var util = (function() {
	var type = (function() {
		var r = {},
			types = ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Array'];
		for (var i = 0, t; t = types[i++];) {
			! function(t) {
				r['is' + t] = function(obj) {
					return Object.prototype.toString.call(obj) === '[object ' + t + ']';
				}
			}(t)
		}
		return r;
	})();

	function getPath(url) {
		var path = url.split("#")[1];
		if (!path) return "/";
		if (path.charAt(0) != "/") path = "/" + path;
		return path;
	}

	function stringify(obj) {
		var a = [];
		for (key in obj) {
			a.push(key + '=' + obj[key]);
		}
		return a.join('&')
	}

	function onefn(fn) {
		var exec = false;
		return function() {
			if (exec) return;
			exec = true;
			fn.apply(this, [].slice.call(arguments, 0));
		}
	}

	function curry(fn) { //函数柯里化
		var args = [].slice.call(arguments, 1);
		return function() {
			var newArgs = args.concat([].slice.call(arguments));
			return fn.apply(this, newArgs);
		}
	}

	return {
		type: type,
		getPath: getPath,
		stringify: stringify,
		onefn: onefn,
		curry: curry
	}
}());
/*=======================*/
var routefn = (function(util) {
	var p = {
		defaults: {
			type: 'route'
		},
		emptyfn: function() {}
	}

	function mix(origin, nobj, iscall) {
		for (var key in nobj) {
			nval = nobj[key];
			if (iscall && util.type.isFunction(nval)) {
				nval = nval(origin);
			}
			origin[key] = nval;
		}
		return origin;
	}

	function rfn() {
		var p1 = {
			intes: []
		}
		for (var i = 0, l = rfn.intes.length; i < l; i++) p1.intes.push(rfn.intes[i]);

		function run(path, next1) {
			var req = {
					path: path
				},
				hlen = p1.intes.length;
			/*
				执行拦截器链（中间件）
				i 当前拦截器的索引
				ignore 需要忽略的拦截器
			*/
			! function intec(i, ignore) {
				if (i >= p1.intes.length) {
					if (next1) next1();
					return;
				}
				if (i === ignore) {
					intec(i + 1);
					return;
				}
				var next = util.onefn(function(start) {
					if (start != null) {
						intec(start, i)
						return;
					}
					intec(i + 1);
				});
				req.next = next;
				p1.intes[i](req, next);
			}(0);
		}

		return mix({
			run: run,
			intes: p1.intes
		}, p.defaults, true);
	}
	rfn.mix = function(nobj) {
		if (util.type.isString(nobj)) {
			return p.defaults[nobj];
		}
		mix(p.defaults, nobj);
	}
	rfn.intes = []; //全局中间件
	return rfn;
}(util));
/*=======================*/
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
/*=======================*/
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
/*=======================*/
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
/*=======================*/
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
/*=======================*/
	return {
        app:app,
		routefn:routefn
    }
});
