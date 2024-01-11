import request from '@/service/request'

// 玩法报表
export function list(params?: any) {
  return request({
    url: '/admin/report.PlayEvent/list',
    method: 'get',
    params,
  })
}

export default {
  list,
}
