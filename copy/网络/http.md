http2  2015年
多路复用，对同一个域的服务器只建立一次TCP连接，加载多个资源，使用二进制帧传输，同时会对http头部进行压缩
http2的分帧传输，它能够极大的减少http(s)请求开销
http2和http1.1
如果系统首屏同一时间需要加载的静态资源非常多，但是浏览器对同一域名的tcp连接数量是有限制的（chrome为6个）超过规定数量的tcp连接，则必须要等到之前的请求收到响应后才能继续发送，而http2则可以在一个tcp连接中并发多个请求没有限制，在一些网络较差的环境开启http2性能提升尤为明显

web服务器Nginx配置，或是直接让服务器支持http2

```
listen 443 ssl http2;
nginx  配置前提是你的nginx版本不能低于1.95，并且已经开启了https
```

PC端浏览器会针对单个域名的server同时建立6～8个连接，手机端的连接数则一般控制在4～6个

# http/1.0 
## 1 请求和连接的关系
每次http请求建立一个TCP连接，服务器完成之后断开连接
缺点： 
1 每次连接都会经历三次握手和慢启动，三次握手在高延迟的场景下影响较明显
2 慢启动则对大文件类请求影响较大，且会造成head of line blocking会导致带宽无法被充分利用，以及后续健康请求被阻塞
## 2 缓存
使用Pragma:no-cache + Last-Modified/If-Modified-Since来作为缓存判断的标准

# http/1.1
## 1 请求与连接的关系
持久连接：引入了持久连接（且默认支持），在一个TCP连接上可以传送多个http请求
要关闭时可以一方头中加上connection:close
缺点：
对头阻塞（Head-of-line blocking）：虽然在同一个TCP连接中可以同时发送多个请求，但是服务器还是按照顺序回应，如果前面的回应特别慢，后面就会有很多请求排队等着，
浏览器客户端在同一时间，针对同一域名下的请求有一定数量限制（一般浏览器的限制是6个）
## 2 缓存
引入了Cache-Control请求头和Etag/If-None-Match
## 3 断点续传
允许只请求资源的某个部分，返回码是206，这样就可以支持断点续传
客户端请求头加上Range：第一字节的位置和最后一个字节的位置
服务器响应头加上Content-Range：当前接受的范围和文件总大小（例如： bytes 0-499/22400）
### 如果传输的过程中文件改变：
请求头中可通过If-Range来传输判断实体有没有发生改变的规则（可以是etag或者modifyed）,服务器端如果支持的话，则会根据这个字段来判断当前实体有没有变化，
如果变化了，则会返回200，发送整个实体，如果未改变，返回206接着返回。


# http/2
HTTP/2协议只在HTTPS环境下才有效，升级到HTTP/2，必须先启用HTTPS。
## 二进制分帧：
HTTP/1.1的头信息是文本（ASCII编码），数据体可以是文本，也可以是二进制；HTTP/2 头信息和数据体都是二进制，统称为“帧”：头信息帧和数据帧；
## 请求与连接
多路复用（双工通信）：客户端和浏览器都可以同时发送多个请求和响应，而不用按照顺序一一对应，这样避免了“队头堵塞”
怎么做到的呢？HTTP/2 把 HTTP 协议通信的基本单位缩小为一个一个的帧，这些帧对应着逻辑流中的消息。并行地在同一个 TCP 连接上双向交换消息。
## 首部压缩
http没有状态，每次请求都携带重复内容，浪费带宽，所以提出压缩
## 服务推
## 怎么支持？
nginx上配置
node的话使用http2包

# https
在传统的HTTP和TCP之间加了一层用于加密解密的SSL/TLS层(Secure Sockets Layer/Transport Layer Security)。
https最终还是使用http进行传输，只是传输的内容经过了加密（对称加密），但对称加密的密钥是用服务器方的证书进行了非对称加密。
过程：
1 客户端发起请求，带上支持的协议版本和加密方法，和一个随机数
2 服务器端确认协议版本和加密方法，并将证书和一个随机数发给客户端
3 客户端从证书中取出公钥，生成随机数，并用公钥加密随机数发给服务端
4 服务端使用私钥解密随机数加上之前的随机数生成通信所用的对称加密的密钥
5 使用密钥加密，正常通信
为什么要使用证书？
怕被拦截

wireshark抓包

app端的请求比较分散且时间跨度相对较大。所以移动端app一般会从应用层寻求其它解决方案，长连接方案或者伪长连接方案：
来越多的移动端app都会建立一条自己的长链接通道，通道的实现是基于tcp协议。基于tcp的socket编程技术难度相对复杂很多，而且需要自己制定协议，但带来的回报也很大。信息的上报和推送变得更及时，在请求量爆发的时间点还能减轻服务器压力（http短连接模式会频繁的创建和销毁连接）。
