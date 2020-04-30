---
title: babel插件开发
date: 2019-08-23 21:13:51
tags:
- babel
- 插件
categories: 
- 构建
---

1 babel-plugin-add-module-exports  解决 require(xxx).default 带 default 的问题。
详见：https://www.npmjs.com/package/babel-plugin-add-module-exports
2  插件编写
```bash
export default function({ types: babelTypes }) {
  return {
    visitor: {
      Identifier(path, state) {}, //ECMA规范中定义的节点类型
      ASTNodeTypeHere(path, state) {}
    }
  };
};
```
state：代表了插件的状态，你可以通过state来访问插件的配置项。
path：可以在path上访问到节点的属性，也可以通过path来访问到关联的节点
Identifier、ASTNodeTypeHere：当Babel遍历到相应类型的节点，属性对应的方法就会被调用
babelType：类似lodash那样的工具集，主要用来操作AST节点，比如创建、校验、转变等。举例：判断某个节点是不是标识符(identifier)。