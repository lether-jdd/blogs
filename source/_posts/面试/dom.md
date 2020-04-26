  # 1 精确获取页面元素位置的方式有哪些
  elem.getBoundingClientRect() return {left,right,top,bottom}  相对于视窗
  document.documentElement.scrollLeft 再加上滚动值之后就是绝对位置
  