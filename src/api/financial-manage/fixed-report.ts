import request from '@/service/request'

// 固赔统计报表
export function list(params?: any) {
  return request({
    url: '/admin/report.Fixed/list',
    method: 'get',
    params,
  })
}

export default {
  list,
}
