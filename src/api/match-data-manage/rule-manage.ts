import request from '@/service/request'
// 玩法规则列表
export function list(params?: any) {
  return request({
    url: '/admin/game.PlayRule/list',
    method: 'get',
    params,
  })
}
// 新增
export function add(data: any) {
  return request({
    url: '/admin/game.PlayRule/add',
    method: 'post',
    data,
  })
}
// 编辑
export function edit(data: any) {
  return request({
    url: '/admin/game.PlayRule/edit',
    method: 'post',
    data,
  })
}
// 启用/禁用玩法规则
export function updateStatus(data: any) {
  return request({
    url: '/admin/game.PlayRule/updateStatus',
    method: 'post',
    data,
  })
}
export function getTypeLang() {
  return request({
    url: '/admin/game.PlayRule/getTypeLang',
    method: 'get',
  })
}

export default {
  list,
  add,
  edit,
  updateStatus,
  getTypeLang,
}
