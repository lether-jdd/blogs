---
title: 问题记录（exports找不到）
date: 2019-08-23 21:13:51
tags:
- export
- babel
- webpack
categories: 
- 问题记录
---
1 问题描述：
babel配置transform-runtime之后访问页面报错
```
exports is not defined
```
2 配置：
```
{
  "plugins": ["jsx-v-model", "transform-vue-jsx", ["transform-runtime"]],
  "presets": [
    ["es2015",  {
      // "modules": false
    }], "stage-0"],
  "ignore": [
    "./static/page/orgTree/*"
  ]
}
```
3 解决问题步骤：
3.1 报错的文件：./static/page/punishmentCenter/const/index.js
报错原因：
```
Object.defineProperty(exports, "__esModule", {
  value: true
});
```
该段代码exports找不到
3.2  为什么找不到
1 是谁导入的报错代码（babel）
2 为什么找不到（webpack模块化的时候function参数不正确）
3.3 为什么webpack模块化的时候function参数不正确？
    根据跟踪webpack源码在HarmonyDetectionParserPlugin中定位function的export参数为什么不对
    ```
    const isHarmony =
				isStrictHarmony ||
        ast.body.some(statement => {
					return /^(Import|Export).*Declaration$/.test(statement.type);
        });
    ```
    其中命中了含有Import生命的语句，导致function传入参数不对
    为什么会命中Import？
    根据打印出来的statement可知因为引入了'babel-runtime/core-js/object/define-property'文件
    是因为transform-runtime默认使用polyfill，导致引入了该文件
3.4 为什么会引入错误代码
    配置为es2015 的时候才引入  present-dev的时候没有引入。为什么？
    