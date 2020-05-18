简介：zuma是团队内部的模板平台，主要是提供业务组件，代码片段的管理。可以新增、查询、实时编辑业务组件及代码片段。这里的业务组件可以类比为飞冰的业务组件或区块。
技术栈：后端是由egg+mysql搭建，前端使用vue以及内部封装的tangramUI组件库；同时接入大象通知。
涉及到的技术：
1 zabra数据库-通过插件的形式连接数据库。
2 实时运行vue（使用vue-markdown-run库）
  基本原理：把md的代码解析成vue实例的配置，然后生成实例挂载在元素上。
  怎么把单文件组件解析成vue实例：
  1 parse.js  将vue的单文件中的template、script、style部分通过DOM查询tag来区分来并返回。
  2 compiler.js  将template及script中导出的对象拼接在一起就是vue实例的参数对象。
      script中的代码需要经过babel编辑，还有scope的处理。模块的导出。
关于render和template都是vue的选项API，如果有render会默认先render，可从官网上看到api
里面preview组件是用render写的，为啥用render写？js的方式更方便？
有一个仓库https://github.com/QingWei-Li/vuep  实时编辑展示vue组件,发现这个仓库跟vue-markdown-run库的原理一样，而且这个仓库更完备一些。
这个人的仓库中有md相关的loader
对比组件库：
  根据json文件动态请求组件对应的md文件，在webpack中配置md文件的请求对应的处理，此时加上demo-block组件，在组件内部通过is动态组件来展示
  是通过使用动态组件来实现展示的



飞冰：
物料分为组件（component）、区块（block）和项目（scaffold）三种类型。
组件又可以分为：基础组件和业务组件
区块：由组件组成

与飞冰的区别：飞冰支持多种框架