import request from '@/service/request'

// 字典列表
export function list(params?: any) {
  return request({
    url: '/admin/admin.AdminDictionary/list',
    method: 'get',
    params,
  })
}
// 新增
export function add(data: any) {
  return request({
    url: '/admin/admin.AdminDictionary/add',
    method: 'post',
    data,
  })
}
// 编辑
export function edit(data: any) {
  return request({
    url: '/admin/admin.AdminDictionary/edit',
    method: 'post',
    data,
  })
}
// 删除
export function del(data: any) {
  return request({
    url: '/admin/admin.AdminDictionary/del',
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

export function getDictByGroupApi(key: string) {
  return request({
    url: '/admin/admin.AdminDictionary/getDictByGroup',
    method: 'get',
    params: {
      key,
    },
  })
}
export default {
  list,
  add,
  edit,
  del,
  getDictGroup,
}
