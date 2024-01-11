import request from '@/service/request'

// 获取玩法列表
export function list(params?: any) {
  return request({
    url: '/admin/game.PlayType/list',
    method: 'get',
    params,
  })
}

// 新增玩法
export function add(data: any) {
  return request({
    url: '/admin/game.PlayType/add',
    method: 'post',
    data,
  })
}

// 编辑玩法
export function edit(data: any) {
  return request({
    url: '/admin/game.PlayType/edit',
    method: 'post',
    data,
  })
}

// 设置玩法是否禁用
export function isDisable(data: any) {
  return request({
    url: '/admin/game.PlayType/updateStatus',
    method: 'post',
    data,
  })
}

// 设置玩法是否快设
export function isFast(data: any) {
  return request({
    url: '/admin/game.PlayType/setPlayTypeFast',
    method: 'post',
    data,
  })
}

// 设置玩法是否特殊
export function isSpecial(data: any) {
  return request({
    url: '/admin/game.PlayType/setPlayTypeSpecial',
    method: 'post',
    data,
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

// 获取第三方玩法
export function getThirdPlayApi(params: any) {
  return request({
    url: '/admin/game.PlayType/getThirdPlay',
    method: 'get',
    params,
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
// 获取特殊玩法参数
export function getSpecialHandicap() {
  return request({
    url: '/admin/game.PlayType/getPlayTypeParams',
    method: 'get',
  })
}
// 玩法规则获取
export function getPlayRule() {
  return request({
    url: '/admin/game.PlayType/getPlayRules',
    method: 'post',
  })
}
// 获取关联描述
export function getRelatedInfo() {
  return request({
    url: '/admin/game.PlayType/getRelatedInfo',
    method: 'get',
  })
}

export default { list, add, edit, isDisable, isFast, isSpecial, getSpecialHandicap, getPlayRule, getRelatedInfo }
