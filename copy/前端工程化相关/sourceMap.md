---
title: sourceMap原理
date: 2019-08-23 21:13:51
tags:
categories: 
- 构建&其他
---
# 问题来源：前端资源错误监控

前端资源错误监控一般是通过监听onerror事件来监控前端资源的报错，但是线上的资源都是经过打包压缩的，所以该函数返回的都是压缩后错误代码的行数和列数。但是我们想要知道的是源代码中的行号和列号。
一般推荐的是用sourceMap包解析出源码中的行号和列号
  *https://github.com/mozilla/source-map*
```bash
consumer = new sourceMap.SourceMapConsumer
consumer.originalPositionFor（line,col）
```
这么一顿操作之后就能知道源码中出错的位置！

# 那么是怎么实现的呢？
  *这一部分参考了：https://juejin.im/entry/5bbffe87e51d450e436998b4   个人觉得比ryf那一篇讲得清楚*
  可直接从以上链接中的“我们所想象的Source Map”部分开始看，也可以直接看我的简述版
  首先打开打包后生成的map文件，可看到这样一个json
  ```bash
  {
    "version":'1.0',
    "sources":['xxx','yyyy'],  //转换前的文件，如果为数组表示是多个文件压缩成这一个文件
    "names":["exports"],//转换前的所有变量名和属性名。
    "mappings":["+DAmCAA,EAAAC;IAAA6uC,EAAA"] //记录位置信息的字符串，
  }
  ```
  其中mappings字段那看不懂的编码是Base64 VLQ 编码，在线解码：http://murzwin.com/base64vlq.html
  ";"隔开的是行 -- uCAgDAA,EAAACs表示压缩后的代码的第一行的编码
  ","隔开的是位置 -- uCAgDAA 表示压缩后的代码的第一行第一个位置  EAAACs表示压缩后的代码的第一行第二个位置
  "+DAmCAA"  解码后是  [63,0,35,0,0]
  "EAAAC" 解码后是 [2,0,0,0,1]
  其中位数对应关系
- 第一位，表示这个位置在（转换后的代码的）的第几列。
- 第二位，表示这个位置属于sources属性中的哪一个文件。
- 第三位，表示这个位置属于转换前代码的第几行。
- 第四位，表示这个位置属于转换前代码的第几列。
- 第五位，表示这个位置属于names属性中的哪一个变量。
  注意：第一位和第四位都是对前一个位置的相对（如果不是第一个的话）
  由于"+DAmCAA"是第一个，所以代表压缩后文件的第一行的63列是sources[0]文件的第35行的第0列,对应names[0]的那个变量
  "EAAAC"代表的是压缩后文件的第一行第63+2=65列对应sources[0]文件的第0+35=35行的第0+0列,对应name[1]的那个变量

  初步是这么找的，但是这个map是怎么生成的等后续有时间的话再写吧