diff算法：计算一棵树形结构转换成另一棵树形结构的最少操作
# 1 传统的diff算法
通过循环递归对节点进行依次对比
复杂度是n^3  为什么？
# 2 react  diff 优化
tree diff:只对，相同层级的节点进行对比，即使是跨层级移动，也会先删除再重建
component diff:对于同一类型的组件，根据VDom是否变化来更新（或者shouldComponentUpdate）来更新；不同类型的组件，会替换所有子节点
element diff: 通过key来区分复用。