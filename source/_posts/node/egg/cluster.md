1 cluster是什么
在服务器上同时启动多个进程。
每个进程里都跑的是同一份源代码（好比把以前一个进程的工作分给多个进程去做）。
更神奇的是，这些进程可以同时监听一个端口（

负责启动其他进程的叫做 Master 进程，他好比是个『包工头』，不做具体的工作，只负责启动其他进程。
其他被启动的叫 Worker 进程，Worker 进程的数量一般根据服务器的 CPU 核数来定

2 问题
Worker 进程异常退出以后该如何处理？
多个 Worker 进程之间如何共享资源？
多个 Worker 进程之间如何调度？

3 进程守护
导致进程退出的两种情况： 未捕获异常；系统异常，OOM（out of memory）

4 master/agent/worker
master 负责启动其他进程(类似Pm2)
agent  Agent 好比是 Master 给其他 Worker 请的一个『秘书』，它不对外提供服务，只给 App Worker 打工，专门处理一些公共事务，业务相关的不要放在agent


5 进程间通信（IPC）
封装了一个 messenger 对象挂在 app / agent 实例上，提供一系列友好的 API。
