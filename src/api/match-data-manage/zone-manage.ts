import request from '@/service/request'
// 赛区列表
export function list(params?: any) {
  return request({
    url: '/admin/game.Zone/list',
    method: 'get',
    params,
  })
}
// 添加赛区
export function add(data: any) {
  return request({
    url: '/admin/game.Zone/add',
    method: 'post',
    data,
  })
}
// 启用禁用赛区
export function updateStatus(data: any) {
  return request({
    url: '/admin/game.Zone/updateStatus',
    method: 'post',
    data,
  })
}
// 编辑赛区
export function edit(data: any) {
  return request({
    url: '/admin/game.Zone/edit',
    method: 'post',
    data,
  })
}

export default {
  list,
  add,
  updateStatus,
  edit,
}
