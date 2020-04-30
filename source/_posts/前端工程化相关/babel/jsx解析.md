# 3 怎么解析jsx语法 
通过在babel中配置babel-plugin-transform-react-jsx 插件
在babel-plugin-transform-react-jsx插件中使用了https://github.com/babel/babel/blob/master/packages/babel-helper-builder-react-jsx-experimental/src/index.js  这个babel插件，应该是在这个里面具体转化的，可以看一下