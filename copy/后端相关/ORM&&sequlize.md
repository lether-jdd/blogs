---
title: ORM
date: 2019-08-23 21:13:51
tags:
categories: 
- 后端
---

ORM (object relationship mapping)就是通过实例对象的语法，完成关系型数据库的操作的技术，是"对象-关系映射"（Object/Relational Mapping） 的缩写。
数据库的表（table） --> 类（class）
记录（record，行数据）--> 对象（object）
字段（field）--> 对象的属性（attribute）

ORM 使用对象，封装了数据库操作，因此可以不碰 SQL 语言。开发者只使用面向对象编程，与数据对象直接交互，不用关心底层数据库。

ORM 写法
```bash
p = Person.get(10);
name = p.first_name;
```
sql
```bash
sql ='SELECT id, first_name, last_name, phone, birth_date, sex
 FROM persons 
 WHERE id = 10'
res = db.execSql(sql);
name = res[0]["FIRST_NAME"];
```


优点
数据模型都在一个地方定义，更容易更新和维护，也利于重用代码。
ORM 有现成的工具，很多功能都可以自动完成，比如数据消毒、预处理、事务等等。
它迫使你使用 MVC 架构，ORM 就是天然的 Model，最终使代码更清晰。
基于 ORM 的业务代码比较简单，代码量少，语义性好，容易理解。
你不必编写性能不佳的 SQL。

缺点
数据模型都在一个地方定义，更容易更新和维护，也利于重用代码。
ORM 有现成的工具，很多功能都可以自动完成，比如数据消毒、预处理、事务等等。
它迫使你使用 MVC 架构，ORM 就是天然的 Model，最终使代码更清晰。
基于 ORM 的业务代码比较简单，代码量少，语义性好，容易理解。
你不必编写性能不佳的 SQL。


Sequelize 就是一种node的ORM库

很多语言都有自己的ORM库