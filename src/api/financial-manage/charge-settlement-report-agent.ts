import request from '@/service/request'

// 账变列表
export function list(params?: any) {
  return request({
    url: '/admin/report.Settle/list',
    method: 'get',
    params,
  })
}

export default {
  list,
}
