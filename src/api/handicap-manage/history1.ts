import request from '@/service/request'
// 暂停恢复记录
export function list(data: any) {
  return request({
    url: '/admin/handicap.Monitor/getOddsChangeRecord',
    method: 'post',
    data,
  })
}

export default {
  list,
}
