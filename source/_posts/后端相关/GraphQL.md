---
title: graphQl
date: 2019-08-23 21:13:51
tags:
categories: 
- 后端
---
主要是针对在联调阶段存在的问题：让前端可定制接口返回数据，这样就省去了前后端对接口，字段改动更新文档等问题。
graphQl：服务端支持graphQl服务，客户端查询的时候可以自定义返回的结构，存在安全性权限问题
APIJSON：另外一种协议，在权限等问题上做了一些东西，至于为什么没有推广不太清楚

graphQl在浏览器中查询:
```bash
const input = {name: "jack", sex: "male", content: "jacks content"};
const query= `
mutation ($input: MessageInput!) {
  createMessage(input: $input){
        id
        name
        sex
        content
    }
}`;

fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    query,
    variables: { input }
  })
})
.then(r => r.json())
.then(data => console.log('data returned:', data))
.catch(error => console.log(error));
```