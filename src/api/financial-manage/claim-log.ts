import request from '@/service/request'

// 玩法报表
export function list(params?: any) {
  return request({
    url: '/admin/report.ClaimLog/list',
    method: 'get',
    params,
  })
}

// 获取认领类型
export function getTypeList() {
  return request({
    url: '/admin/report.Claim/getTypes',
    method: 'get',
  })
}

export default {
  list,
  getTypeList,
}
