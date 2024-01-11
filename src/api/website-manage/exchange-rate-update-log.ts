import request from '@/service/request'

// 获取汇率变更日志
export function list(params?: any) {
  return request({
    url: '/admin/site.RateLog/list',
    method: 'get',
    params,
  })
}

export default {
  list,
}
