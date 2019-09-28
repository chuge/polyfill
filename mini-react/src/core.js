/*
 * @Description: todo
 * @Author: yufei
 * @Date: 2019-08-22 23:19:27
 * @LastEditors: yufei
 * @LastEditTime: 2019-09-01 20:36:36
 */
import Component from './component';
const TEXT_ELEMENT = "TEXT";

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

// createElement前两个参数分别为type和props
// 之后的所有参数都会被看作children
// 当然props.children 也会被看作children(createElement会进行合并)
function $createElement(type, _props, ...children) {
  const props = Object.assign({}, _props);

  const hasChildren = children.length > 0;
  const mergedChildren = hasChildren ? [].concat(...children) : [];

  props.children = mergedChildren
    .filter(c => c != null && c !== false)
    .map(c => (c instanceof Object ? c : createTextElement(c)));
  return { type, props };
}

function createElement(el, props, ...children) {
  return $createElement(el, props || {}, children);
}

const React = {
    createElement,
    Component
};

export default React;