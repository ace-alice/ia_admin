import request from '@/service/request'
// 玩法参数修改记录
export function list(data: any) {
  return request({
    url: '/admin/handicap.Monitor/getHandicapParamRecord',
    method: 'post',
    data,
  })
}

export default {
  list,
}
