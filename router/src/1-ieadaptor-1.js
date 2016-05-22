! function() {
	//判断浏览器版本
	var version = navigator.appVersion || '';
	//虽然上面写了ie6 但是并不在ie6上面做测试， ie6可能还要修复indexOf函数
	if (!version.indexOf('MSIE 6.0') || !version.indexOf('MSIE 7.0')) return;
	var lasturl = window.location.href;
	setTimeout(function() {
		var curl = window.location.href;
		if (lasturl == curl) return;
		lasturl = curl;
		window.onhashchange();
	}, 500);
}()