/*
 * @Description: todo
 * @Author: yufei
 * @Date: 2019-09-01 22:16:23
 * @LastEditors: yufei
 * @LastEditTime: 2019-09-06 10:38:36
 */

import React from '../src/core.js';
import ReactDOM from '../src/dom.js';

const abc =
React.createElement("div", { id: "lucifer" }, `Hello lucifer`,
    React.createElement('span', { className: 'xxx' }, 'xxx',
    React.createElement('b', { style: 'background: red' }, 'bbb')
    )
);

console.log(JSON.stringify(abc));
window.onload = () => {
ReactDOM.render(
    abc, document.getElementById('demo')
)
}