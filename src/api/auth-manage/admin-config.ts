import request from '@/service/request'

// 获取操作员列表
export function list(params?: any) {
  return request({
    url: '/admin/admin.Admin/getList',
    method: 'get',
    params,
  })
}

// 新增操作员
export function add(data: any) {
  return request({
    url: '/admin/admin.Admin/add',
    method: 'post',
    data,
  })
}

// 编辑操作员
export function edit(data: any) {
  return request({
    url: '/admin/admin.Admin/edit',
    method: 'post',
    data,
  })
}

// 删除操作员
export function del(data: any) {
  return request({
    url: '/admin/admin.Admin/del',
    method: 'post',
    data,
  })
}

// 重置密码
export function initPwd(data: any) {
  return request({
    url: '/admin/admin.Admin/pwd',
    method: 'post',
    data,
  })
}

// 设置用户是否是超管
export function isSuperAdmin(data: any) {
  return request({
    url: '/admin/admin.Admin/super',
    method: 'post',
    data,
  })
}

// 设置用户是否禁用
export function isDisable(data: any) {
  return request({
    url: '/admin/admin.Admin/disable',
    method: 'post',
    data,
  })
}

export function getAdminByRole(role_id: string) {
  return request({
    url: '/admin/admin.Role/getAdminListByRole',
    method: 'post',
    data: {
      limit: 10000,
      role_id,
    },
  })
}

export default { list, add, edit, del, initPwd, isSuperAdmin, isDisable, getAdminByRole }
