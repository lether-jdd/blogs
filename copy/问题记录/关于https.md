---
title: lambda演算
date: 2019-08-23 21:13:51
tags:
categories: 
- 构建&其他
---
背景：
  推行https之后，页面中的图片等资源如果还是http的请求就会出问题，当时采用的方式是对后端返回的url的地址做更改为相对路径，继承当前页面的协议。
  而没有使用csp指令upgrade-insecure-requests的方式（该方式没有浏览器兼容问题）
  后来发现是因为要兼容线下环境，线下环境还支持http
  