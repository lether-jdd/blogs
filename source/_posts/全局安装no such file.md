npm全局安装reverse-sourcemap（为了追查压缩后的文件）
可反解打包后的文件

报错发现：
env: node\r: No such file or directory   

经查找是因为
脚本是在dos命令上，在mac上需要转一下（参考https://github.com/ooowinfe/blog/blob/master/%E8%A7%A3%E5%86%B3mac%20os%E4%B8%8B%20npm%20%E5%85%A8%E5%B1%80%E5%AE%89%E8%A3%85%E5%90%8E%E6%89%A7%E8%A1%8C%E5%91%BD%E4%BB%A4%E6%8A%A5%E9%94%99%EF%BC%9Aenv:%20node%5Cr:%20No%20such%20file%20or%20directory.md）


npm  root -g  查看npm全局安装路径


源码定位：source-location  这个库输入行数列数可以定位（但是好像不太准）


火狐的source-map库也可以直接输出https://github.com/mozilla/source-map#consuming-a-source-map