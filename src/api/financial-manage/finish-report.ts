import request from '@/service/request'

// 获取结算列表
export function list(params?: any) {
  return request({
    url: '/admin/report.SettleReport/list',
    method: 'get',
    params,
  })
}

export default {
  list,
}
