import request from '@/service/request'

// 获取游戏列表
export function getGameListApi() {
  return request({
    url: '/admin/game.GameType/getAllGames',
    method: 'post',
  })
}

// 根据游戏id获取赛事列表
export function getEventListApi(game_type_id: number | string) {
  return request({
    url: '/admin/game.Event/getAllEventByGameTypeId',
    method: 'post',
    data: {
      game_type_id,
    },
  })
}

// 获取局名称
export function getMatchNameApi(data: any) {
  return request({
    url: '/admin/handicap.Monitor/getMatchName',
    method: 'post',
    data,
  })
}

// 获取所有公司信息
export function getAllCompanyApi() {
  return request({
    url: '/admin/company.Company/getAll',
    method: 'post',
  })
}

// 获取所有公司信息
export function getAdminList() {
  return request({
    url: '/admin/admin.Admin/getAdminList',
    method: 'get',
  })
}

// 获取所有的账变类型
export function getAllOrderType() {
  return request({
    url: '/admin/site.SingleWalletLog/getAllOrderType',
    method: 'get',
  })
}

