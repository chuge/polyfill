/*
 * @Description: todo
 * @Author: yufei
 * @Date: 2019-09-06 11:42:13
 * @LastEditors: yufei
 * @LastEditTime: 2019-09-06 12:32:20
 */
import React from '../src/core.js';
import ReactDOM from '../src/dom.js';

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    }
  }
  handleClick() {
    this.setState({
      count: this.state.count + 1
    });
  }
  render({ count }, { aax }) {

    console.log(count, aax, '11')
    return <div className="xxx" onClick={this.handleClick.bind(this)}>{name} Count: {count}</div>;
  }
}

// render to dom
ReactDOM.render(<Counter count={1} />, document.getElementById("demo"));