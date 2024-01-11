import request from '@/service/request'

// 获取风控标签列表
export function list(params?: any) {
  return request({
    url: '/admin/risk.Tags/lists',
    method: 'get',
    params,
  })
}

// 新增风控标签
export function add(data: any) {
  return request({
    url: '/admin/risk.Tags/add',
    method: 'post',
    data,
  })
}

// 编辑风控标签
export function edit(data: any) {
  return request({
    url: '/admin/risk.Tags/edit',
    method: 'post',
    data,
  })
}

// 删除风控标签
export function del(data: any) {
  return request({
    url: '/admin/risk.Tags/del',
    method: 'post',
    data,
  })
}

export default { list, add, edit, del }
