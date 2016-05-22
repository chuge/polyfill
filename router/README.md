#route.js
前端路由注册/解析器

引用：https://git.oschina.net/diqye/route.js
[runjs演示](http://sandbox.runjs.cn/show/mg3ch4e4) 

##开始
- 1引入js

```html

<!--如果要兼容IE8以下 在head标签里面加入以下代码-->
<!--[if lte IE 7]>
<script src='./js/ieadaptor.js'></script>
<![endif]-->

<!--引入js  无其它依赖-->
<script type="text/javascript" src="./js/route.js"></script>
```
- 2注册路由

```javascript
var app=diqye.app;
app.use('/hello',function(req,next){
	alert('hello')
})
app.start()
```
- 3触发路由
点击a标签``<a href="#hello">hello</a>``
或者 直接更改浏览器地址``当前地址#hello``

###运行机制
浏览器url

1->截取#后面的路径

2->匹配第一个回调（回调顺序和调用use的顺序一致）

3->如果第一个回调调用next函数会继续匹配第二个回调  如果没有调用 回调到此结束不继续往下执行

4->如果匹配到的是路由 则进入该路由从步骤1开始执行

##例子

url：xxx#home?a=a&b=b     url中的参数会被转换成json对象 存在req中的query属性
```javascript
use('/home',function(req,next){
	//调用next会继续匹配后面的路由
	console.log(req.query)// 输出 {"a":"a","b":"b"}
})
```

url: xxx#test/id001
```javascript
var get=diqye.route.get;
use('/test/:string',function(req,next){
	//调用next会继续匹配后面的路由
	console.log(req.para)// 输出  id001
});
use('/test*',function(req){
	//do .....
});
```

url: xxx##homediqyeddddd  正则匹配路由
```javascript
use(/(.*)diqye(.*)/g,function(req,next){
	console.log(req.para); //输出 ["/homediqyeddddd", "/home", "ddddd", index: 0, input: "/homediqyeddddd"]
});
//get函数的第一个参数也可以是 函数 根据函数的返回值来判断路由是否匹配
```

404
```javascript
//前面没有参数代表匹配所有路由
use(function(req,next){
	//把这个函数放到最后  如果前面所有的路由没有匹配到 会走到这里
});
```

next函数说明
```
	每一个路由(即调用get函数)都是一个拦截器
	每一个拦截器中的next函数只能执行一次后续执行无效 但不报错
	next可以传一个参数0 即从头开始执行拦截器并且忽略本身拦截器
```

路由跳转和内部转发
```javascript
use('/',function(req,next){
	if(t){
		//url跳转
		req.redirect('diqye',{a:'我是首页redirect过来的',b:'ww'});
		t=false;
	}else{
		/*
			内部转发
			forword会自动调用next函数 
			在forword后面调用next函数会无效 但不会报错
		*/
		req.forword('diqye',{a:'我是首页forword过来的',b:'ww'});
	}
});
```

创建路由和使用

```javascript
var use=diqye.app.use;	
var route=diqye.routefn();
var route1=diqye.routefn();
use(route);
use(function(req,next){
	console.log('app use')
	next();
})
route1.use(function(req,next){
	console.log('route1 use '+req.path);
	next();
})
route.use(route1)
route.use(function(req,next){
	console.log('route use '+req.path);
	next();
});
diqye.app.start();
```
输出

route1 use /hello

route use /hello

app use

over


build.js 说明
```shell
//命令行 切换到当前目录
node build.js //将src目录文件 按照名字规则合并到js目录里

node build.js watch //与上面不同的是 会监控src目录 有变化就执行合并操作
```
