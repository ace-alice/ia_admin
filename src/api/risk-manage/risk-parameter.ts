import request from '@/service/request'

// 获取风控参数
export function getListApi() {
  return request({
    url: '/admin/risk.RiskParams/lists',
    method: 'get',
  })
}

// 编辑风控参数
export function editApi(data: any) {
  return request({
    url: '/admin/risk.RiskParams/edit',
    method: 'post',
    data,
  })
}

// 修改风控参数状态
export function editStatusApi(data: any) {
  return request({
    url: '/admin/risk.RiskParams/status',
    method: 'post',
    data,
  })
}
