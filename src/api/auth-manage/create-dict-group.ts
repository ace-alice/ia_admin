import request from '@/service/request'

// 字典列表
export function list(params?: any) {
  return request({
    url: '/admin/admin.DictionaryGroup/list',
    method: 'get',
    params,
  })
}
// 新增
export function add(data: any) {
  return request({
    url: '/admin/admin.DictionaryGroup/add',
    method: 'post',
    data,
  })
}
// 编辑
export function edit(data: any) {
  return request({
    url: '/admin/admin.DictionaryGroup/edit',
    method: 'post',
    data,
  })
}
// 删除
export function del(data: any) {
  return request({
    url: '/admin/admin.DictionaryGroup/del',
    method: 'post',
    data,
  })
}
// 更新字典组状态
export function updateStatus(data: any) {
  return request({
    url: '/admin/admin.DictionaryGroup/updateStatus',
    method: 'post',
    data,
  })
}
export function getDictGroup() {
  return request({
    url: '/admin/admin.DictionaryGroup/getAllDictGroup',
    method: 'get',
  })
}
export default {
  list,
  add,
  edit,
  del,
  updateStatus,
  getDictGroup,
}
