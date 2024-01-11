import request from '@/service/request'

export function list(params: any) {
  return request({
    url: '/admin/site.Notice/list',
    method: 'get',
    params,
  })
}

export function add(data: any) {
  return request({
    url: '/admin/site.Notice/add',
    method: 'post',
    data,
  })
}

export function edit(data: any) {
  return request({
    url: '/admin/site.Notice/edit',
    method: 'post',
    data,
  })
}

export function onlineApi(params: any) {
  return request({
    url: '/admin/site.Notice/online',
    method: 'get',
    params,
  })
}

export default {
  list,
  add,
  edit,
  onlineApi,
}
