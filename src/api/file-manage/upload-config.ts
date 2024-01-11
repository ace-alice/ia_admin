import request from '@/service/request'

// 获取上传配置
export function getUploadInfo(params: any) {
  return request({
    url: '/admin/file.Setting/info',
    method: 'get',
    params,
  })
}

// 保存上传配置
export function saveUploadInfo(data: any) {
  return request({
    url: '/admin/file.Setting/edit',
    method: 'post',
    data,
  })
}
