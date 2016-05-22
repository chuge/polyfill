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