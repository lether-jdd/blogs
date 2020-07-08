# 1 webpack-dev-server  可以实现热重载，可搭配HotModuleReplacementPlugin插件实现热更新
webpack-dev-server 是一个express构建的node服务
同时通过socket来与浏览器双向通信，
# 1.1 怎么检测文件修改
检测文件修改是在webpack-dev-middleware中用的，调用的是compiler.watch来检测（监听本地文件的变化主要是通过文件的生成时间是否有变化，至于怎么去检测的可能是轮询，也可能是node提供的api）
watch检测到就会重新触发一次构建,每次构建会产生xxx/hash.hot-update.json，jsonp请求xxx/hash.hot-update.js
然后监听构建完成的钩子，来通知浏览器
# 1.2 怎么通知server改变
监听构建完成钩子，通过socket来通知浏览器，给浏览器最新的hash值
# 1.3 浏览器是怎么接收到通知并更新的
浏览器收到hash之后检查一下更新
更新的部分主要是HotModuleReplacement.runtime
发送ajax请求请求xxx/hash.hot-update.json，jsonp请求xxx/hash.hot-update.js
jsonp就是为了直接执行，执行的逻辑就是模块替换的逻辑（这里就是HotModuleReplacementPlugin插件里面的）
使用内存文件系统去替换有修改的内容实现局部刷新
在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引用。
最后手动module.hot.accpet来添加HMR的js模块
# 1.4 浏览器更新加更（HMR runtime）
hotApply  主要的过程主要是一次次冒泡，找到和当前更新模块有依赖的所有模块，查看子模块和父模块是否接收更新，如果接受，则标记为过期模块，不接受，则一直向上冒泡，直到顶部入口点。然后针对标记的模块进行accept更新处理，并删除原有依赖，建立新的依赖。
这里可以在官网中看到
# 2 webpack-dev-middleware 是一个容器(wrapper)，它可以把 webpack 处理后的文件传递给一个服务器(server)。
也就是dev-middleware  就是把webpack打包之后的资源输出到内存
文件相关的操作都抽离到webpack-dev-middleware库了，主要是本地文件的编译和输出以及监听
// 通过“memory-fs”库将打包后的文件写入内存
# 3 webpack-hot-middleware
Webpack-hot-middleware 插件的作用就是提供浏览器和 Webpack 服务器之间的通信机制、且在浏览器端接收 Webpack 服务器端的更新变化。
如果你使用了 webpack-dev-middleware 而没有使用 webpack-dev-server，请使用 webpack-hot-middleware package 包，以在你的自定义服务或应用程序上启用 HMR。
这个应该是没有用socket


问题
1 webpack 可以将不同的模块打包成 bundle 文件或者几个 chunk 文件，但是当我通过 webpack HMR 进行开发的过程中，我并没有在我的 dist 目录中找到 webpack 打包好的文件，它们去哪呢？
2 通过查看 webpack-dev-server 的 package.json 文件，我们知道其依赖于 webpack-dev-middleware 库，那么 webpack-dev-middleware 在 HMR 过程中扮演什么角色？
3 使用 HMR 的过程中，通过 Chrome 开发者工具我知道浏览器是通过 websocket 和 webpack-dev-server 进行通信的，但是 websocket 的 message 中并没有4 发现新模块代码。打包后的新模块又是通过什么方式发送到浏览器端的呢？为什么新的模块不通过 websocket 随消息一起发送到浏览器端呢？
5 浏览器拿到最新的模块代码，HMR 又是怎么将老的模块替换成新的模块，在替换的过程中怎样处理模块之间的依赖关系？

前面服务器和浏览器之间的部分可以参看文章中的图，很清晰
参考：https://juejin.im/post/5d6d0ee5f265da03f66ddba9#heading-24
关于模块替换部分
可参考hotApply部分
https://github.com/kaola-fed/blog/issues/238

