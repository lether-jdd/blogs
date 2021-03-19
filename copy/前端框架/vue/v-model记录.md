---
title: v-model问题分析
date: 2019-08-23 21:13:51
tags: 
- vue
categories: 
- vue
---
关于v-model
问题：
```bash
<div v-for=“item in list“>
	<input v-model=“item.key”>
</div>
data:{
	list:[{
		key:age
	},{
		key:height
	}],
	age:””,
	height:””,
}
```
这样绑定为什么不行？
```bash
<div v-for=“item in list“>
	<input v-model=“form[item.key]”>
</div>
data:{
	list:[{
		key:age
	},{
		key:height
	}],
	form:{
		age:””,
		height:””,
	}
}
```
这样可以
￼
![](/images/1.png)
![](/images/2.png)
![](/images/3.png)
![](/images/4.png)
![](/images/5.png)

￼
如果我用obj[item] 最终会被描述成这样格式的字符串对象
"_c('input',{directives:[{name:"model",rawName:"v-model",value:(obj[item]),expression:"obj[item]"}],attrs:{"type":"text"},domProps:{"value":(obj[item])},on:{"input":function($event){if($event.target.composing)return;$set(obj, item, $event.target.value)}}})”

v-model只是语法糖，他的真实作用是给input传了个props，同时绑定一个input事件，看这个事件的最后一行：
$set(obj, item, $event.target.value)
这里取obj[item] 应该要强调，这里的obj是放在了data之中，所以有初始化时，vue添加的get和set
所以他是通过这个来实现双向绑定的 

但是如果用 v-for 的 item 的话 
字符串对象是这样的

"_c('input',{directives:[{name:"model",rawName:"v-model",value:(item),expression:"item"}],attrs:{"type":"text"},domProps:{"value":(item)},on:{"input":function($event){if($event.target.composing)return;item=$event.target.value}}})”

看最后一行 是 item = $event.target.value

这里的item 的值是一个字符串，并没有data初始化添加的get 跟set

所以分析得出，这里其实就是因为没有get跟set导致的