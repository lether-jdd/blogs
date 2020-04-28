# 1 对vuex的看法
- 概念解析：vuex是一种vue生态中的状态管理库。采用集中式存储管理应用的所有组件的状态。
- 适用场景：什么场景下需要vuex:多个组件共享状态（如果不用的话代码难以维护，例如：多层嵌套）,中大型单页应用。
- 横向比较：redux,flux，简单的应用也可以通过store模式来解决状态共享。Vuex 负责全局状态的管理，Store 模式负责局部状态的交流，eventBus有时候找不到事件触发
- 使用：
  1 store中定义（mutation,state）,commit提交mutation来改变state
  为什么要提交mutation而不是直接修改state:因为可以更明确地追踪到状态的变化，有机会去实现一些能记录每次状态改变，保存状态快照的调试工具
  2 Mutation 必须是同步函数
  6 action 处理异步 action中可以执行异步之后提交Mutation，store.dispatch来分发action 
  2 mapState生成计算属性（返回的是一个对象）
  3 getter：过滤组合state作用（可返回对象或者函数）
  4 mapGetters：将getter映射到组件的计算属性
  5 mapMutations,mapActions
  6 载荷方式和对象方式 分发mutation和action
  7 store.dispatch 可以处理被触发的 action 的处理函数返回的 Promise，并且 store.dispatch 仍旧返回 Promise
  8 未解决模块臃肿问题提出module
```bash
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
  action:{
    increment (context) {
      store.commit('increment')
    }
  }
})
store.dispatch('increment')
```
- 原理：https://tech.meituan.com/2017/04/27/vuex-code-analysis.html
  1 是怎么注入的：vue.use()  install的时候会把Vue传进去，版本>=2时,通过Vue.mixin，<2时，通过重写Vue的init方法。重写的和mixin的都是子组件是通过引用父组件的store层层注入进去的逻辑
  2 怎么实现相应的：this._vm._data.$$state = state  
  3 还有更多的可以看文章
- 扩展：是不是可以把项目中的常量作为插件注入到vue中，这样就不用每个文件都引用一下了
> store模式简单实现 
> 参考：https://juejin.im/post/5cd50849f265da03a54c3877
```bash
注意：关于异步的实现还未实现
const FormStore = function(form, initialState = {}) {
   // 将父组件的示例保存在Store里面
  if (!form) {
    throw new Error('Form is required.')
  }
  this.form = form

  this.states = { ... }
  // initialState 里面的值必须是 this.states声明过的，这样所有状态的变化应该都在store里面可以查找，并由store控制
  for (let prop in initialState) {
    if (initialState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
      this.states[prop] = initialState[prop]
    }
  }
}
FormStore.prototype.mutations = {
  setFormAttribute(states, formAttribute) {
    this.states = { ...states, formAttribute }
  },
  setFormItems(states, formItems) {
    this.states = { ...states, formItems }
  },
  setClickedIndex(states, clickedIndex) {
    this.states = { ...states, clickedIndex }
  },
  setFormItemToHandle(states, formItemToHandle) {
    this.states = { ...states, formItemToHandle }
  },
  setItemInFormItems(states, idx, formItem) {
    states.formItems.splice(idx, 1, formItem)
  },
  setFromItems(states, formItems) {
    this.states = { ...states, formItems }
  }
}
// 定义
FormStore.prototype.commit = function(name, ...args) {
  const mutations = this.mutations
  console.log('emit', name)
  if (mutations[name]) {
    // states 作为第一个参数
    mutations[name].apply(this, [this.states].concat(args))
  } else {
    throw new Error(`Action not found: ${name}`)
  }
}
// 分发事件
this.store.commit('setFormItemToHandle', val)
//使用
data() {
    const store = new FormStore(this);  //返回的是一个对象，还带着原型，这里面还是很有意思的啊
    return {
      store  //在这里借助vue实现响应式
    };
},
```
# 2 vue从data改变到页面渲染的过程（可以更详细点）
1 setter方法会通知依赖此data的 watcher 实例重新计算（派发更新）,从而使它关联的组件重新渲染。
2 组件更新会进行patchVnode流程（diff）
3 根据diff的结果更新节点
# 3 vue2 和vue3 响应方式的对比
vue2 对象是通过Object.defineProperty的get和set来监听，如果是深层次的话就来个递归（性能问题）
     对于数组是通过函数劫持来监听（重写Array里面的函数）
vue3 使用ES6的Proxy方式
# 4 vue3新功能
CompositionAPI
# 5 vue原理
https://www.html.cn/interview/15331.html
# 6  组件渲染和更新过程
https://github.com/webVueBlog/interview-answe/issues/197