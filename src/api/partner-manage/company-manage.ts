import request from '@/service/request'

// 获取公司列表
export function list(params?: any) {
  return request({
    url: '/admin/partner.Company/list',
    method: 'get',
    params,
  })
}

// 新增公司
export function add(data: any) {
  return request({
    url: '/admin/partner.Company/add',
    method: 'post',
    data,
  })
}

// 编辑公司
export function edit(data: any) {
  return request({
    url: '/admin/partner.Company/edit',
    method: 'post',
    data,
  })
}

// 设置公司是否禁用
export function isDisable(data: any) {
  return request({
    url: '/admin/partner.Company/updateStatus',
    method: 'post',
    data,
  })
}

// 修改公司配置
export function editConfig(data: any) {
  return request({
    url: '/admin/partner.Company/config',
    method: 'post',
    data,
  })
}

// 修改公司代理配置
export function editAgentConfig(data: any) {
  return request({
    url: '/admin/partner.Company/updateCompanyProxy',
    method: 'post',
    data,
  })
}

// 修改收款点位配置
export function editPointConfig(data: any) {
  return request({
    url: '/admin/partner.Company/updateReceiptConfig',
    method: 'post',
    data,
  })
}

export default {
  list,
  add,
  edit,
  isDisable,
  editConfig,
  editAgentConfig,
  editPointConfig,
}
