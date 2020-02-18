---
title: vue相关（编码习惯）
date: 2019-08-23 21:13:51
tags: 
- vue
categories: 
- vue
---
# 1 computed中不要写异步，且箭头函数中的this指针指向undefined，所以尽量不要写箭头函数
computed有缓存
async computed插件 
vue-rx 用这个可以实现，所以尤大大觉得不用支持https://github.com/vuejs/vue-rx/blob/master/README-CN.md

# 2 https://juejin.im/post/5be01d0ce51d450700084925（使用小技巧）

# 3 陆文总结
1 遵守Vue的单向数据流；
   不要直接修改 props，这样会使得数据的变化让人迷惑，难以维护；
   节制地使用 $parent 和 $children - 它们的主要目的是作为访问组件的应急方法（这里是文档中描述的，算是强调了不推荐用于访问数据），当你直接使用或者直接改变他们，同样会使得数据的变化让人迷惑，难以维护。
   推荐使用 props 传递数据，用 event 达到改变数据的目的，在复杂的场景下，（仔细）考虑（是否需要）引入Vuex
2 在data中添加的属性应该都是在template中使用的；
  不该把data看成"变量存储地"(例如你只是想声明一个变量用来在几个方法中公用)；因为这样除了会使得一些普通变量被vue添加了get跟set使得它不纯洁了(还浪费内存)，还使得data中的属性太多，使得业务逻辑变得不清晰了。
3 尽量少直接操作dom；
  当然有不得不这样做的场景，这里就另外思考是不是真的“不得不这样做”了），这与vue的理念不符，尽量使用vue的语法完成相关功能。（换句话说就是，是不是真的需要vue项目里引用jQuery呢？）
4 v-for尽量与key同时使用，并且尽量不要用index作key；否则，在你对v-for的数组进行更新操作的时候，很可能会有因为key的问题导致渲染出错。
   ```bash
   // App.vue
      <template>
        <div>
          <son v-for="(item, index) in list" :key="index">{{item}}</son>
        </div>
      </template>
      <script>
      import Son from './Son.vue';
      export default {
        data() {
          return {
            list: ['b', 'c']
          }
        }, 
        components: { Son },
        mounted() {
          // 延时1s，模拟点击事件
          setTimeout(() => {
            this.list.unshift('a');
          }, 1000);
        },
      };
      </script>


      // Son.vue
      <template>
        <div ref="item"><slot /></div>
      </template>
      <script>
      export default {
        mounted() {
          console.log(this.$refs.item);
        },
      };
      </script>
    ```
5 避免 v-if 和 v-for 用在一起；
  这种场景下，我们一般是为了过滤某些项，推荐的做法是：
  使用计算属性计算出过滤后的列表；
  将v-if放在v-for之上。这是因为当 Vue 处理指令时，v-for 比 v-if 具有更高的优先级，所以哪怕我们只需要渲染列表中的几项，也会在重渲染的时候遍历整个列表，无论原本的几项是否发生改变。
6 节制地使用mixins，因为很可能只有你知道mixin了哪些方法；并且妙用指令，可以使得很多非业务类型的代码更清晰通用。
7 尽量少用 magic number，统一写到constant的文件中，实在项目忙想偷懒也简单写个注释吧
# 4 官方
https://cn.vuejs.org/v2/style-guide/#%E9%81%BF%E5%85%8D-v-if-%E5%92%8C-v-for-%E7%94%A8%E5%9C%A8%E4%B8%80%E8%B5%B7-%E5%BF%85%E8%A6%81