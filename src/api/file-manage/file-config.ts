import request from '@/service/request'

// 获取文件列表
export function list(params: any) {
  return request({
    url: '/admin/admin.File/getList',
    method: 'get',
    params,
  })
}

// 获取文件信息
export function info(params: { id: string | number }) {
  return request({
    url: '/admin/admin.File/getInfo',
    method: 'get',
    params,
  })
}

// 新增文件
export function add(data: any) {
  return request({
    url: '/admin/admin.File/add',
    method: 'post',
    data,
  })
}

// 编辑文件
export function edit(data: any) {
  return request({
    url: '/admin/admin.File/edit',
    method: 'post',
    data,
  })
}

// 删除文件
export function del(data: any) {
  return request({
    url: '/admin/admin.File/del',
    method: 'post',
    data,
  })
}

// 修改文件是否禁用
export function isDisable(data: any) {
  return request({
    url: '/admin/admin.File/disable',
    method: 'post',
    data,
  })
}

// 文件修改分组
export function editGroup(data: any) {
  return request({
    url: '/admin/admin.File/editGroup',
    method: 'post',
    data,
  })
}

// 文件修改类型
export function editType(data: any) {
  return request({
    url: '/admin/admin.File/editType',
    method: 'post',
    data,
  })
}

// 文件修改域名
export function editDomain(data: any) {
  return request({
    url: '/admin/admin.File/editDomain',
    method: 'post',
    data,
  })
}

// 获取三方网宿云的token
export function getWcsToken() {
  return request({
    url: '/admin/admin.File/getWcsToken',
    method: 'post',
  })
}

export default {
  list,
  add,
  edit,
  del,
  info,
  isDisable,
  editGroup,
  editType,
  editDomain,
}
