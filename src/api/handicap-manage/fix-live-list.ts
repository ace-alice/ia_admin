import request from '@/service/request'
// 获取盘口列表
export function list(params: any) {
  return request({
    url: '/admin/handicap.Monitor/getPointList',
    method: 'get',
    params,
  })
}

// 设置盘口时间
export function setHandicapTime(data: any) {
  return request({
    url: '/admin/handicap.Monitor/setHandicapTime',
    method: 'post',
    data,
  })
}
// 玩法锁单
export function setPlayLock(data: any) {
  return request({
    url: '/admin/handicap.Monitor/setPlayLock',
    method: 'post',
    data,
  })
}
// 玩法暂停
export function setStopBet(data: any) {
  return request({
    url: '/admin/handicap.Monitor/setStopBet',
    method: 'post',
    data,
  })
}
// 玩法展示
export function setPlayOpenUp(data: any) {
  return request({
    url: '/admin/handicap.Monitor/setPlayOpenUp',
    method: 'post',
    data,
  })
}
// 玩法隐藏
export function setPlayHide(data: any) {
  return request({
    url: '/admin/handicap.Monitor/setPlayHide',
    method: 'post',
    data,
  })
}
// 拒单时间
export function setRejectOrder(data: any) {
  return request({
    url: '/admin/handicap.Monitor/setRejectOrder',
    method: 'post',
    data,
  })
}
// 开始滚球
export function setStartRoll(data: any) {
  return request({
    url: '/admin/handicap.Monitor/setStartRoll',
    method: 'post',
    data,
  })
}
// 调整赔率
export function setAdjustOdds(data: any) {
  return request({
    url: '/admin/handicap.Monitor/setAdjustOdds',
    method: 'post',
    data,
  })
}
// 关盘
export function setHandicapClose(data: any) {
  return request({
    url: '/admin/handicap.Monitor/setHandicapClose',
    method: 'post',
    data,
  })
}
// 盘口信息
export function getGameInfo(data: any) {
  return request({
    url: '/admin/handicap.Monitor/getGameInfo',
    method: 'post',
    data,
  })
}
// 获取盘口参数设置
export function getHandicapParam(data: any) {
  return request({
    url: '/admin/handicap.Monitor/getHandicapParam',
    method: 'post',
    data,
  })
}
// 修改盘口参数设置
export function setHandicapParam(data: any) {
  return request({
    url: '/admin/handicap.Monitor/setHandicapParam',
    method: 'post',
    data,
  })
}
// 修改盘口参数设置
export function setTeamScore(data: any) {
  return request({
    url: '/admin/handicap.Monitor/setTeamScore',
    method: 'post',
    data,
  })
}
// 获取注单数据
export function getProjects(data: any) {
  return request({
    url: '/admin/handicap.Monitor/getProjects',
    method: 'post',
    data,
  })
}
// 设置注单拒单
export function setProjectReceive(data: any) {
  return request({
    url: '/admin/handicap.Monitor/setProjectReceive',
    method: 'post',
    data,
  })
}
// 通告拘束获取所有玩法
export function getPlayMatch(params: any) {
  return request({
    url: '/admin/handicap.Monitor/getPlayMatch',
    method: 'get',
    params,
  })
}
// 切换球头
export function setSwitchHead(params: any) {
  return request({
    url: '/admin/handicap.Monitor/setSwitchHead',
    method: 'get',
    params,
  })
}
// 是否自动接收调整赔率
export function setAutoOdds(data: any) {
  return request({
    url: '/admin/handicap.Monitor/setAutoOdds',
    method: 'post',
    data,
  })
}

export default {
  list,
  setHandicapTime,
  setPlayLock,
  setStopBet,
  setPlayOpenUp,
  setPlayHide,
  setRejectOrder,
  setStartRoll,
  setHandicapClose,
  setAdjustOdds,
  getGameInfo,
  getHandicapParam,
  setHandicapParam,
  setTeamScore,
  getProjects,
  setProjectReceive,
  getPlayMatch,
  setSwitchHead,
  setAutoOdds,
}
