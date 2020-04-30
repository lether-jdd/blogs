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
# 1 babel将es6的模块化语言（import，export）转化成commonjs的模块化方式
还会给exports上加上__esModule  表示由 es6 转换来的 commonjs 输出
```bash
Object.defineProperty(exports, "__esModule", {
  value: true
});
``` 
给模块的输出对象增加 __esModule 是为了将不符合 Babel 要求的 CommonJS 模块转换成符合要求的模块，这一点在 require 的时候体现出来。如果加载模块之后，发现加载的模块带着一个 __esModule 属性，Babel 就知道这个模块肯定是它转换过的，这样 Babel 就可以放心地从加载的模块中调用 exports.default 这个导出的对象，也就是 ES6 规定的默认导出对象，所以这个模块既符合 CommonJS 标准，又符合 Babel 对 ES6 模块化的需求。然而如果 __esModule 不存在，也没关系，Babel 在加载了一个检测不到 __esModule 的模块时，它就知道这个模块虽然符合 CommonJS 标准，但可能是一个第三方的模块，Babel 没有转换过它，如果以后直接调用 exports.default 是会出错的，所以现在就给它补上一个 default 属性，就干脆让 default 属性指向它自己就好了，这样以后就不会出错了。

为什么转化后（0,fn()）这样执行是因为这样可以挂载在全局

# 2 webpack
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

# 3 transform-runtime | babel-runtime | babel-polyfill
Babel 是处于构建时（也就是传统Java等语言的编译时），转译出来的结果在默认情况下并不包括 ES6 对运行时的扩展，例如，builtins（内建，包括 Promise、Set、Map 等）、内建类型上的原型扩展（如 ES6 对 Array、Object、String 等内建类型原型上的扩展）以及Regenerator（用于generators / yield）等都不包括在内。
- core-js标准库
  它提供了 ES5、ES6 的 polyfills，包括 promises 、symbols、collections、iterators、typed arrays、ECMAScript 7+ proposals、setImmediate 等等。
- regenerator 运行时库
  用来实现 ES6/ES7 中 generators、yield、async 及 await 等相关的 polyfills
- babel-runtime
  由 core-js 与 regenerator-runtime 库组成，除了做简单的合并与映射外，并没有做任何额外的加工。
  在使用时，必须在每一处需要用到 Promise 的 module 里，手工引入 promise 模块
- babel-plugin-transform-runtime
  这个插件让 Babel 发现代码中使用到 Symbol、Promise、Map 等新类型时，自动且按需进行 polyfill，
  如果正在开发一个库或者工具的时候建议用这个插件，因为没有全局变量和 prototype 污染。不适合应用中
  没有全局污染：就是不会在global中挂载；
  没有prototype污染：就是不会重写内建类型的prototype
  怎么实现没有污染：通过引入替换
- babel-polyfill:
  Polyfill features that are missing in your target environment
  一般用在一个应用中，而不是库或者工具中。
  babel-node会自动会自动加载这个库。
  它会以全局变量的形式 polyfill Map、Set、Promise 之类的类型，也会以类似 Array.prototype.includes() 的方式去注入污染原型
  如果你的浏览器已经支持 Promise，它会优先使用 native 的 Promise，如果没有的话，则会采用 polyfill 的版本


