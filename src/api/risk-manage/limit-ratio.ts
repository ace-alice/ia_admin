import request from '@/service/request'

// 获取全局参数
export function getListApi() {
  return request({
    url: '/admin/risk.LimitRatio/list',
    method: 'get',
  })
}

// 编辑全局参数
export function editApi(data: any) {
  return request({
    url: '/admin/risk.LimitRatio/edit',
    method: 'post',
    data,
  })
}
