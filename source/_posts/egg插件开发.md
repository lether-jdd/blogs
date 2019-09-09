---
title: elk
date: 2019-08-23 21:13:51
tags:
categories: 
- egg
- 插件开发
---
##1  egg插件开发要注意入口是app.js   为什么？
##2 常用插件开发（全局实例）
```bash
// egg-mysql/app.js
module.exports = app => {
  // 第一个参数 mysql 指定了挂载到 app 上的字段，我们可以通过 `app.mysql` 访问到 MySQL singleton 实例
  // 第二个参数 createMysql 接受两个参数(config, app)，并返回一个 MySQL 的实例
  app.addSingleton('mysql', createMysql);
}
//config为对应该插件的配置
function createMysql(config,app){
  //your code
  return xxx  //记得return插件
}
```
##3 插件和中间件
1 中间件加载其实是有先后顺序的，但是中间件自身却无法管理这种顺序，只能交给使用者。这样其实非常不友好，一旦顺序不对，结果可能有天壤之别。（插件没有顺序吗）
2 中间件的定位是拦截用户请求，并在它前后做一些事情，例如：鉴权、安全检查、访问日志等等。但实际情况是，有些功能是和请求无关的，例如：定时任务、消息订阅、后台逻辑等等。
3 有些功能包含非常复杂的初始化逻辑，需要在应用启动的时候完成。这显然也不适合放到中间件中去实现。

所以就要用插件

插件自己管理依赖


插件能做什么（具体看官网）
- 扩展内置对象接口（Request、Response、Context、Helper、Application、Agent）
- 插入自定义中间件
- 启动时做一些初始化工作（app启动，agent启动）
- 定时任务（schedule
- 全局实例插件
  