import request from '@/service/request'
// 获取冠军盘结算列表
export function list(params: any) {
  return request({
    url: '/admin/handicap.PlaySettle/championSettlePageList',
    method: 'get',
    params,
  })
}

// 获取冠军盘结算列表
export function settleOperator(id: any, is_cancel: any) {
  return request({
    url: '/admin/handicap.PlaySettle/settleOperator',
    method: 'post',
    data: { id, is_cancel, is_champion: 1 },
  })
}

// 初次设置赛果
export function firstSettle(img: string, champion_settles: any[]) {
  return request({
    url: '/admin/handicap.PlaySettle/championSetWinner',
    method: 'post',
    data: { img, champion_settles },
  })
}

// 结算详情
export function settleDetailApi(id: string | number) {
  return request({
    url: '/admin/handicap.PlaySettle/settleDetail',
    method: 'post',
    data: { id, is_champion: 1 },
  })
}

// 确定赛果
export function sureSettleApi(
  point_extra_id: string | number,
  is_confirm: 0 | 1,
) {
  return request({
    url: '/admin/handicap.PlaySettle/championConfirmWinner',
    method: 'post',
    data: { point_extra_id, is_confirm },
  })
}

// 作废申请
export function abortApplyApi(ids: string | number, reason: 0 | 1) {
  return request({
    url: '/admin/handicap.PlaySettle/abortApply',
    method: 'post',
    data: { ids, reason, is_champion: 1 },
  })
}

// 作废审核
export function abortConfirmApi(ids: string | number, confirm_result: 0 | 1) {
  return request({
    url: '/admin/handicap.PlaySettle/abortConfirm',
    method: 'post',
    data: { ids, confirm_result, is_champion: 1 },
  })
}

// 获取作废申请信息
export function abortConfirmInfoApi(
  ids: string | number,
  game_id: string | number,
) {
  return request({
    url: '/admin/handicap.PlaySettle/abortList',
    method: 'post',
    data: { ids, game_id },
  })
}

// 获取作废申请信息
export function resettleApi(id: string | number) {
  return request({
    url: '/admin/handicap.PlaySettle/resettle',
    method: 'post',
    data: { id, is_champion: 1 },
  })
}
// 批量锁单
export function multiSetOperatorApi(data: any) {
  return request({
    url: '/admin/handicap.PlaySettle/multiSetOperator',
    method: 'post',
    data,
  })
}

export default {
  list,
  multiSetOperatorApi,
}
