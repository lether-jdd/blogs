/**
 * 场景：小程序低版本sdk不支持捕获异步错误，即使在外层包一层promise的判断也还是不能把所有的错误捕获上报，所以想着把所有的函数使用trycatch包一层
 */
const parser = require('@babel/parser')
const traverse = require('babel-traverse').default
const types = require('babel-types')
const generate = require("@babel/generator").default
export default function () {
  return {
    visitor: {
      ExpressionStatement(path, state) { 
        debugger
        let arguments1 = path.node.expression.arguments
        let properties;
        let oldBody;
        if (arguments1) { 
          arguments1&&arguments1.forEach(argument => {
            properties = argument.properties
            properties && properties.forEach(property => { 
              if ((property.value && property.value.type == "FunctionExpression")) {
                console.log(1111)
                oldBody = property.value.body
                const catchClause = types.catchClause(types.Identifier('e'), types.BlockStatement([]))
                const tryClause = types.tryStatement(oldBody, catchClause)
                const block = types.blockStatement([tryClause])
                property.value.body = block
              } else if (property.type == 'ObjectMethod') { 
                console.log(222)
                oldBody = property.body
                const catchClause = types.catchClause(types.Identifier('e'), types.BlockStatement([]))
                const tryClause = types.tryStatement(oldBody, catchClause)
                const block = types.blockStatement([tryClause])
                property.body = block
              }
            })
          });
        }
        // const catchClause = t.catchClause(t.Identifier('e'), t.BlockStatement([]))
        // const tryClause = t.tryStatement(oldBody, catchClause)
        // const block = t.blockStatement([tryClause])
        // console.log(tryClause)
        // path.node.body = block
      }
    },
  };
}