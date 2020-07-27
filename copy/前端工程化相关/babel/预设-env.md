# 1 env插件配置
## babel配置
```bash
{
  "presets": [
    "env"
  ]
}
```
## 源码
```
import a from './a.js'
let b = '2'
[1, 2, 3].map((n) => n + 1)
console.log(2)
let d = new Set()
class t { 

}
let p = new Promise()
```
## 命令
```bash
./node_modules/.bin/babel index.js
```
## 解析结果
```bash
'use strict';
//import 语法被转
var _a = require('./a.js');

var _a2 = _interopRequireDefault(_a);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
//let 语法被转
var b = '2'
//箭头函数被转
[(1, 2, 3)].map(function (n) {
  return n + 1;
});
console.log(2);
//set 新增buildin的没有转
var d = new Set();
// class语法被转
var t = function t() {
  _classCallCheck(this, t);
};
//set 新增buildin的没有转
var p = new Promise();
```
## 结论
env只转语法
那polyfill 怎么转？
env 可以配置useBuiltIns，不同的配置对应不同的切片集（可看https://github.com/zloirock/core-js#babelpolyfill）
关于语法和polyfill怎么区分？
目前想到的是https://babel.docschina.org/docs/en/6.26.3/babel-preset-es2015  根据插件可以推算哪些是语法，
core-js都是切片