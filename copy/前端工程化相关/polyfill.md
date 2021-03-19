---
title: polyfill  && babel-polyfill
date: 2019-10-11
tags:
- polyfill
categories: 
- 构建&其他
---

polyfill  包含js语言的polyfill  和 html（例如document.head） 、DOM等各种的polyfill

Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign ）都不会转码


babel-runtime和babel-plugin-transform-runtime