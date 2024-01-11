/* eslint-disable prefer-promise-reject-errors */
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { clearLocal, clearSession, getLocal } from '@/utils/storage'
import router from '@/router/index'

// 配置新建一个 axios 实例
const service = axios.create({
  baseURL: `${window.location.origin}/api`,
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' },
})

// 添加请求拦截器
service.interceptors.request.use(
  (config: any) => {
    // 在发送请求之前做些什么 token
    if (getLocal('token')) {
      config.headers.token = getLocal('token')
    }
    if (config.headers) {
      config.headers.lang = getLocal('lang') || 1
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const code = response.status
    if (code < 200 || code > 300) {
      ElMessage({
        message: '一个错误',
        type: 'error',
        duration: 3000,
      })
      return Promise.reject('error')
    }
    else if (
      parseInt(response.data.code) === 126
      && router.currentRoute.value.name !== 'ipLimit'
    ) {
      setTimeout(() => {
        router.push({ name: 'ipLimit' })
      }, 300)
    }
    else if (
      [602, 603, 604].includes(parseInt(response.data.code))
      && router.currentRoute.value.name !== 'ipLimit'
    ) {
      ElMessage({
        message: response.data.msg || response.data.message,
        type: 'error',
        duration: 3000,
      })
      setTimeout(() => {
        clearLocal()
        clearSession()
        if (router.currentRoute.value.name === 'ipLimit') {
          return
        }
        router.push({ path: '/login' })
        location.reload()
      }, 3000)
      return Promise.reject('error')
    }
    else if (
      parseInt(response.data.code) !== 1
      && router.currentRoute.value.name !== 'ipLimit'
    ) {
      ElMessage({
        message: response.data.msg || response.data.message,
        type: 'error',
        duration: 3000,
      })
      return Promise.reject('error')
    }
    else {
      return response.data
    }
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      let code = 0

      try {
        code = error.response.data.code
      }
      catch (e) {
        if (error.toString().includes('Error: timeout')) {
          ElMessage({
            message: '网络超时',
            type: 'error',
            duration: 3000,
          })
          return Promise.reject(error)
        }
      }
      if (code) {
        if (code === 401) {
          ElMessage.error('请求超时')
        }
        else if (code === 403) {
          router.push({ path: '/401' })
        }
        else {
          const errorMsg
            = error.response.data.msg || error.response.data.message
          if (errorMsg !== undefined) {
            ElMessage({
              message: errorMsg || error,
              type: 'warning',
              duration: 3000,
            })
          }
        }
      }
      else {
        ElMessage({
          message: '网络错误，请刷新页面',
          type: 'error',
          duration: 3000,
        })
      }
    }
    else {
      ElMessage({
        message: '网络错误，请刷新页面',
        type: 'error',
        duration: 3000,
      })
    }

    return Promise.reject(error)
  },
)

export default service
