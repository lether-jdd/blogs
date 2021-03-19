---
title: webpack-插件常用api
date: 2019-08-23 21:13:51
tags: 
- webpack
- plugin
categories: 
- 构建&其他
---
# 1 常用概念
  ## chunk 
     钩子：compilation.chunks  存储代码块，为数组。
     描述：代码块(chunk)由多个模块组成，Webpack 会根据 Chunk 去生成输出的文件资源，每个 Chunk 都对应一个及其以上的输出文件
     例如在 Chunk 中包含了 CSS 模块并且使用了 ExtractTextPlugin 时， 该 Chunk 就会生成 .js 和 .css 两个文件  ？？
  ## module  
     钩子：通过 chunk.forEachModule 能读取组成代码块的每个模块，
     描述：module.fileDependencies 存放当前模块的所有依赖的文件
     note: 在webpack中所有可以
  ## compilation.assets 
     最后要输出的资源都在这里
  ## compiler的emit钩子
    生成资源到 output 目录之前
# 2 常用api
插件功能：以用来修改输出文件、增加输出文件、甚至可以提升 Webpack 性能
## 2.1 读取输出资源、代码块、模块及其依赖
emit 事件发生时，代表源文件的转换和组装已经完成，在这里可以读取到最终将输出的资源、代码块、模块及其依赖，并且可以修改输出资源的内容。
```bash
class Plugin {
  apply(compiler) {
    compiler.plugin('emit', function (compilation, callback) {
      // compilation.chunks 存放所有代码块，是一个数组
      compilation.chunks.forEach(function (chunk) {
        // chunk 代表一个代码块
        // 代码块由多个模块组成，通过 chunk.forEachModule 能读取组成代码块的每个模块
        chunk.forEachModule(function (module) {
          // module 代表一个模块
          // module.fileDependencies 存放当前模块的所有依赖的文件路径，是一个数组
          module.fileDependencies.forEach(function (filepath) {
          });
        });

        // Webpack 会根据 Chunk 去生成输出的文件资源，每个 Chunk 都对应一个及其以上的输出文件
        // 例如在 Chunk 中包含了 CSS 模块并且使用了 ExtractTextPlugin 时，
        // 该 Chunk 就会生成 .js 和 .css 两个文件
        chunk.files.forEach(function (filename) {
          // compilation.assets 存放当前所有即将输出的资源
          // 调用一个输出资源的 source() 方法能获取到输出资源的内容
          let source = compilation.assets[filename].source();
        });
      });

      // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
      // 如果忘记了调用 callback，Webpack 将一直卡在这里而不会往后执行。
      callback();
    })
  }
}

作者：浩麟
链接：https://juejin.im/post/5a5c18f2518825734f52ad65
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```
## 2.2 监听文件变化
 Webpack 会从配置的入口模块出发，依次找出所有的依赖模块，当入口模块或者其依赖的模块发生变化时， 就会触发一次新的 Compilation。
 此时可监听watch-run
 ```bash
 compiler.plugin('watch-run', (watching, callback) => {
	// 获取发生变化的文件列表
	const changedFiles = watching.compiler.watchFileSystem.watcher.mtimes;
	// changedFiles 格式为键值对，键为发生变化的文件路径。
	if (changedFiles[filePath] !== undefined) {
	  // filePath 对应的文件发生了变化
	}
	callback();
});

作者：浩麟
链接：https://juejin.im/post/5a5c18f2518825734f52ad65
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```
默认情况下 Webpack 只会监视入口和其依赖的模块是否发生变化，在有些情况下项目可能需要引入新的文件，我们需要把文件加入到依赖列表中
```bash
compiler.plugin('after-compile', (compilation, callback) => {
  // 把 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动一次编译
	compilation.fileDependencies.push(filePath);
	callback();
});
```
## 2.3 修改输出资源
有些场景下插件需要修改、增加、删除输出的资源，要做到这点需要监听 emit 事件，因为发生 emit 事件时所有模块的转换和代码块对应的文件已经生成好，
需要输出的资源即将输出，因此 emit 事件是修改 Webpack 输出资源的最后时机。
所有需要输出的资源会存放在 compilation.assets 中，compilation.assets 是一个键值对，键为需要输出的文件名称，值为文件对应的内容。
```bash
compiler.plugin('emit', (compilation, callback) => {
  // 设置名称为 fileName 的输出资源
  compilation.assets[fileName] = {
    // 返回文件内容
    source: () => {
      // fileContent 既可以是代表文本文件的字符串，也可以是代表二进制文件的 Buffer
      return fileContent;
  	},
    // 返回文件大小
  	size: () => {
      return Buffer.byteLength(fileContent, 'utf8');
    }
  };
  callback();
});
```
# 常用插件解析
## HtmlWebpackPlugin
    功能：自动创建一个html文件，该文件包含webpack打包生成的bundles。因为bundle会带上版本号，所以这种自动生成就会比较便利。
    原理：在compiler的emit钩子中对html的内容进行修改（将相应的assets加在对应的标签里并插入进html中相应的位置（head/body））,并通过html-minifier压缩后生成要输出的html内容等一些操作，最后通过修改compilation.assets来生成html文件。（通过子编译器进行html的编译部分见webpack-loader部分）
    配置：chunks
        excludeChunks  更多配置可看官网
    扩展：该插件还提供了（tapable）
        - html-webpack-plugin-alter-chunks
        - html-webpack-plugin-before-html-generation
        - html-webpack-plugin-before-html-processing
        - html-webpack-plugin-alter-asset-tags
        - html-webpack-plugin-after-html-processing
        - html-webpack-plugin-after-emit
        这些钩子，可以在别的插件中进行注册。
    note:在源码中（@^2.30.1）可在emit钩子中看到全都是promise写的，很舒服
