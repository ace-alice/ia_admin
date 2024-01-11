import request from '@/service/request'

// 获取文件列表
export function list(params: any) {
  return request({
    url: '/admin/user.Group/list',
    method: 'get',
    params,
  })
}

// 新增文件
export function add(data: any) {
  return request({
    url: '/admin/user.Group/add',
    method: 'post',
    data,
  })
}

// 编辑文件
export function edit(data: any) {
  return request({
    url: '/admin/user.Group/edit',
    method: 'post',
    data,
  })
}

// 删除文件
export function del(data: any) {
  return request({
    url: '/admin/user.Group/del',
    method: 'post',
    data,
  })
}

// 修改文件是否禁用
export function isDisable(data: any) {
  return request({
    url: '/admin/user.Group/status',
    method: 'post',
    data,
  })
}

export default {
  list,
  add,
  edit,
  del,
  isDisable,
}
