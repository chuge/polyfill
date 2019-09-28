/*
 * @Description: todo
 * @Author: yufei
 * @Date: 2019-09-06 10:37:05
 * @LastEditors: yufei
 * @LastEditTime: 2019-09-06 10:38:07
 */
import React from '../src/core';
import ReactDOM from '../src/dom';


ReactDOM.render(
    {
        type: 'ul',
        props: {
            className: 'wrapper'
        },
        children: [{
            type: 'li',
            props: {
                id: 'li1'
            },
            children: [{
                type: "TEXT",
                props: { nodeValue: 'text1' }
            }]
        }, {
            type: 'li',
            props: {
                id: 'li2'
            },
            children: [{
                type: "TEXT",
                props: { nodeValue: 'text2' }
            }]
        }]
    }, document.getElementById('demo')
)