import request from '@/service/request'

// 获取域名列表
export function list(params?: any) {
  return request({
    url: '/admin/site.Domain/list',
    method: 'get',
    params,
  })
}

// 新增域名
export function add(data: any) {
  return request({
    url: '/admin/site.Domain/add',
    method: 'post',
    data,
  })
}
// 编辑域名
export function edit(data: any) {
  return request({
    url: '/admin/site.Domain/edit',
    method: 'post',
    data,
  })
}
// 修改域名状态
export function updateStatus(data: any) {
  return request({
    url: '/admin/site.Domain/updateStatus',
    method: 'post',
    data,
  })
}

export default {
  list,
  add,
  edit,
  updateStatus,
}
