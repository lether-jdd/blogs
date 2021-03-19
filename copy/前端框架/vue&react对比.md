# 1 思想上
vue遵循结构（html），表现(css)，行为(js)分离的形式
react整体上是函数式的思维（all  in js）
# 2 组件上
vue单文件组件
react类组件和函数组件
# 3 数据管理
Vue中通过数据劫持来监听更改
react通过diff
vue基于可变数据的，支持双向绑定
react单向数据流，属性是不允许更改的
# 4 组件交互
vue通过props + 自定义事件（子组件emit）
react通过props + 回调(通过props将事件传下去，在子组件中调用)
# 5 跨组件交互
vue中通过依赖注入
react中通过Context实现
# 6 样式的处理
# 7 diff算法
vue会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。而对于React而言,每当应用的状态被改变时,全部组件都会重新渲染,所以react中会需要shouldComponentUpdate这个生命周期函数方法来进行控制。
# 8 与native结合
一套代码多种平台上运行
vue和Weex进行官方合作
react与react-native
# 9 ssr
react   Next.js 
vue Nuxt.js
