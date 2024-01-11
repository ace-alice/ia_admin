import request from '@/service/request'
// 获取赔率变化记录
export function list(data: { point_id: number }) {
  return request({
    url: '/admin/handicap.Champion/getOddsChangeRecord',
    method: 'post',
    data,
  })
}

export default {
  list,
}
