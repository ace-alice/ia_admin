import request from '@/service/request'

// 获取文件列表
export function list(params: any) {
  return request({
    url: '/admin/user.IpList/getList',
    method: 'get',
    params,
  })
}

export function getIpListApi(user_id: number) {
  return request({
    url: '/admin/user.IpList/getIps',
    method: 'post',
    data: {
      user_id,
    },
  })
}

export function addBlackApi(is_black: 0 | 1, ids: string) {
  return request({
    url: '/admin/user.IpList/add',
    method: 'post',
    data: {
      is_black, ids,
    },
  })
}

export default {
  list,
}
