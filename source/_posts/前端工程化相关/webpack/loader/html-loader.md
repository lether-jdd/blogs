地址： git@github.com:webpack-contrib/html-loader.git
主要功能：
1 替换请求（例如a标签的href）路径：
    使用htmlparser2 解析html匹配出需要替换的标签属性 , 
    使用loader-utils包的urlToRequest得到importKey(应该是资源source),之后插入// Imports部分代码
    插入// Module  部分代码  替换code中___HTML_LOADER_REPLACER_0___的路径
    插入导出代码
真正替换之后
```bash
// Imports
var ___HTML_LOADER_GET_SOURCE_FROM_IMPORT___ = require("../node_modules/html-loader/dist/runtime/getUrl.js");
var ___HTML_LOADER_IMPORT_0___ = require("./image.jpg"); //file-loader会将对应文件的import或require解析成一个url，所以需要配合file-loader使用

// Module
var ___HTML_LOADER_REPLACER_0___ = ___HTML_LOADER_GET_SOURCE_FROM_IMPORT___(___HTML_LOADER_IMPORT_0___);
var code = "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">\n  <title>React</title>\n</head>\n\n<body>\n  <img src=\"" + ___HTML_LOADER_REPLACER_0___ + "\">\n  <div id=\"app\"></div>\n</body>\n\n</html>";
// Exports
module.exports = code;
```

2 压缩：使用html-minifier-terser进行压缩
可借鉴：自定义了一个插件机制，作为一个插件流程
```bash
export function pluginRunner(plugins) {
  return {
    process: (content) => {
      const result = { messages: [] };

      for (const plugin of plugins) {
        // eslint-disable-next-line no-param-reassign
        content = plugin(content, result);
      }

      result.html = content;

      return result;
    },
  };
}
```