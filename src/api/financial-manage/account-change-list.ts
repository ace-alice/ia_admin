import request from '@/service/request'

// 账变列表
export function list(params?: any) {
  return request({
    url: '/admin/finance.MoneyOrder/list',
    method: 'get',
    params,
  })
}

// 获取账变类型
export function getMoneyOrderType() {
  return request({
    url: '/admin/finance.MoneyOrder/getMoneyOrderType',
    method: 'get',
  })
}
// 获取可用的货币类型
export function getCurrencyType() {
  return request({
    url: '/admin/finance.MoneyOrder/getCurrencyType',
    method: 'get',
  })
}

export default {
  list,
  getMoneyOrderType,
  getCurrencyType,
}
