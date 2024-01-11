import request from '@/service/request'

// 获取反结算报表
export function list(params?: any) {
  return request({
    url: '/admin/report.Refinish/list',
    method: 'get',
    params,
  })
}

export default {
  list,
}
