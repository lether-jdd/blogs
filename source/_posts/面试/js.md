# 1 如何判断object是数组类型
> typeof [a] ret:'object'
- instance of Array
- Array.isArray()
- Array.prototype.isPrototypeOf(obj)
# 2 常见
事件原理，闭包，调用栈，Promise，ES6， 工程化，webpack, 性能优化，跨域，安全问题， React、Redux 思想，Virtual DOM，Diff 算法， 移动端布局，浏览器渲染原理，Event Loop 等还有手写代码，主要考察一些基本 API 和 ES6 的使用
# 3 闭包
```bash

下面程序按照要求依次打印出
console.log(1)
console.log(2)
console.log(3)
console.log(4)
console.log(5)
console.log(6)
console.log(7)
console.log(8)
console.log(9)

题目代码如下：
var arr = [];
for(var i=0;i<10;i++){
	var fn = function(){
		console.log(i);
	}
	arr.push(fn);
}
arr.forEach(function(fn){
	fn()
})
for(let i=0;i<10;i++){
	var fn = function(){
		console.log(i);
	}
	arr.push(fn);
} ?
for(var i=0;i<10;i++){
	var fn = (function(){
		console.log(i);
	})(i)
	arr.push(fn);
}
for (var i = 0; i < 10; i++) {
    arr[i] = (function(c) {
        return function(){
            console.log(c);
        }
    })(i);
}
```
# 4 typeof 的原理，与 instanceOf 、 Object.toString.call() 的区别
typeOf原理：js在存储变量的时候会在变量的机器码低位1-3位存储类型信息
# 5 0.1 + 0.2 === 0.3 吗？ 为什么？
# 6 es6的模块管理 与 commonjs 的对比
用法上
原理上
使用场景上
# 7 es6 Decorator

# 8 es6+ 新特性
# 9 Base64 的原理？编码后比编码前是大了还是小了
# 10 setTimeout 的原理
# 11 怎么实现this对象的深拷贝
# 12 Promise、Async有什么区别
# 13 搜索请求如何处理（防抖），搜索请求中文如何请求