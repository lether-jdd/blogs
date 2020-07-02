数据劫持是实现双向绑定的一部分
vue利用数据劫持+发布订阅实现双向绑定
# 1 数据劫持的方式
Object.defineProperty
proxy(es6新出的)
```bash
const p = new Proxy(obj, {
  get(target, key, value) {
    if (key === 'c') {
      return '我是自定义的一个结果';
    } else {
      return target[key];
    }
  },

  set(target, key, value) {
    if (value === 4) {
      target[key] = '我是自定义的一个结果';
    } else {
      target[key] = value;
    }
  }
})
```