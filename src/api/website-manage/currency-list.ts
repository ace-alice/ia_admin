import request from '@/service/request'

// 获取币种列表
export function list(params?: any) {
  return request({
    url: '/admin/site.Currency/list',
    method: 'get',
    params,
  })
}

// 新增币种
export function add(data: any) {
  return request({
    url: '/admin/site.Currency/add',
    method: 'post',
    data,
  })
}
// 编辑币种信息
export function edit(data: any) {
  return request({
    url: '/admin/site.Currency/edit',
    method: 'post',
    data,
  })
}
// 修改币种汇率
export function updateExchange(data: any) {
  return request({
    url: '/admin/site.Currency/updateExchange',
    method: 'post',
    data,
  })
}

export default {
  list,
  add,
  edit,
  updateExchange,
}
