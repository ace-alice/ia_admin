import request from '@/service/request'

// 获取分组列表
export function list(params: any) {
  return request({
    url: '/admin/admin.FileGroup/getList',
    method: 'get',
    params,
  })
}

// 获取分组列表
export function info(params: { id: string | number }) {
  return request({
    url: '/admin/admin.FileGroup/info',
    method: 'get',
    params,
  })
}

// 新增分组
export function add(data: any) {
  return request({
    url: '/admin/admin.FileGroup/add',
    method: 'post',
    data,
  })
}

// 编辑分组
export function edit(data: any) {
  return request({
    url: '/admin/admin.FileGroup/edit',
    method: 'post',
    data,
  })
}

// 删除分组
export function del(data: any) {
  return request({
    url: '/admin/admin.FileGroup/del',
    method: 'post',
    data,
  })
}

// 修改分组是否禁用
export function isDisable(data: any) {
  return request({
    url: '/admin/admin.FileGroup/disable',
    method: 'post',
    data,
  })
}

export default { list, add, edit, del, info, isDisable }
