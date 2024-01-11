import request from '@/service/request'

// 玩法报表
export function list(params?: any) {
  return request({
    url: '/admin/report.Risk/detail',
    method: 'get',
    params,
  })
}

export default {
  list,
}
