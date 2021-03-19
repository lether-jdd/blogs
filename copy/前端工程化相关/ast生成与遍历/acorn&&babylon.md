A tiny, fast JavaScript parser, written completely in JavaScript. 
一个完全使用javascript实现的，小型且快速的javascript解析器.
解析工作的产出即ast（抽象语法树）,遵循Estree规范的ast


模块打包器:webpack、rollup

大致流程
词法分析（token） - 语法分析 - ast

详细的过程
https://www.zhihu.com/ 可以看这个


acorn也支持插件，例如写一个支持jsx的插件


## 1 区别
babylon也是基于acorn的，
babel中用的babylon

## 2 怎么遍历ast
babel中使用的是babel-traverse
开源的有estraverse

## 实践
amd2cmd 就是使用acorn
https://www.npmjs.com/package/amd2cmd

## 番外
escodegen 从AST生成源代码。