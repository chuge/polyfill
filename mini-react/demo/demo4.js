/*
 * @Description: todo
 * @Author: yufei
 * @Date: 2019-09-01 22:44:43
 * @LastEditors: yufei
 * @LastEditTime: 2019-09-06 10:40:11
 */

import React from '../src/core.js';
import ReactDOM from '../src/dom.js';

class HelloMessage extends React.Component {
    // render函数和react的render略有不同
    // 这里借鉴了preact的思想，将props和state通过参数传到render函数中去
    render({name}) {
      return <div className="xxx" style="color:red; background:yellow;">Hello {name}</div>;
    }
  }
  
  // render to dom
  ReactDOM.render(
    <HelloMessage name="lucifer">
      <div>jsholic</div>
    </HelloMessage>,
    document.getElementById("demo")
  );