import request from '@/service/request'

// 用户列表
export function list(params: any) {
  return request({
    url: '/admin/user.User/list',
    method: 'get',
    params,
  })
}

// 增减金额
export function manualAmount(data: any) {
  return request({
    url: '/admin/user.User/manualAmount',
    method: 'post',
    data,
  })
}
// 用户限额
export function userEditLimit(data: any) {
  return request({
    url: '/admin/user.User/userEditLimit',
    method: 'post',
    data,
  })
}
// 修改风控标签
export function editRisk(data: any) {
  return request({
    url: '/admin/user.User/editRisk',
    method: 'post',
    data,
  })
}
// 公司信息
export function getAllComp() {
  return request({
    url: '/admin/company.Company/getAll',
    method: 'get',
  })
}
// 用户组信息
export function getAllUserGroup() {
  return request({
    url: '/admin/user.Group/getAllUserGroup',
    method: 'get',
  })
}
// 风控标签
export function getAllRiskLabel() {
  return request({
    url: '/admin/risk.Tags/getAll',
    method: 'get',
  })
}
export function userLimitInfo(data: any) {
  return request({
    url: '/admin/user.User/userLimitInfo',
    method: 'post',
    data,
  })
}
export function userLimitList(data: any) {
  return request({
    url: '/admin/user.User/userLimitList',
    method: 'post',
    data,
  })
}
// 获取所有代理信息
export function getAllProxy() {
  return request({
    url: '/admin/proxy.Proxy/getAll',
    method: 'post',
  })
}
// 用户批量加入用户组
export function addtoGroup(data: any) {
  return request({
    url: '/admin/user.User/batchAddUserGroup',
    method: 'post',
    data,
  })
}
// 用户批量移出用户组
export function removetoGroup(data: any) {
  return request({
    url: '/admin/user.User/batchRemoveUserGroup',
    method: 'post',
    data,
  })
}

export default {
  list,
  manualAmount,
  userEditLimit,
  editRisk,
  getAllComp,
  getAllUserGroup,
  getAllRiskLabel,
  userLimitInfo,
  userLimitList,
  getAllProxy,
  addtoGroup,
  removetoGroup,
}
