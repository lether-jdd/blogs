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
  # 1 精确获取页面元素位置的方式有哪些
  elem.getBoundingClientRect() return {left,right,top,bottom}  相对于视窗
  document.documentElement.scrollLeft 再加上滚动值之后就是绝对位置
  