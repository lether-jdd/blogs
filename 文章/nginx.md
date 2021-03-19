# 模块划分
## main模块
全局指令
- pid存放路径
- 日志存放路径
- 配置文件引入
## events块
影响nginx服务器或与用户的网络连接
- 每个进程的最大连接数
- 选取哪种事件驱动模型处理连接请求
- 是否允许同时接受多个网路连接
- 开启多个网络连接序列化
## http块
嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置
- 文件引入，
- mime-type定义，
- 日志自定义，
- 是否使用sendfile传输文件，
- 连接超时时间，
- 单连接请求数等。
## server块
配置虚拟主机的相关参数
## location块
配置请求的路由，以及各种页面的处理情况
# 指令解析
## 指令执行顺序
1 执行 server 块的 rewrite 指令
2 执行location匹配
3 执行选定的location中的rewrite指令
## rewrite指令
可以在server块或location块中配置
```
rewrite regex replacement [flag];
```
- flag标志来终止指令的进一步处理
- 如果替换字符串replacement以http：//，https：//或$ scheme开头，则停止处理后续内容，并直接重定向返回给客户端

### 1 举例说明：
```
location / {
    # 当匹配 正则表达式 /test1/(.*)时 请求将被临时重定向到 http://www.$1.com
    # 相当于 flag 写为 redirect
    rewrite /test1/(.*) http://www.$1.com;
    return 200 "ok";
}
此时将临时重定向到 www.baidu.com，return指令将不执行
```
```
location / {
    # 当匹配 正则表达式 /test1/(.*)时 请求将被临时重定向到 http://www.$1.com
    # 相当于 flag 写为 redirect
    rewrite /test1/(.*) www.$1.com;
    return 200 "ok";
}
这时候将执行return指令
```
### 2 flag
当没有flag的时候会一直匹配：
```
location / {
    # 顺序执行如下两条rewrite指令 
    rewrite ^/test1 /test2;
    rewrite ^/test2 /test3;  # 此处发起新一轮location匹配 uri为/test3
}

location = /test2 {
    return 200 "/test2";
}  

location = /test3 {
    return 200 "/test3";
}
# 发送如下请求
# curl 127.0.0.1:8080/test1
# /test3
```
- last:只终止当前location的rewrite查询，不会终止下一轮location查询
```
location / {
    rewrite ^/test1 /test2;
    rewrite ^/test2 /test3 last;  # 此处发起新一轮location匹配 uri为/test3
    rewrite ^/test3 /test4;
    proxy_pass http://www.baidu.com;
}

location = /test2 {
    return 200 "/test2";
}  

location = /test3 {
    return 200 "/test3";
}
location = /test4 {
    return 200 "/test4";
}
最终匹配大location /test3
```
- break:终止rewrite查询，也会终止location查询，但是不会终止proxy_pass
```
location / {
    rewrite ^/test1 /test2;
    # 此处 不会 发起新一轮location匹配；当是会终止执行后续rewrite模块指令 重写后的uri为 /more/index.html
    rewrite ^/test2 /more/index.html break;  
    rewrite /more/index\.html /test4; # 这条指令会被忽略

    # 因为 proxy_pass 不是rewrite模块的指令 所以它不会被 break终止
    proxy_pass https://www.baidu.com;
}
最终访问：https://www.baidu.com/more/index.html;
即使将 proxy_pass 放在 带有 break 的 rewrite上面它也是会执行的，这就要扯到nginx的执行流程了
```
- redirect:
- permanent:
## location
rewrite 是在同一域名内更改获取资源的路径，而 location 是对一类路径做控制访问或反向代理，可以 proxy_pass 到其他机器
匹配path
-  = 完全匹配
```
location = /abcd
/abcd?param1&param2  匹配
/abcd/ 不匹配
/abcde 不匹配
```
- ~  区分大小写
```
location ~ ^/abcd$   必须以/开始，以$结束，中间必须是abcd
```
- ~* 不区分大小写
- @ 内部使用
## proxy_pass
主要是对域名进行代理，路径也可以在此更改
## try_files
### 匹配
proxy-pass 后带路径与不带路径
- 不带路径
```
location /api/ {
    proxy_pass http://node:8080;  //不带路径
}
会传过来匹配的完整路径：
访问：   /api/xx                         后端：   /api/xx
```
- 带路径
```
location /api/ {
    proxy_pass http://node:8080/;  //带路径 (或者/test)
}
会传过来匹配到的部分
访问：   /api/xx              匹配了xx拼在/后面           后端：   /xx
访问：   /api/xx              匹配了xx拼在/test后面       后端：   /testxx

```
proxy-pass 遇到location正则的话就不能带路径了，最好用rewrite重写路径
## 不同指令继承关系
server继承main；location继承server；upstream既不会继承指令也不会被继承，它有自己的特殊指令，不需要在其他地方的应用
# 日志格式
配置日志格式及日志路径

# 其他
## upstream：一般用来配置负载均衡
```
upstream favtomcat {
    server 10.0.6.108:7080;
    server 10.0.0.85:8980;
}
location / {
    root   html;
    index  index.html index.htm;
    proxy_pass http://favtomcat;
}
```
### upstream分配策略：
- 1 权重
```
upstream favtomcat{
    server 10.0.0.77 weight=5;
    server 10.0.0.88 weight=10;
}
```
- 2 ip_hash
```
upstream favresin{
      ip_hash;
      server 10.0.0.10:8080;
      server 10.0.0.11:8080;
}
```
- 3 fair:按后端服务器的响应时间来分配请求
```
upstream favresin{     
      server 10.0.0.10:8080;
      server 10.0.0.11:8080;
      fair;
}
```
- 4 url_hash
```
upstream resinserver{
      server 10.0.0.10:7777;
      server 10.0.0.11:8888;
      hash $request_uri;
      hash_method crc32;
}
```
### 设备设置状态值
- down 表示单前的server暂时不参与负载.
- weight 默认为1.weight越大，负载的权重就越大。
- max_fails ：允许请求失败的次数默认为1.当超过最大次数时，返回proxy_next_upstream 模块定义的错误.
- fail_timeout : max_fails次失败后，暂停的时间。
- backup： 其它所有的非backup机器down或者忙的时候，请求backup机器。所以这台机器压力会最轻。
## 地址重写 vs 地址转发
- 地址重写会改变浏览器中的地址，使之变成重写成浏览器最新的地址。而地址转发他是不会改变浏览器的地址的。
- 地址重写会产生两次请求，而地址转发只会有一次请求
-  地址转发一般发生在同一站点项目内部，而地址重写且不受限制
-  地址转发的速度比地址重定向快
## 防盗链配置
校验refer
# 注意事项
每个指令必须有分号结束


error-log 测试