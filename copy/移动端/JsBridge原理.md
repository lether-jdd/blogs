---
title: JsBridge原理
date: 2019-08-23 21:13:51
tags:
categories: 
- 移动端
---
# h5与native之间进行通信
## js调用ios
  目前兼顾兼容性、比较成熟的方案还是通过拦截URL的方式。（目前的一种统一方案是:H5触发url scheme->Native捕获url scheme->原生分析,执行->原生调用h5）
  UIWebView的特性，在UIWebView内发起的所有网络请求，都可以在Native层被捕捉到。
  利用这一特性，就可以在UIWebView内发起一个自定义的网络请求，一般格式：jsbridge://method?参数1=value1&参数2=value2
  于是在UIWebView中，只要发现是jsbridge://开头的url，就不进行内容的加载，而是执行相应的逻辑处理。
  嵌入webview的h5中的js一般是通过动态创建隐藏iframe标签，赋值上文提到的链接给src，iframe不会引起页面调转、刷新。
  ```bash
    var src= 'jsbridge://method?参数1=value1&参数2=value2';
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = src;
    document.body.appendChild(iframe);
    //再删除iframesetTimeout(function() {
        iframe.remove();
    }, 50);
  ```
  结合美团的KNB可以想象一下KNB是怎么实现的
## js调用android
  - WebView的addJavascriptInterface进行对象映射（低版本Android4以下好像有一些安全问题，本人没有验证）
  - WebViewClient 的  shouldOverrideUrlLoading 方法回调拦截 url 
  - WebChromeClient 的onJsAlert、onJsConfirm、onJsPrompt方法回调拦截JS对话框alert()、- confirm()、prompt() 消息

  ```bash
  设计一个jsbridge主要分几大步骤：
  第一步：设计出一个Native与JS交互的全局中间对象（knb）
  第二步：JS如何调用Native(通过iframe发起请求url schema,android也可以不通过iframe)
  第三步：Native如何得知api被调用（ios:UIWebView拦截请求）
  第四步：分析url-参数和回调的格式
  第五步：Native如何调用JS
  第六步：H5中api方法的注册以及格式
  ```