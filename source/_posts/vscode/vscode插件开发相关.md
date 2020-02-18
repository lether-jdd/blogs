---
title: vscode插件开发
date: 2019-10-11
tags:
- 插件开发
- vscode
categories: 
- vscode
- 插件开发
---
# 什么情况下考虑插件实现
  当重复处理同一问题超过3次就需要考虑化繁为简，梳理一下DIY一个插件，因为写一个插件的成本并不大。
# 实现一个插件
## 脚手架
Yeoman 和 Generator-code
打包和发布：npm install -g vsce
```bash
npm install -g yo
npm install -g generator-webapp
yo code
```
特别说明一下编写snippets时候的body可以使用占位符
```bash
// ./snippets/javascript.json
{
  "forEach": {
    "prefix": "fe",
    "body": [
      "${1:array}.forEach(function(item) {",
      "\t${2:// body}",
      "});"
    ],
    "description": "Code snippet for \"forEach\""
  },
  "setTimeout": {
    "prefix": "st",
    "body": [
      "setTimeout(function() {",
      "\t${0:// body}",
      "}, ${1:1000});"
    ],
    "description": "Code snippet for 'setTimeout'"
  }
  ...
}
```
body 中定义的就是填充的代码段内容。body 中可以使用占位符（placeholders），如上面的 ${1:array}、 {2:// body}，使用占位符方便在引用代码段的时候可以通过 tab 键快速切换跳转到对应位置编辑。冒号前面的序号表示切换的顺序，冒号后面的内容则是占位显示的默认文本。
#相关资料链接
官方：https://code.visualstudio.com/api
https://juejin.im/post/5d9f2f436fb9a04e187c9c24
小茗同学：https://www.cnblogs.com/liuxianan/p/vscode-plugin-overview.html