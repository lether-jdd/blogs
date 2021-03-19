//浏览器中：
//1
setTimeout(() => {
  console.log('timeout')
}, 2)
new Promise((res, rej) => {
  res('micro run')
}).then((res) => {
  console.log(res)
})
process.nextTick(() => { console.log('next tick') })
setImmediate(() => { console.log('setImmeiate') })

//2
new Promise((res, rej) => {
  console.log(1)
  res(2)
}).then(res => { console.log(res) })
async function a() {
  console.log(3)
  await console.log(4)
  console.log(5)
}
a()


//错误处理及在node不同版本中的输出
//规范中的输出