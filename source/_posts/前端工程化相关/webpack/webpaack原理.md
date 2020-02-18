---
title: webpack原理
date: 2019-08-23 21:13:51
tags: 
- webpack
categories: 
- 构建&其他
---
# 常用概念
- Entry：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
- Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
- Plugin：扩展插件，在 Webpack 构建流程中的特定时机会广播出对应的事件，插件可以监听这些事件的发生，在特定时机做对应的事情。

# 2 webpack学习及源码阅读

compiler和compilation中所有事件流的介绍：http://stephenzhao.github.io/webpack-cn/index.html


1  在bin/webpack中
   — 通过yargs获得shell中的参数
   —（convert-argv.js中可以看到）将webpack.config.js中的参数和shell的参数整合到options对象上  
   —（在webpack中的processOptions函数中可以看到）
通过实例化lib/webpack.js中的webpack()生成compiler编译器（在之后的第二步会返回compiler对象）  	
   — （在webpack中的processOptions函数中可以看到）调用compiler.run()开始进行编译打包
2 lib/webpack  根据整合的options生成compiler对象
3 lib/compiler.js 首先看到run方法。它触发了before-run和run两个事件，之后在run事件中，通过readRecords读取文件，接着通过compile进行编译打包。
4 compile函数
—第一步就会使用用户配置的loader进行资源转化，然后存储为params。
constparams = this.newCompilationParams()  //调用loader工厂方法
 —然后依旧是执行事件流上的各个方法，诸如：before-compile、compile、make等事件流。 —在compile编译完成后，会以编译完成的params实例化compilation来进行打包的过程。
const compilation = this.newCompilation(params);    //实例化compilation
5 


CommonsChunkPlugin 插件


具体为什么要用ETag，主要出于下面几种情况考虑：