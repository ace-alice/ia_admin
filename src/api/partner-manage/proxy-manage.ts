import request from '@/service/request'

// 获取代理列表
export function list(params?: any) {
  return request({
    url: '/admin/partner.Proxy/list',
    method: 'get',
    params,
  })
}

// 新增代理
export function add(data: any) {
  return request({
    url: '/admin/partner.Proxy/add',
    method: 'post',
    data,
  })
}

// 编辑代理
export function edit(data: any) {
  return request({
    url: '/admin/partner.Proxy/edit',
    method: 'post',
    data,
  })
}

// 设置代理是否禁用
export function isDisable(data: any) {
  return request({
    url: '/admin/partner.Proxy/updateStatus',
    method: 'post',
    data,
  })
}

// 修改代理配置
// export function editConfig(data: any) {
//   return request({
//     url: '/admin/partner.Company/config',
//     method: 'post',
//     data,
//   })
// }

// 修改代理代理配置
// export function editAgentConfig(data: any) {
//   return request({
//     url: '/admin/partner.Company/updateCompanyProxy',
//     method: 'post',
//     data,
//   })
// }

// 代理账号列表
export function getAccountListApi(params: any) {
  return request({
    url: '/admin/partner.Proxy/accountList',
    method: 'get',
    params,
  })
}

// 添加代理账号
export function addAcount(data: any) {
  return request({
    url: '/admin/partner.Proxy/accountAdd',
    method: 'post',
    data,
  })
}

// 修改代理账号
export function editAcount(data: any) {
  return request({
    url: '/admin/partner.Proxy/accountEdit',
    method: 'post',
    data,
  })
}

// 修改代理账号状态
export function editAcountStatus(data: any) {
  return request({
    url: '/admin/partner.Proxy/updateAccountStatus',
    method: 'post',
    data,
  })
}

export default {
  list,
  add,
  edit,
  isDisable,
  getAccountListApi,
  addAcount,
  editAcount,
  editAcountStatus,
}
