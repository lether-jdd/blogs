# 1  BFC(Block formatting context)直译为"块级格式化上下文"。
文档流其实分为定位流、浮动流和普通流三种。而普通流其实就是指BFC中的FC。
FC是formatting context的首字母缩写，直译过来是格式化上下文，它是页面中的一块渲染区域，有一套渲染规则，决定了其子元素如何布局，以及和其他元素之间的关系和作用。
# 2 触发条件或者说哪些元素会生成BFC：
1 html元素
2 float不为none
3 overflow的值不为visible
4 display的值为inline-block、table-cell、table-caption
5 position的值为absolute或fixed 　
# 3 布局规则
1 内部的盒子会在垂直方向一个接一个放置
2 margin重叠：box垂直方向上的距离由margin决定,同属于同一个BFC的盒块的margin会发生重叠
例如：上一个div的margin-bottom是100px,下面一个div的margin-top是100px，则两个盒子的间距为100px
3 阻止margin重叠
当两个相邻块级子元素分属于不同的BFC时可以阻止margin重叠
4 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
5 可以清除内部浮动
6 BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素
针对IE要加一个 zoom: 1 触发BFC


