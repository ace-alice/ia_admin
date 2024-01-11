import request from '@/service/request'

// 获取数据源玩法列表
export function list(params?: any) {
  return request({
    url: '/admin/game.AntPlayData/list',
    method: 'get',
    params,
  })
}
export function getThreeGameList() {
  return request({
    url: '/admin/game.AntPlayData/category',
    method: 'post',
  })
}
export default { list, getThreeGameList }
