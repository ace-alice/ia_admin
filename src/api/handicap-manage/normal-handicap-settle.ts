import request from '@/service/request'
// 获取冠军盘结算列表
export function list(params: any) {
  return request({
    url: '/admin/handicap.PlaySettle/normalPlaySettlePageList',
    method: 'get',
    params,
  })
}

// 获取冠军盘结算列表
export function settleOperator(id: any, is_cancel: any) {
  return request({
    url: '/admin/handicap.PlaySettle/settleOperator',
    method: 'post',
    data: { id, is_cancel, is_champion: 0 },
  })
}

// 初次设置赛果
export function firstSettle(img: string, normal_settles: any[]) {
  return request({
    url: '/admin/handicap.PlaySettle/normalSetWinner',
    method: 'post',
    data: { img, normal_settles },
  })
}

// 结算详情
export function settleDetailApi(id: string | number) {
  return request({
    url: '/admin/handicap.PlaySettle/settleDetail',
    method: 'post',
    data: { id, is_champion: 0 },
  })
}

// 确定赛果
export function sureSettleApi(play_id: string | number, is_confirm: 0 | 1) {
  return request({
    url: '/admin/handicap.PlaySettle/normalConfirmWinner',
    method: 'post',
    data: { play_id, is_confirm },
  })
}

// 作废申请
export function abortApplyApi(ids: string | number, reason: 0 | 1) {
  return request({
    url: '/admin/handicap.PlaySettle/abortApply',
    method: 'post',
    data: { ids, reason, is_champion: 0 },
  })
}

// 作废申请确认
export function abortConfirmApi(ids: string | number, confirm_result: 0 | 1) {
  return request({
    url: '/admin/handicap.PlaySettle/abortConfirm',
    method: 'post',
    data: { ids, confirm_result, is_champion: 0 },
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
    data: { id, is_champion: 0 },
  })
}

// 设置 盘口输赢
export function setGameWinLossApi(data: any) {
  return request({
    url: '/admin/handicap.PlaySettle/setGameWinLoss',
    method: 'post',
    data,
  })
}

// 设置 盘口输赢
export function multiSetOperatorApi(data: any) {
  return request({
    url: '/admin/handicap.PlaySettle/multiSetOperator',
    method: 'post',
    data,
  })
}

// 获取 盘口输赢设置信息接口
export function getGameWinLossApi(data: any) {
  return request({
    url: '/admin/handicap.PlaySettle/getGameWinLoss',
    method: 'post',
    data,
  })
}

// 获取比分详情
export function getAutoSettleParamsApi(params: any) {
  return request({
    url: '/admin/handicap.PlaySettle/getAutoSettleParams',
    method: 'get',
    params,
  })
}

// 设置自动结算参数
export function setAutoSettleParamsApi(data: any) {
  return request({
    url: '/admin/handicap.PlaySettle/setAutoSettleParams',
    method: 'post',
    data,
  })
}

export default {
  list,
}
