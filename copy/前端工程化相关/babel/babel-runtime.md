# 1 babel-plugin-transform-runtime
这个插件是将polyfill或者一些帮助函数引入，这个引入引入的是babel-runtime 中的函数
# 2 babel-runtime
其实和babel-polyfill用的都是core-js
只是babel-polyfill 是全局引入的方式
babel-runtime支持单个引入
配合上面那个插件就可以避免全局污染了
# 原理
rtransform-runtime插件做了以下三件事：
当你使用 generators/async 函数时，自动引入 babel-runtime/regenerator 。
自动引入 babel-runtime/core-js 并映射 ES6 静态方法和内置插件。
移除内联的 Babel helper 并使用模块 babel-runtime/helpers 代替。
# 3 实践
# 3.1 源码
```bash
// import a from './a.js'
// require("babel-polyfill");
let b = '2';
[1, 2, 3].map(n => { 
  return n+1
})
console.log(2)
let d = new Set()
class t { 

}
console.log("foobar".includes("foo"))
let p = new Promise(() => { })
```
# 3.2 配置
```bash
{
  "presets": [
    "env"
  ],
  "plugins":[
    "babel-plugin-transform-runtime"
  ]
}
```
# 3.3 赚完
```bash
"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import a from './a.js'
// require("babel-polyfill");
var b = '2';
[1, 2, 3].map(function (n) {
  return n + 1;
});
console.log(2);
var d = new _set2.default();

var t = function t() {
  (0, _classCallCheck3.default)(this, t);
};

console.log("foobar".includes("foo"));
var p = new _promise2.default(function () {});
```
# 4 不足
不能转码实例方法，只能通过 babel-polyfill 来转码，因为 babel-polyfill 是直接在原型链上增加方法。
'!!!'.repeat(3);
'hello'.includes('h');
