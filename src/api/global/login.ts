import request from '@/service/request'

// 获取登录验证方式
export function getInitApi() {
  return request({
    url: '/admin/admin.Login/setting',
    method: 'post',
  })
}

// 获取图片验证码和uuid
export function getCodeImg() {
  return request({
    url: '/admin/admin.Login/captcha',
    method: 'get',
  })
}

// 用户登录接口
export function loginApi(data: any) {
  return request({
    url: '/admin/admin.Login/login',
    method: 'post',
    data,
  })
}

// 获取用户信息
export function buildMenusApi() {
  return request({
    url: '/admin/admin.AdminCenter/getInfo',
    method: 'get',
  })
}

// 用户退出接口
export function logoutApi() {
  return request({
    url: '/admin/admin.Login/logout',
    method: 'get',
  })
}

// 编辑个人信息
export function editUserInfoApi(data: any) {
  return request({
    url: '/admin/admin.AdminCenter/edit',
    method: 'post',
    data,
  })
}

// 修改个人密码
export function editPwdApi(data: any) {
  return request({
    url: '/admin/admin.AdminCenter/pwd',
    method: 'post',
    data,
  })
}

// 获取日志列表
export function getLogApi(data: any) {
  return request({
    url: '/admin/admin.AdminCenter/log',
    method: 'post',
    data,
  })
}
