# 如何监听增量改变  该部分在record/observer文件中
1 对于mutations,使用MutationObserver进行观察，根据mutation的type进行对比，拼接add,delete,text,attributes,然后触发
2 对于鼠标事件，监听mousemove和touchmove事件，并进行了防抖的处理
3  MouseUp,
  MouseDown,
  Click,
  ContextMenu,
  DblClick,
  Focus,
  Blur,
  TouchStart,
  TouchMove_Departed, 
  TouchEnd, 对于这些事件也都绑定在Windows上进行监听
4 scroll事件等各种 
# 监听的顺序
DomContentLoaded 0 
load 1
Meta 4
FullSnapshot 2  网页初始化的状态
IncrementalSnapshot 页面中的活动都属于这一类

测出来的问题：对于立马增加又立马删除的动作没有捕获到

# 关于回放
对于不同事件的还原在replay/index/getCastFn函数中
rebuild走的是rrweb-snapshot中的逻辑
关于Incremental走的是applyIncremental中的逻辑
关于鼠标使用canvas
关于滚动就是原生的滚动
关于mutations就是使用api


