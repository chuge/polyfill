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