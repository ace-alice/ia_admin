import request from '@/service/request'
// 赛事等级列表
export function list(params?: any) {
  return request({
    url: '/admin/game.EventLevel/list',
    method: 'get',
    params,
  })
}
// 添加赛事等级
export function add(data: any) {
  return request({
    url: '/admin/game.EventLevel/add',
    method: 'post',
    data,
  })
}
// 编辑赛事等级
export function edit(data: any) {
  return request({
    url: '/admin/game.EventLevel/edit',
    method: 'post',
    data,
  })
}
// 启用/禁用赛事等级
export function updateStatus(data: any) {
  return request({
    url: '/admin/game.EventLevel/updateStatus',
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
