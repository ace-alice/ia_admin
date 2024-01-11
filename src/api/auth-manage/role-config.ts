import request from '@/service/request'

// 获取角色列表
export function list(params: any) {
  return request({
    url: '/admin/admin.Role/getList',
    method: 'get',
    params,
  })
}
// 获取角色列表-new
export function roleLists() {
  return request({
    url: '/admin/admin.Role/getRoleList',
    method: 'get',
  })
}

// 新增角色
export function add(data: any) {
  return request({
    url: '/admin/admin.Role/add',
    method: 'post',
    data,
  })
}

// 编辑角色
export function edit(data: any) {
  return request({
    url: '/admin/admin.Role/edit',
    method: 'post',
    data,
  })
}

// 删除角色
export function del(data: any) {
  return request({
    url: '/admin/admin.Role/del',
    method: 'post',
    data,
  })
}

// 分配菜单
export function grantedMenu(data: any) {
  return request({
    url: '/admin/admin.Role/edit',
    method: 'post',
    data,
  })
}

// 获取菜单树
export function getMenuTree() {
  return request({
    url: '/admin/admin.Role/menu',
    method: 'post',
  })
}

// 获取角色详情
export function getRoleInfo(data: any) {
  return request({
    url: '/admin/admin.Role/getInfo',
    method: 'post',
    data,
  })
}

// 禁用角色
export function isDisable(data: any) {
  return request({
    url: '/admin/admin.Role/disable',
    method: 'post',
    data,
  })
}

export default { list, roleLists, add, edit, del, getMenuTree, getRoleInfo, isDisable }
