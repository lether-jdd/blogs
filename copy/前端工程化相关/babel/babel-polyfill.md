用来仿效一个完整的环境（例如es6的环境）


# 在程序开始要引入babel-prolyfill
# 至于是怎么实现的？
可以在core-js库中追踪一下函数bind方法是怎么注入的
# 配合babel-preset-env 的useBuiltIns有不同形式的引入
https://babel.docschina.org/docs/en/6.26.3/babel-polyfill


具体细节
# 1 源码
```bash
// import a from './a.js'
require("babel-polyfill");
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
# 2 babel配置
```bash
{
  "presets": [
    "env"
  ]
}
```
# 3 命令
```bash
./node_modules/.bin/babel index.js -d  out/inde.js
```
# 4 效果
将node降至v5执行
```bash
node out/inde.js
```
可以执行，如果移掉‘require("babel-polyfill");’会报错

# 5 缺点
babel-polyfill  会污染全局
需要整个引入，体积太大