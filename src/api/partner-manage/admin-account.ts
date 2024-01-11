import request from '@/service/request'

// 获取账号列表
export function list(params?: any) {
  return request({
    url: '/admin/partner.AdminAccount/list',
    method: 'get',
    params,
  })
}

// 新增账号
export function add(data: any) {
  return request({
    url: '/admin/partner.AdminAccount/add',
    method: 'post',
    data,
  })
}

// 编辑账号
export function edit(data: any) {
  return request({
    url: '/admin/partner.AdminAccount/edit',
    method: 'post',
    data,
  })
}

// 设置账号是否禁用
export function isDisable(data: any) {
  return request({
    url: '/admin/partner.AdminAccount/updateStatus',
    method: 'post',
    data,
  })
}

export default {
  list,
  add,
  edit,
  isDisable,
}
