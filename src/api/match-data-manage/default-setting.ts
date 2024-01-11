import request from '@/service/request'
// 赛事配置
export function getList(params?: any) {
  return request({
    url: '/admin/game.DefaultConfig/getDefaultConfigByGameType',
    method: 'get',
    params,
  })
}
// 保存
export function save(data: any) {
  return request({
    url: '/admin/game.DefaultConfig/saveDefault',
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
// 赛事列表
export function getEventListByParams(params: any) {
  return request({
    url: '/admin/game.DefaultConfig/getEventListByParams',
    method: 'get',
    params,
  })
}
//
export function getDefaultConfigPlayList(params: any) {
  return request({
    url: '/admin/game.DefaultConfig/getDefaultConfigPlayList',
    method: 'get',
    params,
  })
}
export function saveDefaultById(data: any) {
  return request({
    url: '/admin/game.DefaultConfig/saveDefaultById',
    method: 'post',
    data,
  })
}
export default {
  getList,
  save,
  getEventLevel,
  saveDefaultById,
  getEventListByParams,
  getDefaultConfigPlayList,
}
