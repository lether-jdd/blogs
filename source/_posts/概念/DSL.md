---
title: DSL
date: 2019-08-23 21:13:51
tags: DSL
categories: 
- DSL
---


DSL  Domain Specific Language
Martin Fowler将DSL分为内部DSL和外部DSL
内部DSL一般是基于宿主语言封装的一个类库
外部DSL相当于创造一个新的编程语言



自己定义一套DSL，通过解析AST实现自己需要的功能

jscore  词法分析是由lexer完成
JISON