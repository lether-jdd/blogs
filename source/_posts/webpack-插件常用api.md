---
title: webpack-插件常用api
date: 2019-08-23 21:13:51
tags: 
- webpack
- plugin
categories: 
- 构建&其他
---
# 常用概念及api
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
  ## emit钩子
    生成资源到 output 目录之前
# 常用插件解析
## HtmlWebpackPlugin
    功能：自动创建一个html文件，该文件包含webpack打包生成的bundles。因为bundle会带上版本号，所以这种自动生成就会比较便利。
    原理：在compiler的emit钩子中对html的内容进行修改（将相应的assets加在对应的标签里并插入进html中相应的位置（head/body））,并通过html-minifier压缩后生成要输出的html内容等一些操作，最后通过修改compilation.assets来生成html文件。
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