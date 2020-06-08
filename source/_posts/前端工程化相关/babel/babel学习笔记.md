---
title: babel学习笔记
date: 2019-08-23 21:13:51
tags: 
- babel
categories: 
- 构建&其他
---
babel学习
- [x] 1 presets：预设，其实就是插件集合，可自定义，怎么自定义就是发包到npm
- [ ] 2 资料：http://guoyongfeng.github.io/my-gitbook/03/toc-babel-runtime.html
- [ ] 3 babel-polyfill:
Babel 只是编译新的js语法，但是对于浏览器或别的环境尚未支持的一些新的APIs，就采用polyfill的方式进行模拟。怎么模拟？绑在原型链上？
问题：api和语法怎么界定?暂时讨论结果就是浏览器原生的要扩展的方法或什么，就是API，新的语法糖或别的就叫语法，babel翻译
- [ ] 4 babel-runtime：
Babel会将助手方法注入到每个文件的头部，所以为了统一管理，保持代码的清洁，使用babel-runtime,可以通过inport的方式引入方法而不是注入方法
- [ ] 5 怎么写一个babel插件
试验了一下，已完成
- [ ] 6 ast树解析网站
https://astexplorer.net/
- [ ] 8 小例子：(删除不需要的导入)
	http://eux.baidu.com/blog/fe/how-to-write-babel-plugin
- [ ] 9：cookbook
https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-paths
https://www.kancloud.cn/digest/babel/217108