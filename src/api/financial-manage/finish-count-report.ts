import request from '@/service/request'

// 获取结算数量
export function list(params?: any) {
  return request({
    url: '/admin/report.Company/list',
    method: 'get',
    params,
  })
}

export default {
  list,
}
