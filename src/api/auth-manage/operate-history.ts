import request from '@/service/request'

// 获取操作记录列表
export function list(params?: any) {
  return request({
    url: '/admin/admin.AdminLog/list',
    method: 'get',
    params,
  })
}
export function getParams() {
  return request({
    url: '/admin/admin.AdminLog/getOperateLogParams',
    method: 'get',
  })
}

export default {
  list,
  getParams,
}
