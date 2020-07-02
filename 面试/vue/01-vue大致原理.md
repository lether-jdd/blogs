首先，需要利用Object.defineProperty，将要观察的对象，转化成getter/setter，以便拦截对象赋值与取值操作，称之为Observer；
需要将DOM解析，提取其中的指令与占位符，并赋与不同的操作，称之为Compiler；
需要将Compile的解析结果，与Observer所观察的对象连接起来，建立关系，在Observer观察到对象数据变化时，接收通知，同时更新DOM，称之为Watcher；
最后，需要一个公共入口对象，接收配置，协调上述三者，称为Vue;

https://www.csdn.net/gather_26/MtTaAgzsMjY5My1ibG9n.html