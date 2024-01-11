import request from '@/service/request'

// 获取作废审核列表
export function list(params: any) {
  return request({
    url: '/admin/project.Project/getList',
    method: 'get',
    params,
  })
}

// 审核
export function voidApi(data: any) {
  return request({
    url: '/admin/project.Project/cancelProject',
    method: 'post',
    data,
  })
}
// 注单作废
export function cancelBet(data: any) {
  return request({
    url: '/admin/project.Project/cancelProject',
    method: 'post',
    data,
  })
}
// 获取总计信息
export function getSumApi(data: any) {
  return request({
    url: '/admin/project.Project/getSum',
    method: 'post',
    data,
  })
}

// 根据注单ID获取串关列表
export function getParlayList(data: any) {
  return request({
    url: '/admin/project.Project/getParlayList',
    method: 'post',
    data,
  })
}

export default {
  list,
  cancelBet,
  getSumApi,
  getParlayList,
}
