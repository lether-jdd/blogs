---
title: babel模块化相关
date: 2019-08-23 21:13:51
tags: 
- webpack
- 模块化
- babel
categories: 
- 构建&其他
---
The file-loader resolves import/require() on a file into a url and emits the file into the output directory.
例如配置了jpg文件的file-loader,那么代码中require('./a.jpg')最后会返回一个url