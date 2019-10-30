---
title: webpack-loader
date: 2019-08-23 21:13:51
tags: 
- webpack
- loader
categories: 
- 构建&其他
---
# 须知
    loader 可以使你在 import 或"加载"模块时预处理文件
    loader 描述了 webpack 如何处理 非 JavaScript _模块_，并且在 bundle 中引入这些_依赖_。
# loader开发
loader本质就是接收字符串(或者buffer)，再返回处理完的字符串(或者buffer)的过程
## vue-loader源码阅读
### vue-loader的功能：
vue-loader 是一个 Webpack 的 loader，可以将指定格式编写的 Vue 组件转换为 JavaScript 模块。
Vue组件默认分成三部分，template、script 和 style，我们可以把一个组件要有的html，js，css写在一个组件文件中，而vue-loader，会帮助我们去处理这个vue组件，把其中的html，js，css分别编译处理，最终打包成一个模块。
## 手写一个loader示例
> 该部分部分参考https://juejin.im/post/59df06e6f265da430d5701d0  文章的”动手写一个webpack loader“

loader功能介绍：给html加上公共头和尾
实现思路：require的时候替换layout文件（包含头和尾）的标识符，将内容插入layout文件中
loader代码
```bash
const loaderUtils = require('loader-utils')
const fs = require('fs')
module.exports = function (source) {
  const options = loaderUtils.getOptions(this)
  const layoutHtml = fs.readFileSync(options.layout, 'utf-8')
  return layoutHtml.replace('{{__content__}}', source)
}

```
### node环境中运行
因为是在服务器端测试的所以配置的时候设置了target:node,不然打包的时候require核心代码的时候的输出会报错   
还要使用raw-loader将文件作为字符串导入，require的时候obj.default为字符串,正常的时候require为模块的export的值。
配置如下：
config.js
```bash
const path = require('path')
module.exports = {
  entry: {
    app: './server.js'
  },
  output: {
    path: path.resolve(__dirname, './'), 
    filename: 'dist.js',
  }, 
  target: 'node',
  module: {
    rules: [
      {
      test: /\.html$/,
      use: [{
        loader: "raw-loader",
      },{
        loader: path.resolve(__dirname, '../loader/html-layout-loader.js'),
        options: {
          layout: path.resolve(__dirname, '../layout.html')
        }
      }]
    }],
    
  }
}
```
server.js
```bash
var http = require('http'); // 1 - Import Node.js core module
const returnHtml = require('../test.html')
console.log('returnHtml', returnHtml)
var server = http.createServer(function (req, res) { // 2 - creating server
  //handle incomming requests here..
  res.writeHead(200, {
    "Content_Type": "text/html"
  }); //设置响应格式
  res.write(returnHtml.default);
  res.end();
});
server.listen(5000); //3 - listen for any incoming requests
console.log('Node.js web server at port 5000 is running..')
```
使用如下
init.js
```bash
const webpack = require('webpack')
const webpackConfig = require('./config')
webpack(webpackConfig, (err, stats) => {
  console.log('err',err)
})
```
先运行init.js生成dist.js
然后运行dist.js
### 纯前端环境中运行
在前端代码中进行配置的话，可以看到index.html直接就配置成功了，猜测webpack-dev-server也是用require的方式加载index.html的，此处就调试webpack-dev-server
可以看到并不是require，而是通过以下方式读取index.html的（具体怎么找到的可参考https://segmentfault.com/a/1190000016871965）
```bash
stat = context.fs.statSync(filename);
```
这个是在shared中定义的
```bash
if(typeof compiler.outputPath === "string" && !pathIsAbsolute.posix(compiler.outputPath) && !pathIsAbsolute.win32(compiler.outputPath)) {
    throw new Error("`output.path` needs to be an absolute path or `/`.");
  }

  // store our files in memory
  var fs;
  var isMemoryFs = !compiler.compilers && compiler.outputFileSystem instanceof MemoryFileSystem;
  if(isMemoryFs) {
    fs = compiler.outputFileSystem;
  } else {
    fs = compiler.outputFileSystem = new MemoryFileSystem();
  }
  context.fs = fs;
```
可见这里的statSync方法是outputFileSystem中的statSync，是从内存中读的。而内存中的内容是什么呢？这时候可以选择build出来看一下。
build之后可看到inde.html中含有头部和尾部。
然后想起了前两天写的text的插件，用那个build的话就会有问题，因为是直接从硬盘中读的index.html，当用官方插件的时候build出来没有问题。对比一下自己写的与之的差别。
发现该插件在生成index.js的时候又重新新建了子编译器compiler及compilation了一遍(相关代码如下)
html-webpack-plugin包中的lib/compiler.js
```bash
var childCompiler = compilation.createChildCompiler(compilerName, outputOptions);
...
...
childCompiler.runAsChild(function (err, entries, childCompilation) {
```
为什么不能直接读取 html 文件而要用子编译器？因为 html 文件中可能依赖其他外部资源（比如 img 的src属性），所以加载 html 文件时仍然需要一个额外的完整的构建流程来完成这个任务，这个构建过程正好就包含了loader编辑的过程。
那么loader是在什么时候运行的呢？
参考https://juejin.im/post/5bc1a73df265da0a8d36b74f#heading-10  文章的”loader运行时机部分“可知大概是在compilation的时候运行的，经过设置断点确实是在子编译器complication之后（但是没有跟到具体的方法）。
https://juejin.im/post/5bc1a73df265da0a8d36b74f#heading-10   这篇文章很详细的写了loader相关的内容，以后有机会可以看看

关于子编辑器或更多webpack的相关https://cloud.tencent.com/developer/article/1030740