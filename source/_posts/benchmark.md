---
title: benchmark
date: 2019-08-23 21:13:51
tags:
- benchmark
- jsPerf
categories: 
- 测试
---
# benchmark 
可以用来做一些基准测试，用来比较不同代码的执行速度。例如要比较
- RegExp的test方法和String对象的indexOf方法查找字符串谁的速度更快
- 循环时用let声明和var声明哪个更快
- apply和call的执行速度
  
代码示例：
```bash
const Benchmark = require('benchmark')
const suite = new Benchmark.Suite;

const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// add tests
suite.add('let', function () {
  for (let i = 0, len = arr.length; i < len; i++) {
    arr[i]
  }
})
  .add('var', function () {
    for (var i = 0, len = arr.length; i < len; i++) {
      arr[i]
    }
  })
  // add listeners
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run()
```
执行结果
```bash
➜  benchmarn-test git:(jdd_rights0911) ✗ node index.js
let x 61,306,435 ops/sec ±1.62% (82 runs sampled)
var x 65,472,554 ops/sec ±0.56% (90 runs sampled)
Fastest is var
```
ops/sec  每秒执行用例的次数
# jsPerf
jsPerf 是基于benchmark做的在线的工具
网址：https://jsperf.com/   可在线创建自己的用例
# benchmark怎么实现统计的待研究