import { ElMessage } from 'element-plus'
import { floor } from 'lodash-es'

const showMsg = (msg: any, cb?: Function) => {
  ElMessage({
    message: msg,
    type: 'success',
    duration: 3000,
  })
  if (cb) {
    setTimeout(() => {
      cb()
    }, 2000)
  }
}
// 小数位
const numFixed = (num: number, decimal = 2) => {
  return floor(num, decimal)
}

export {
  showMsg,
  numFixed,
}
