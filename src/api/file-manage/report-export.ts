import request from '@/service/request'

// 获取文件列表
export function list(params: any) {
  return request({
    url: '/admin/admin.Download/getList',
    method: 'get',
    params,
  })
}

export default {
  list,
}
