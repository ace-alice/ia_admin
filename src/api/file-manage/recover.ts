import request from '@/service/request'

// 获取文件列表
export function list(params: any) {
  return request({
    url: '/admin/admin.File/recover',
    method: 'get',
    params,
  })
}

// 删除文件
export function del(data: any) {
  return request({
    url: '/admin/admin.File/recoverDele',
    method: 'post',
    data,
  })
}

// 文件回收站恢复
export function recoverReco(data: any) {
  return request({
    url: '/admin/admin.File/recoverReco',
    method: 'post',
    data,
  })
}

export default {
  list,
  del,
  recoverReco,
}
