import request from '@/service/request'

// 账变列表
export function list(params?: any) {
  return request({
    url: '/admin/report.Wallet/list',
    method: 'get',
    params,
  })
}

// 变更金额
export function edit(data: any) {
  return request({
    url: '/admin/report.Wallet/updateWalletAmount',
    method: 'post',
    data,
  })
}

// 获取日志列表
export function getLogList(data?: any) {
  return request({
    url: '/admin/report.Wallet/logList',
    method: 'post',
    data,
  })
}

export default {
  list,
  getLogList,
  edit,
}
