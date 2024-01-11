import request from '@/service/request'

// 用户报表
export function list(params?: any) {
  return request({
    url: '/admin/report.User/list',
    method: 'get',
    params,
  })
}

export default {
  list,
}
