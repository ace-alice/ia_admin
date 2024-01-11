import { ElMessage, ElNotification } from 'element-plus'
import useRouteStore from './route'
import useMenuStore from './menu'
import {
  buildMenusApi,
  editPwdApi,
  getInitApi,
  loginApi,
} from '@/api/global/login'
import { getLocal, removeLocal, setLocal } from '@/utils/storage'

const useUserStore = defineStore(
  // 唯一ID
  'user',
  {
    state: () => ({
      userInfo: getLocal('userInfo') || {},
      token: getLocal('token') || '',
      permissions: [] as string[],
      systemInfo: {} as any,
      roles: [] as string[],
    }),
    getters: {
      isLogin: (state) => {
        return !!state.token
      },
    },
    actions: {
      login(data: {
        username: string
        password: string
        captcha_id: string
        captcha_code: string
      }) {
        return new Promise<boolean>((resolve) => {
          loginApi(data)
            .then((res: any) => {
              if (+res.code === 1) {
                ElMessage.success(res.message || res.msg)
                setLocal('token', res.data.adminToken)
                this.token = res.data.adminToken
                resolve(true)
              }
              else {
                resolve(false)
              }
            })
            .catch(() => {
              resolve(false)
            })
        })
      },
      logout() {
        return new Promise<void>((resolve) => {
          const routeStore = useRouteStore()
          const menuStore = useMenuStore()

          removeLocal('userInfo')
          removeLocal('token')

          this.token = ''
          routeStore.removeRoutes()
          menuStore.setActived(0)
          resolve()
          location.reload()
        })
      },
      // 获取我的权限
      async getPermissions() {
        // 获取权限
        try {
          const res: any = await buildMenusApi()
          if (+res.code === 1) {
            this.permissions = res.data.page_url.map(
              (pageInfo: any) => pageInfo.page_url,
            )
            this.userInfo = res.data
            this.roles = res.data.btn_url
            return this.permissions
          }
          else {
            ElMessage.error('登陆信息获取失败')
            setTimeout(() => {
              this.logout()
            }, 1500)
          }
        }
        catch (error) {
          ElMessage.error('登陆信息获取失败')
          setTimeout(() => {
            this.logout()
          }, 1500)
        }
        return this.permissions
      },
      editPassword(form: { password_old: string; password_new: string }) {
        return new Promise((resolve) => {
          editPwdApi(form)
            .then((res: any) => {
              if (+res.code === 1) {
                ElNotification.success('您的密码修改成功')
                resolve(true)
              }
              else {
                resolve(false)
              }
            })
            .catch(() => resolve(false))
        })
      },
      async getSystemInfo() {
        await getInitApi().then((res: any) => {
          if (+res.code === 1) {
            this.systemInfo = res.data
          }
        })
      },
    },
  },
)

export default useUserStore
