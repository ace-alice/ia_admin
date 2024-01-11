import request from '@/service/request'

// 获取作废审核列表
export function list(params: any) {
  return request({
    url: '/admin/project.Cancel/getList',
    method: 'get',
    params,
  })
}

// 审核
export function verifyApi(data: any) {
  return request({
    url: '/admin/project.Cancel/verify',
    method: 'post',
    data,
  })
}

// 作废信息
export function verifyInfoApi(data: any) {
  return request({
    url: '/admin/project.Cancel/getInfo',
    method: 'post',
    data,
  })
}

export default {
  list,
}
