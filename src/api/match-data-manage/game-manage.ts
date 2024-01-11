import request from '@/service/request'

// 获取游戏列表
export function list(params?: any) {
  return request({
    url: '/admin/game.GameType/list',
    method: 'get',
    params,
  })
}

// 新增游戏
export function add(data: any) {
  return request({
    url: '/admin/game.GameType/add',
    method: 'post',
    data,
  })
}

// 编辑游戏
export function edit(data: any) {
  return request({
    url: '/admin/game.GameType/edit',
    method: 'post',
    data,
  })
}

// 设置游戏是否禁用
export function isDisable(data: any) {
  return request({
    url: '/admin/game.GameType/updateStatus',
    method: 'post',
    data,
  })
}

export default { list, add, edit, isDisable }
