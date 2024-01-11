import request from '@/service/request'

// 获取战队列表
export function getList(params: any) {
  return request({
    url: '/admin/game.Team/getTeamListByGameTypeId',
    method: 'get',
    params,
  })
}

// 获取战队列表
export function list(params?: any) {
  return request({
    url: '/admin/game.Team/list',
    method: 'get',
    params,
  })
}

// 新增战队
export function add(data: any) {
  return request({
    url: '/admin/game.Team/add',
    method: 'post',
    data,
  })
}

// 编辑战队
export function edit(data: any) {
  return request({
    url: '/admin/game.Team/edit',
    method: 'post',
    data,
  })
}

// 修改战队logo
export function updateTeamLogoApi(data: any) {
  return request({
    url: '/admin/game.Team/updateTeamLogo',
    method: 'post',
    data,
  })
}

// 设置战队是否禁用
export function isDisable(data: any) {
  return request({
    url: '/admin/game.Team/updateStatus',
    method: 'post',
    data,
  })
}

// 绑定/取消队伍
export function bindTeamApi(data: any) {
  return request({
    url: '/admin/game.Team/bindTeam',
    method: 'post',
    data,
  })
}

// 获取第三方游戏
export function getThirdGameApi(params: any) {
  return request({
    url: '/admin/game.Team/getThirdGame',
    method: 'get',
    params,
  })
}

// 获取第三方队伍
export function getThirdTeamApi(params: any) {
  return request({
    url: '/admin/game.Team/getThirdTeam',
    method: 'get',
    params,
  })
}
// 获取第三方玩法
export function getThirdPlayApi(params: any) {
  return request({
    url: '/admin/game.PlayType/getThirdPlay',
    method: 'get',
    params,
  })
}

// 绑定/取消玩法
export function bindPlayApi(data: any) {
  return request({
    url: '/admin/game.PlayType/bindPlay',
    method: 'post',
    data,
  })
}

// 获取绑定队伍列表
export function getBindTeamApi(params: any) {
  return request({
    url: '/admin/game.Team/bindList',
    method: 'get',
    params,
  })
}

// 获取绑定玩法列表
export function getBindPlayApi(params: any) {
  return request({
    url: '/admin/game.PlayType/bindList',
    method: 'get',
    params,
  })
}
// 启用禁用监控
export function updateMonitorStatus(data: any) {
  return request({
    url: '/admin/game.Team/updateMonitorStatus',
    method: 'post',
    data,
  })
}

export default { list, add, edit, isDisable, updateMonitorStatus }
