import { list } from '@/api/auth-manage/admin-config'
import { getCurrencyType } from '@/api/financial-manage/account-change-list'
import { getAllProxy, getAllRiskLabel } from '@/api/user-manage/user-list'
export function dynamicParam() {
  // 获取用户角色
  const getAllRole: any = () => {
    return new Promise((resolve) => {
      list({ limit: 1000 }).then((res: any) => {
        if (+res.code === 1 && res.data.data.length > 0) {
          resolve(res.data.data)
        }
        else {
          resolve([])
        }
      })
    })
  }
  // 获取货币类型
  const getMoneyType: any = () => {
    return new Promise((resolve) => {
      getCurrencyType().then((res: any) => {
        if (+res.code === 1 && res.data.length > 0) {
          resolve(res.data)
        }
        else {
          resolve([])
        }
      })
    })
  }
  // 获取风控标签
  const getRiskLabel: any = () => {
    return new Promise((resolve) => {
      getAllRiskLabel().then((res: any) => {
        if (+res.code === 1 && res.data.length > 0) {
          resolve(res.data)
        }
        else {
          resolve([])
        }
      })
    })
  }
  const getProxy: any = () => {
    return new Promise((resolve) => {
      getAllProxy().then((res: any) => {
        if (+res.code === 1 && res.data.length > 0) {
          resolve(res.data)
        }
        else {
          resolve([])
        }
      })
    })
  }
  return {
    getAllRole,
    getMoneyType,
    getRiskLabel,
    getProxy,
  }
}
