//将src目录中的js文件 按照文件名字规则 合并到js文件夹中
var fs = require('fs');
//顺序执行
function sear(arr, call) {
	if (arr && !arr[0]) return;
	! function run(i, para) {
		if (i == arr.length) {
			call(null, para);
			return;
		}
		arr[i](function(err, para) {
			if (err != null) {
				call(err);
				return;
			}

			run(i + 1, para);
		}, para);
	}(0);
}
//遍历 并列执行 结果反馈给回调
function map(arr, fn, call) {
	if (Object.prototype.toString.call(arr) === '[object Array]') {
		var rs = [],
			rerr = null,
			num = 1;
		for (var i = 0, l = arr.length; i < l; i++) {
			! function(t, i) {
				fn(function(err, res) {
					if (err) rerr = err;
					else rs[i] = res;
					if (num++ == l) call(rerr, rs);
				}, t, i);
			}(arr[i], i)
		}
	} else if (Object.prototype.toString.call(arr) === '[object Object]') {
		var keys = [],
			num = 1,
			rs = {},
			rerr = null;
		for (var key in arr) keys.push(key);
		for (var key in arr) {
			! function(t, key) {
				fn(function(err, res) {
					if (err) rerr = err;
					else rs[key] = res;
					if (num++ == keys.length) call(rerr, rs);
				}, t, key);
			}(arr[key], key)
		}
	}
}

function each(arr, fn) {
	for (var i = 0, l = arr.length, t; i < l; i++) {
		t = arr[i];
		if (fn(t, i) === false) break;
	}
}

function delay(fn, dlong) { //延迟执行,确保dlong时间内只执行一次
	dlong = dlong || 20;
	if (fn._intervalid) clearTimeout(fn._intervalid);
	fn._intervalid = setTimeout(fn, dlong);
}
/*
	入口代码
*/
function main() {
	console.time('构建js');
	sear([function(next) {
		fs.readdir(__dirname + '/src', next);
	}, function(next, fiels) {
		var r = {};
		each(fiels, function(t, i) {
			var a = t.split('.');
			if (a[1] != 'js' && a[1] != 'txt') return;
			var b = a[0].split('-');
			if (b.length < 3) return;
			var type = b[1];
			r[type] = r[type] || [];
			r[type].push({
				sort: b[0],
				path: __dirname + '/src/' + t
			});
		});
		for (var key in r) {
			r[key].sort(function(a, b) {
				if (a === 'e') return true;
				if (b === 'e') return false;
				return a - 0 > b - 0
			});
		}
		next(null, r);
	}, function(next, obj) {
		map(obj, function(end, t, key) {
			map(t, function(end1, t1, i1) {
				fs.readFile(t1.path, 'utf-8', end1);
			}, end);
		}, next);
	}, function(next, p) {
		map(p, function(end, t, key) {
			fs.writeFile(__dirname + '/js/' + key + '.js', t.join('\n/*=======================*/\n'), end)
		}, next);
	}], function(err, p) {
		if (err) console.error(err);
		else console.timeEnd('构建js');
	});
}
main();
var cmd = process.argv[2];
if (cmd === 'watch') {
	fs.watch('src', function() {
		delay(main, 1000);
	});
}