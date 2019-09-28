/*
 * @Description: todo
 * @Author: yufei
 * @Date: 2019-09-01 00:27:33
 * @LastEditors: yufei
 * @LastEditTime: 2019-09-06 10:31:53
 */
// var a = { "el": "div", "props": { "name": "lucifer" }, "children": [{ "el": "TEXT", "props": { "nodeValue": "Hello lucifer" }, "children": [] }, { "el": "span", "props": { "name": "xxx" }, "children": [{ "el": "b", "props": { "name": "bbb" }, "children": [{ "el": "TEXT", "props": { "nodeValue": "bbb" }, "children": [] }] }] }] }

import React from '../src/core.js';
import ReactDOM from '../src/dom.js';

class HelloMessage extends React.Component {
    // render函数和react的render略有不同
    // 这里借鉴了preact的思想，将props和state通过参数传到render函数中去
    render({ name }) {
        return React.createElement("div", {className: 'xxxx'}, `Hello ${name}`);
    }
}

// render to dom
ReactDOM.render(
    React.createElement(
        HelloMessage,
        { name: "lucifer" },
        React.createElement(HelloMessage, { name: "Taylor" })
      ),
    document.getElementById("demo")
);
