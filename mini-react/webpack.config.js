/*
 * @Description: todo
 * @Author: yufei
 * @Date: 2019-09-01 23:45:36
 * @LastEditors: yufei
 * @LastEditTime: 2019-09-06 12:06:26
 */
const path = require('path');
const fs = require('fs');

const computeEntry = () => {
  const dir = './demo';
  const result = {};
  
  fs.readdirSync(dir).forEach((item) => {
    if (item.endsWith('.js') ){
  
      const fileName = item.substring(0, item.indexOf('.js'));
      const path = `${dir}/${fileName}`;
  
      result[fileName] = path;
    }
  });

  return result;
}

const config = {
  entry: computeEntry(),
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};

module.exports = config;