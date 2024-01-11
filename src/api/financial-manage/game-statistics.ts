import request from '@/service/request'

// 游戏统计报表
export function list(params?: any) {
  return request({
    url: '/admin/report.GameStatistics/list',
    method: 'get',
    params,
  })
}

export default {
  list,
}
