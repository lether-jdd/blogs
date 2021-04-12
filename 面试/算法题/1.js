//找出超过一半的
function find(str){
  let count = 0;
  let num = str[0];
  for(let i =0;i<str.length;i++){
    if(count == 0){
      num = str[i]
    }
    if(str[i] == num){
      count ++
    }else{
      count --
    }
  }
  return num
}
//正负抵消的思想 怎么判断最后那个是不是   再遍历一遍

function find(str){
  let count = 0;
  let num = str[0];
  for(let i =0;i<str.length;i++){
    if(count == 0){
      num = str[i]
    }
    if(str[i] == num){
      count ++
    }else{
      count --
    }
  }
  return num
}
