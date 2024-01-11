import request from '@/service/request'

// 获取两次设置赛果不一致日志
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
