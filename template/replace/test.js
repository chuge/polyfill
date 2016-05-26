var data = [{
  title: "Knockout应用开发指南",
  href: "http://www.cnblogs.com/TomXu/archive/2011/11/21/2257154.html",
  imgSrc: "http://images.cnblogs.com/cnblogs_com/TomXu/339203/o_knockout2.jpg",
  user: {
    id: 1
  }
}, {
  title: "微软ASP.NET站点部署指南",
  href: "http://www.cnblogs.com/TomXu/archive/2011/11/25/2263050.html",
  imgSrc: "http://images.cnblogs.com/cnblogs_com/TomXu/339203/o_vs.jpg",
  user: {
    id: 1
  }
}, {
  title: "HTML5学习笔记简明版",
  href: "http://www.cnblogs.com/TomXu/archive/2011/12/06/2277499.html",
  imgSrc: "http://images.cnblogs.com/cnblogs_com/TomXu/339203/o_LearningHtml5.png",
  user: {
    id: 1
  }
}];

var template = document.querySelector('#template').innerHTML,
  result = document.querySelector('.result'),
  attachTemplateToData;


// 将模板和数据作为参数，通过数据里所有的项将值替换到模板的标签上（注意不是遍历模板标签，因为标签可能不在数据里存在）。
var attachTemplateToData = function(template, data) {
  var i = 0,
    len = data.length,
    fragment = '';

  // 遍历数据集合里的每一个项，做相应的替换
  function replace(obj) {
    var t, key, reg;　　　　　　　　　　　　　 //遍历该数据项下所有的属性，将该属性作为key值来查找标签，然后替换
    for (key in obj) {
      reg = new RegExp('{{' + key + '}}', 'ig');
      t = (t || template).replace(reg, obj[key]);
    }

    return t;
  }

  for (; i < len; i++) {
    fragment += replace(data[i]);
  }

  return fragment;
};

result.innerHTML = attachTemplateToData(template, data);