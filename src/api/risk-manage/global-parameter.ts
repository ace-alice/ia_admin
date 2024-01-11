import request from '@/service/request'

// 获取全局参数
export function getListApi() {
  return request({
    url: '/admin/risk.GlobalParams/list',
    method: 'get',
  })
}

// 编辑全局参数
export function editApi(params: any) {
  return request({
    url: '/admin/risk.GlobalParams/edit',
    method: 'get',
    params,
  })
}
