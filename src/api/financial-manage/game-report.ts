import request from '@/service/request'

// 总盘口报表
export function list(params?: any) {
  return request({
    url: '/admin/report.Game/list',
    method: 'get',
    params,
  })
}

export default {
  list,
}
