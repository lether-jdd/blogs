---
title: babel模块化相关
date: 2019-08-23 21:13:51
tags: 
- webpack
- 模块化
- babel
categories: 
- 构建&其他
---
1 babel将es6的模块化语言（import，export）转化成commonjs的模块化方式
还会给exports上加上__esModule  表示由 es6 转换来的 commonjs 输出
```bash
Object.defineProperty(exports, "__esModule", {
  value: true
});
``` 
给模块的输出对象增加 __esModule 是为了将不符合 Babel 要求的 CommonJS 模块转换成符合要求的模块，这一点在 require 的时候体现出来。如果加载模块之后，发现加载的模块带着一个 __esModule 属性，Babel 就知道这个模块肯定是它转换过的，这样 Babel 就可以放心地从加载的模块中调用 exports.default 这个导出的对象，也就是 ES6 规定的默认导出对象，所以这个模块既符合 CommonJS 标准，又符合 Babel 对 ES6 模块化的需求。然而如果 __esModule 不存在，也没关系，Babel 在加载了一个检测不到 __esModule 的模块时，它就知道这个模块虽然符合 CommonJS 标准，但可能是一个第三方的模块，Babel 没有转换过它，如果以后直接调用 exports.default 是会出错的，所以现在就给它补上一个 default 属性，就干脆让 default 属性指向它自己就好了，这样以后就不会出错了。

为什么转化后（0,fn()）这样执行是因为这样可以挂载在全局

2 webpack
webpack在对模块进行构建时会给模块放在函数里面，函数的传参视情况而定；
对于函数的参数现在看来是在 /lib/module  下的这段代码中看是用哪个export
```bash
get exportsArgument() {
		return (this.buildInfo && this.buildInfo.exportsArgument) || "exports";
	}
```
exportsArgument 是在HarmonyDetectionParserPlugin插件中进行修改的。具体修改条件：
```bash
const isStrictHarmony = parser.state.module.type === "javascript/esm";
const isHarmony =
  isStrictHarmony ||
  ast.body.some(
    statement =>
      statement.type === "ImportDeclaration" ||
      statement.type === "ExportDefaultDeclaration" ||
      statement.type === "ExportNamedDeclaration" ||
      statement.type === "ExportAllDeclaration"
  );
```

在FunctionModuleTemplatePlugin  插件中进行组装。
function(module, __webpack_exports__, __webpack_require__)

function(module, exports, __webpack_require__)

3 transform-runtime | babel-runtime | babel-polyfill


Babel 只是转换 syntax 层语法,所以需要 @babel/polyfill 来处理API兼容,又因为 polyfill 体积太大，所以通过 preset的 useBuiltIns 来实现按需加载,再接着为了满足 npm 组件开发的需要 出现了 @babel/runtime 来做隔离（因为会污染）


在转换 ES2015 语法为 ECMAScript 5 的语法时，babel 会需要一些辅助函数，例如 _extend。babel 默认会将这些辅助函数内联到每一个 js 文件里，这样文件多的时候，项目就会很大。

所以 babel 提供了 transform-runtime 来将这些辅助函数“搬”到一个单独的模块 babel-runtime 中，这样做能减小项目文件的大小。

在webpack中，babel-plugin-transform-runtime 实际上是依赖babel-runtime
transform-runtime    默认引入了polyfill
babel-runtime和 babel-plugin-transform-runtime的区别是，相当一前者是手动挡而后者是自动挡，每当要转译一个api时都要手动加上require('babel-runtime')，

built-ins


Babel 把 Javascript 语法 分为 syntax 和 api
api 指那些我们可以通过 函数重新覆盖的语法

4  引入transform-runtime插件之后exports * 就报错
   1 可以注释掉Comment this line 'defineProperty: "object/define-property"' in babel-plugin-transform-runtime/lib/definitions.js 
   2 配置["transform-runtime", {
      "polyfill": false
    }]
  3  "presets": [
        { "plugins": [ "transform-runtime" ] },
        {
            "passPerPreset": false,
            "presets": [ "es2015", "stage-1" ]
        }
    ]

5 为什么

我们的模块已经被转成了cmd的形式，可是webpack还是按照es6的模式在处理