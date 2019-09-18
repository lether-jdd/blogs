

---
title: package文件
date: 2019-08-23 21:13:51
tags:
- module字段
- npm
- package
categories: 
- 构建&其他
---
require('xx')  引入的是包的main字段对应的入口
CommonJS 规范的包都是以 main 字段表示入口文件了，如果使用 ES Module 的也用 main 字段，就会对使用者造成困扰，所以新增了module字段
最初rollup支持，webpack 从版本 2 开始也可以识别 pkg.module 字段
打包工具遇到 package1 的时候，如果存在 module 字段，会优先使用，如果没找到对应的文件，则会使用 main 字段，并按照 CommonJS 规范打包。



关于tree-shaking 的关系

https://github.com/sunyongjian/blog/issues/37