## prerender-spa-plugin
    puppeteer地址 https://github.com/GoogleChrome/puppeteer
# 其他
## 示例
```bash
/*
webpack插件测试
1 全局搜索某个变量并记录下来
2 增加输出的资源（index.html）
*/
const fs = require('fs')
const path = require('path')
var Promise = require("bluebird");
function MyAwesomePlugin(options) {
  this.options = options
}
MyAwesomePlugin.prototype.apply = function (compiler) {
  let self = this
  compiler.plugin('emit', function (compilation, callback) {
    //全局搜索某个变量并记录下来
    compilation.modules.forEach(module => {
      //过滤掉node_module下面的文件
      if (module.context && module.context.indexOf('node_modules') == -1) {
        let temp = module.userRequest.split('/')
        let fileName = temp[temp.length - 1].split('.')[0] + ".json"
        fs.readFile(module.resource,{
          encoding: "utf-8"
        }, function (err, fr) {
          if (err) {
            console.log(err);
          } else {
            var regexp = /localizeJdd\("(.*)"\)/g
            let jsonTemp = []
            let match;
            while (match = regexp.exec(fr)) {
              console.log(match)
              jsonTemp.push({
                ch: match[1]
              })
            }
            fs.writeFile(fileName, JSON.stringify(jsonTemp), (err) => {
              console.log(err)
            })
          }
        });
        
      }
    });
    //添加资源(可拓展实现添加script将chunk引入）
    self.addFileToAssets('./index.html', compilation).then(res => { 
      callback()
    })
  })
}
MyAwesomePlugin.prototype.addFileToAssets = function (filename, compilation) {
  filename = path.resolve(compilation.compiler.context, filename);
  return Promise.props({
      size: fs.statAsync(filename),
      source: fs.readFileAsync(filename)
    })
    .catch(function () {
      return Promise.reject(new Error('HtmlWebpackPlugin: could not load file ' + filename));
    })
    .then(function (results) {
      var basename = path.basename(filename);
      compilation.fileDependencies.push(filename);
      compilation.assets[basename] = {
        source: function () {
          return results.source;
        },
        size: function () {
          return results.size.size;
        }
      };
      return basename;
    });
};
module.exports = MyAwesomePlugin
```





1 webpack-deb-server 开启hot和不开启的区别
   


3 babel-loader 和webpack loader开发