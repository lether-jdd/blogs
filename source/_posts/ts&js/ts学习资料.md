---
title: ts学习资料
date: 2020-2-20
tags:
- ts
categories: 
- ts
---
# 1 资料
https://ts.xcatliu.com/advanced/further-reading
# 2 笔记
- [x] 泛型Generics: 
    Array<T>  当每一项输出要与输入一致，且输入类型不一致时可以用泛型
    ```bash
    function createArray<T>(length: number, value: T): Array<T>
    //多个类型
    function swap<T, U>(tuple: [T, U]): [U, T] 
    //泛型约束
    interface Lengthwise {
        length: number;
    }
    function loggingIdentity<T extends Lengthwise>(arg: T): T {
    ```
- [ ] 联合类型Union Types：
   ```bash
   let myFavoriteNumber: string | number;
   ```
- [ ] 接口Interfaces:
   定义对象的类型
   ```bash
    interface Person {
      name: string;
      age: number;
    }
    let tom: Person = {
        name: 'Tom',
        age: 25
    };
    //任意属性
    interface Person {
      name: string;
      readonly id: number; //只读
      age?: number; //可选
      [propName: string]: any; //任意属性
    }
   ```
- [ ] 类型断言Assertion
   使用场景：不确定类型的时候就访问其中一个类型的属性或方法(类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的)
    ```bash
    function getLength(something: string | number): number {
      if ((<string>something).length) {
          return (<string>something).length;
      } else {
          return something.toString().length;
      }
    }
    ```
- [ ] 类型别名
    ```bash
    type NameOrResolver = Name | NameResolver;
    function getName(n: NameOrResolver): string
    ```

- [ ] 声明及声明文件
    xxx.d.ts就是声明文件
    
- [ ] 类与接口