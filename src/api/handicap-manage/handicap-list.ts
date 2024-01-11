import request from '@/service/request'

// 获取盘口列表
export function list(params: any) {
  return request({
    url: '/admin/handicap.GameList/list',
    method: 'get',
    params,
  })
}

// 设置热门
export function isHot(data: any) {
  return request({
    url: '/admin/handicap.GameList/setHot',
    method: 'post',
    data,
  })
}
// 设置滚球预告
export function bowlsPrediction(data: any) {
  return request({
    url: '/admin/handicap.GameList/setLiveNotice',
    method: 'post',
    data,
  })
}

// 设置是否串关
export function isParlay(data: any) {
  return request({
    url: '/admin/handicap.GameList/setParlay',
    method: 'post',
    data,
  })
}

// 设置是否串关
export function isHide(data: any) {
  return request({
    url: '/admin/handicap.GameList/setGameHideOrShow',
    method: 'post',
    data,
  })
}

// 获取基础信息
export function handicapInfo(data: { game_id: any }) {
  return request({
    url: '/admin/handicap.GameList/gameList',
    method: 'post',
    data,
  })
}

// 保存普通盘玩法(基础信息)
export function submitPlaysInfo(data: any) {
  return request({
    url: '/admin/handicap.GameList/savePlay',
    method: 'post',
    data,
  })
}

// 保存冠军盘玩法(基础信息)
export function submitChampionPlaysInfo(data: any) {
  return request({
    url: '/admin/handicap.GameList/championSavePlay',
    method: 'post',
    data,
  })
}

// 保存游戏(基础信息)
export function submitHandicapInfo(data: any) {
  return request({
    url: '/admin/handicap.GameList/saveGame',
    method: 'post',
    data,
  })
}

export function editHandicapInfo(data: any) {
  return request({
    url: '/admin/handicap.GameList/editGame',
    method: 'post',
    data,
  })
}

export function getGamePlayTypeApi(data: {
  game_type_id: number | string
  round: number | string
}) {
  return request({
    url: '/admin/game.PlayType/getAllGamePlayType',
    method: 'post',
    data,
  })
}

export function getMatchLevelListApi(data?: any) {
  return request({
    url: '/admin/game.EventLevel/getAllEventLevel',
    method: 'post',
    data,
  })
}

export function getMatchLevelLimitApi(data: { level_id: number | string }) {
  return request({
    url: '/admin/game.EventLevel/getEventLevelConfig',
    method: 'post',
    data,
  })
}

export function getMatchLevelConfigApi(data: {
  game_type_id: number | string
  level_id: number | string
}) {
  return request({
    url: '/admin/game.DefaultConfig/getDefaultConfigByGame',
    method: 'post',
    data,
  })
}

export function getAllPlaysApi(game_id: string | number) {
  return request({
    url: '/admin/handicap.GameList/playList',
    method: 'post',
    data: {
      game_id,
    },
  })
}

export function getGameDetailsApi(game_id: number | string) {
  return request({
    url: '/admin/handicap.GameList/gameDetails',
    method: 'post',
    data: {
      game_id,
    },
  })
}

// 绑定第三方列表
export function thirdBindListApi(game_id: number | string, bind_type: number) {
  return request({
    url: '/admin/handicap.GameList/thirdBindList',
    method: 'post',
    data: {
      game_id,
      bind_type,
    },
  })
}
// 绑定第三方(保存)
export function thirdBindSaveApi(data: {
  game_id: number | string
  third_event_id: any
  bind_type: any
  third_game_id: any
  team_info: any
}) {
  return request({
    url: '/admin/handicap.GameList/thirdBindSave',
    method: 'post',
    data,
  })
}

// 绑定第三方(解除绑定)
export function thirdBindRemoveApi(
  game_id: number | string,
  third_event_id: any,
  bind_type: any,
) {
  return request({
    url: '/admin/handicap.GameList/thirdBindRemove',
    method: 'post',
    data: {
      game_id,
      third_event_id,
      bind_type,
    },
  })
}

// 绑定第三方(获取第三方赛事)
export function getAntMatchApi(
  game_type_id: number | string,
  date: any,
  bind_type: any,
) {
  return request({
    url: '/admin/handicap.GameList/getAntMatch',
    method: 'post',
    data: {
      game_type_id,
      date,
      bind_type,
    },
  })
}

// 获取冠军盘列表
export function getChampionPlaysApi(game_id: string | number) {
  return request({
    url: '/admin/handicap.GameList/championPlayList',
    method: 'post',
    data: {
      game_id,
    },
  })
}

// 绑定第三方列表
export function assignOperatorsApi(data: any) {
  return request({
    url: '/admin/handicap.GameList/assignOperator',
    method: 'post',
    data,
  })
}

// 修改局名称列表
export function matchNameListApi(data: any) {
  return request({
    url: '/admin/handicap.GameList/matchNameList',
    method: 'post',
    data,
  })
}

// 修改局名称
export function matchNameEditApi(data: any) {
  return request({
    url: '/admin/handicap.GameList/matchNameEdit',
    method: 'post',
    data,
  })
}

// 修改赛事等级
export function matchlevelEditApi(data: any) {
  return request({
    url: '/admin/handicap.GameList/switchRaceLevel',
    method: 'post',
    data,
  })
}

export default {
  list,
  isHot,
  bowlsPrediction,
  isParlay,
  isHide,
  handicapInfo,
  submitHandicapInfo,
  getGamePlayTypeApi,
  getMatchLevelLimitApi,
  getMatchLevelConfigApi,
  getMatchLevelListApi,
  getAllPlaysApi,
  editHandicapInfo,
  submitPlaysInfo,
  getGameDetailsApi,
  getChampionPlaysApi,
  assignOperatorsApi,
  matchlevelEditApi,
}
