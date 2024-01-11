import request from '@/service/request'
// 赛程列表
export function list(params?: any) {
  return request({
    url: '/admin/game.Schedule/list',
    method: 'get',
    params,
  })
}
// 获取赛事队伍
export function getEventTeams(params?: any) {
  return request({
    url: '/admin/game.Schedule/getEventTeams',
    method: 'get',
    params,
  })
}
// 添加赛程
export function add(data: any) {
  return request({
    url: '/admin/game.Schedule/add',
    method: 'post',
    data,
  })
}
// 修改赛程
export function edit(data: any) {
  return request({
    url: '/admin/game.Schedule/edit',
    method: 'post',
    data,
  })
}
// 删除赛程
export function del(data: any) {
  return request({
    url: '/admin/game.Schedule/delDetail',
    method: 'post',
    data,
  })
}
// 绑定列表
export function bindList(data: any) {
  return request({
    url: '/admin/game.Schedule/scheduleBindList',
    method: 'post',
    data,
  })
}
// 绑定盘口
export function bindGame(data: any) {
  return request({
    url: '/admin/game.Schedule/bindGame',
    method: 'post',
    data,
  })
}
// 更新进度
export function updateSchedule(data: any) {
  return request({
    url: '/admin/game.Schedule/scheduleUpdate',
    method: 'post',
    data,
  })
}
// 获取赛事分区列表
export function getScheduleZoneList(params?: any) {
  return request({
    url: '/admin/game.Schedule/scheduleZoneList',
    method: 'get',
    params,
  })
}
export default {
  list,
  getEventTeams,
  add,
  edit,
  del,
  bindList,
  bindGame,
  updateSchedule,
  getScheduleZoneList,
}

