用来改变this
bind 不会立即执行，返回的是个函数
```bash
Function.prototype.bind = function(ctx){
  self = this
  return function(){
    return self.apply(ctx,arguments)
  }
}
```
call和apply就是参数不一样，call的一个个列出来的，apply是类数组