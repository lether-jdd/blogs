---
title: lambda演算
date: 2019-08-23 21:13:51
tags:
categories: 
- 构建&其他
---
1  docker的主要能力是环境隔离
不同应用有不同的环境变量，当多个应用在同一台机器上，为了避免冲突，所以需要环境隔离。
2 docker经常会与虚拟机进行对比
3 docker镜像是根据dockerfile文件创建的，
  镜像一般是在别的镜像基础上构建
  创建完镜像之后需要生成容器（docker container run）
  同一个 image 文件，可以生成多个同时运行的容器实例。
4 常见配置
```bash
FROM node:8.4：该 image 文件继承官方的 node image，冒号表示标签，这里标签是8.4，即8.4版本的 node。
COPY . /app：将当前目录下的所有文件（除了.dockerignore排除的路径），都拷贝进入 image 文件的/app目录。
WORKDIR /app：指定接下来的工作路径为/app。
RUN npm install：在/app目录下，运行npm install命令安装依赖。注意，安装后所有的依赖，都将打包进入 image 文件。
EXPOSE 3000：将容器 3000 端口暴露出来， 允许外部连接这个端口。
```


https://yeasy.gitbook.io/docker_practice/basic_concept/container
5 镜像、容器、仓库
Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。
容器是镜像运行时的实体。容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的 命名空间。因此容器可以拥有自己的 root 文件系统、自己的网络配置、自己的进程空间，甚至自己的用户 ID 空间。