import request from '@/service/request'

// 获取风控会员列表
export function list(params?: any) {
  return request({
    url: '/admin/risk.UserBlacks/lists',
    method: 'get',
    params,
  })
}

// 新增风控会员
export function add(data: any) {
  return request({
    url: '/admin/risk.UserBlacks/add',
    method: 'post',
    data,
  })
}

// 编辑风控会员
export function edit(data: any) {
  return request({
    url: '/admin/risk.UserBlacks/edit',
    method: 'post',
    data,
  })
}

// 删除风控会员
export function del(data: any) {
  return request({
    url: '/admin/risk.UserBlacks/del',
    method: 'post',
    data,
  })
}

// 历史数据
export function getHistory(data: any) {
  return request({
    url: '/admin/risk.UserBlacks/history',
    method: 'post',
    data,
  })
}

export default { list, add, edit, del, getHistory }
