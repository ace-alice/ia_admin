import request from '@/service/request'
// 赛事列表
export function list(params?: any) {
  return request({
    url: '/admin/game.Event/list',
    method: 'get',
    params,
  })
}
// 添加赛事
export function add(data: any) {
  return request({
    url: '/admin/game.Event/add',
    method: 'post',
    data,
  })
}
// 修改赛事
export function edit(data: any) {
  return request({
    url: '/admin/game.Event/edit',
    method: 'post',
    data,
  })
}
// 启用/禁用赛事
export function updateStatus(data: any) {
  return request({
    url: '/admin/game.Event/updateStatus',
    method: 'post',
    data,
  })
}
// 获取所有赛事等级名称
export function getEventLevel() {
  return request({
    url: '/admin/game.EventLevel/getAllEventLevel',
    method: 'get',
  })
}
// 修改赛事logo
export function updateEventLogo(data: any) {
  return request({
    url: '/admin/game.EventLevel/getAllEventLevel',
    method: 'get',
    data,
  })
}
// 更新赛事队伍
export function updateEventTeams(data: any) {
  return request({
    url: '/admin/game.EventLevel/updateEventTeams',
    method: 'get',
    data,
  })
}
// 获取游戏类下的所有赛事
export function getAllEventByGameTypeId(data: any) {
  return request({
    url: '/admin/game.EventLevel/getAllEventByGameTypeId',
    method: 'get',
    data,
  })
}
// 扩展信息
export function setEventExtra(data: any) {
  return request({
    url: '/admin/game.EventLevel/setEventExtra',
    method: 'get',
    data,
  })
}
// 获取赛区列表
export function getZoneList(data: any) {
  return request({
    url: '/admin/game.EventLevel/getZoneList',
    method: 'get',
    data,
  })
}

export default {
  list,
  add,
  edit,
  updateStatus,
  getEventLevel,
  updateEventLogo,
  updateEventTeams,
  getAllEventByGameTypeId,
  setEventExtra,
  getZoneList,
}
