---
title: rewire原理
date: 2019-08-23 21:13:51
tags:
- rewire
- 测试
categories: 
- 测试相关
---
莫名的缘分使我看到了rewire这个库，于是就好奇怎么实现的，接下来就围绕这个库展开。
## 背景知识介绍
github地址：https://github.com/jhnns/rewire
1. rewire做了什么？
rewire给每个模块增加了setter和getter方法，以便可以访问内部的变量。
2. review可以用来干什么？
  - inject mocks for other modules or globals like process
  - inspect private variables
  - override variables within the module. 
3. review怎么用？
  参考github链接
## 原理剖析
`源码版本号：rewire@4.0.0   node@12.9.0`
1. 怎么给每个模块加上setter 和 getter ？
  rewire.js文件中可看到：
  ``` bash
    appendix = "\n" + getDefinePropertySrc();
    appendix += "})();";
    moduleEnv.inject(prelude, appendix);
  ```
  getDefinePropertySrc：
  该函数的作用就是拼接setter、getter、with函数。
  ``` bash
  var __get__ = require("./__get__.js");
  var __set__ = require ("./__set__.js");
  var __with__ = require("./__with__.js");

  var srcs = {
      "__get__": __get__.toString(),
      "__set__": __set__.toString(),
      "__with__": __with__.toString()
  };

  function getDefinePropertySrc() {
      var src = "if (typeof(module.exports) === 'function' || \n" +
              "(typeof(module.exports) === 'object' && module.exports !== null && Object.isExtensible(module.exports))) {\n";

      src += Object.keys(srcs).reduce(function forEachSrc(preValue, value) {
          return preValue += "Object.defineProperty(module.exports, '" +
              value +
              "', {enumerable: false, value: " +
              srcs[value] +
              ", "+
              "writable: true}); ";
      }, "");

      src += "\n}";

      return src;
  }
  ```
  inject方法：
  将拼接好setter和getter的内容拼接到Module的wrapper属性中，方便之后_compile函数通过wrapSafe函数对模块进行拼接(在node源码中)。
  ``` bash
  var Module = require("module"),
  function inject(prelude, appendix) {
      Module.wrapper[0] = moduleWrapper0 + prelude;
      Module.wrapper[1] = appendix + moduleWrapper1;
  }
  ```
  接下来rewire文件进入到load方法中，这个方法才真正将模块内容拼接好。
  ```bash
    moduleEnv.load(targetModule);
  ```
  load方法中调用module的load对模块进行装载（targetModule.load(targetModule.id);）
  ```bash
    function load(targetModule) {
      nodeRequire = targetModule.require;
      targetModule.require = requireProxy;
      currentModule = targetModule;

      registerExtensions();
      targetModule.load(targetModule.id);

      // This is only necessary if nothing has been required within the module
      reset();
    }
  ```
  module的load方法可在node源码中找到,通过执行Module._extensions[extension](this, filename);方法然后调用_compile方法对模块进行装载。
  ```bash
    Module.prototype.load = function(filename) {
      debug('load %j for module %j', filename, this.id);

      assert(!this.loaded);
      this.filename = filename;
      this.paths = Module._nodeModulePaths(path.dirname(filename));

      const extension = findLongestRegisteredExtension(filename);
      Module._extensions[extension](this, filename);
      this.loaded = true;

      if (experimentalModules) {
        const ESMLoader = asyncESM.ESMLoader;
        const url = `${pathToFileURL(filename)}`;
        const module = ESMLoader.moduleMap.get(url);
        // Create module entry at load time to snapshot exports correctly
        const exports = this.exports;
        if (module !== undefined) { // Called from cjs translator
          if (module.reflect) {
            module.reflect.onReady((reflect) => {
              reflect.exports.default.set(exports);
            });
          }
        } else { // preemptively cache
          ESMLoader.moduleMap.set(
            url,
            new ModuleJob(ESMLoader, url, async () => {
              return createDynamicModule(
                [], ['default'], url, (reflect) => {
                  reflect.exports.default.set(exports);
                });
            })
          );
        }
      }
    };
    Module._extensions['.js'] = function(module, filename) {
      const content = fs.readFileSync(filename, 'utf8');
      module._compile(content, filename);
    };
  ```
  接下来看一下registerExtensions（require.extensions这个api已经废弃）
  ```bash
    function registerExtensions() {
      var originalJsExtension = require.extensions[".js"];
        var originalCoffeeExtension = require.extensions[".coffee"];

        if (originalJsExtension) {
            originalExtensions.js = originalJsExtension;
        }
        if (originalCoffeeExtension) {
            originalExtensions.coffee = originalCoffeeExtension;
        }
        require.extensions[".js"] = jsExtension;
        require.extensions[".coffee"] = coffeeExtension;
    }
  ```
  jsExtension函数，在该函数中重写了module的_compile函数
  ```bash
  function jsExtension(module, filename) {
    var _compile = module._compile;

    module._compile = function (content, filename) {
        var noConstAssignMessage = linter.verify(content, eslintOptions).find(isNoConstAssignMessage);
        var line;
        var column;

        if (noConstAssignMessage !== undefined) {
            line = noConstAssignMessage.line;
            column = noConstAssignMessage.column;
            throw new TypeError(`Assignment to constant variable at ${ filename }:${ line }:${ column }`);
        }

        _compile.call(
            module,
            content.replace(matchConst, "$1let  $2"), // replace const with let, while maintaining the column width
            filename
        );
    };

    restoreExtensions();
    originalExtensions.js(module, filename);
  }
  ```
  而Module的wrapper，看node源码（path:node/lib/internal/modules/cjs/loader.js）可找到如下代码：
  ```bash
    let wrap = function(script) {
      return Module.wrapper[0] + script + Module.wrapper[1];
    };

    const wrapper = [
      '(function (exports, require, module, __filename, __dirname) { ',
      '\n});'
    ];
    let wrapperProxy = new Proxy(wrapper, {
      set(target, property, value, receiver) {
        patched = true;
        return Reflect.set(target, property, value, receiver);
      },

      defineProperty(target, property, descriptor) {
        patched = true;
        return Object.defineProperty(target, property, descriptor);
      }
    });
    Object.defineProperty(Module, 'wrap', {
      get() {
        return wrap;
      },

      set(value) {
        patched = true;
        wrap = value;
      }
    });

    Object.defineProperty(Module, 'wrapper', {
      get() {
        return wrapperProxy;
      },

      set(value) {
        patched = true;
        wrapperProxy = value;
      }
    });
  ```
  **总结**
  rewire主要是通过更改Module的wrapper实现的对模块的拼接。
  rewire一个文件的路径：注入wrapper，调用Module的load
  而require函数也是通过调用load方法加载模块。
2. 怎么通过getter实现对内部的访问
  ```bash
    function __get__() {
        arguments.varName = arguments[0];
        if (arguments.varName && typeof arguments.varName === "string") {
            return eval(arguments.varName);
        } else {
            throw new TypeError("__get__ expects a non-empty string");
        }
    }
  ```
  原理同
  ```bash
    function a(){
      let private =function(){
        console.log('111')
      }
      let exports = {
        get(name){
          return eval(name)
        }
      }
      return exports
    }
    a().get('private')
  ```
  3. 遗留
     在node的module源码中也能看到require,这个require指的是？
     还有了解了proxy,
     Reflect.set(target, property, value, receiver);
     除了拦截get\set还可以拦截defineProperty
  
   
  
     