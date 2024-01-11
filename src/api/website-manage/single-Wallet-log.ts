import request from '@/service/request'

// 获取单一钱包记录列表
export function list(params?: any) {
  return request({
    url: '/admin/site.SingleWalletLog/list',
    method: 'get',
    params,
  })
}

// 重新请求变更金额/批量重新推送
export function updateMoney(data: any) {
  return request({
    url: '/admin/site.SingleWalletLog/updateMoney',
    method: 'post',
    data,
  })
}
// 手动设置成功或失败
export function updateStatus(data: any) {
  return request({
    url: '/admin/site.SingleWalletLog/updateStatus',
    method: 'post',
    data,
  })
}

export default {
  list,
  updateMoney,
  updateStatus,
}
