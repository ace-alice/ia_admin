import request from '@/service/request'

// 设置赔率参数
interface oddsType {
  point_id: number // 投注项ID
  point_1: number // 左边赔率
  point_2?: number // 右边赔率
  change_side?: string // 调整方向
  is_champion: number // 是否冠军盘：1是
  is_multi?: number // 是否多项目
  extra_id?: number // 额外ID
  game_return_rate?: number // 返还率
}

// 获取盘口列表
export function list(params: any) {
  return request({
    url: '/admin/handicap.Champion/controlList',
    method: 'get',
    params,
  })
}
// 设置开赛时间
export function setStartTime(data: { game_id: any; game_start_time: number }) {
  return request({
    url: '/admin/handicap.Champion/setHandicapStartTime',
    method: 'post',
    data,
  })
}
// 设置赔率
export function setOdds(data: oddsType) {
  return request({
    url: '/admin/handicap.Champion/setChangeOdds',
    method: 'post',
    data,
  })
}
// 设置玩法状态-显示-隐藏
/**
 *
 * @param  point_id:投注项ID
 * @param  type:1显示,0隐藏
 */
export function setPlayStatus(data: { point_id: number; type: number }) {
  return request({
    url: '/admin/handicap.Champion/setPlayHide',
    method: 'post',
    data,
  })
}

// 玩法锁单
export function setPlayLock(data: {
  point_ids: Array<number | string>
  type: number
}) {
  return request({
    url: '/admin/handicap.Champion/setPlayLock',
    method: 'post',
    data,
  })
}

export function pendingInfo(params?: any) {
  return request({
    // url: '/admin/report.Navbar/getInfo',
    url: '/admin/report.Navbar/getNavInfo',
    method: 'get',
    params,
  })
}

export default {
  list,
  setStartTime,
  setOdds,
  setPlayStatus,
  setPlayLock,
  pendingInfo,
}
