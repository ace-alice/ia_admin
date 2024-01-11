import request from '@/service/request'

// 获取作废 玩法及注单列表
export function list(params: any) {
  return request({
    url: '/admin/admin.AdminLog/abortLogs',
    method: 'get',
    params,
  })
}

export default {
  list,
}
