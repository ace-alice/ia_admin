import { ElMessage } from 'element-plus'
import type { Ref } from 'vue'
import { settleOperator } from '@/api/handicap-manage/normal-handicap-settle'
import useUserStore from '@/store/modules/user'

export default function () {
  const allowList: Ref<any[]> = ref([])

  const { proxy }: any = getCurrentInstance()

  const userStore = useUserStore()

  function getAllowList(dataList: any[], code: 'first' | 'reset' | 'invalid') {
    switch (code) {
      case 'first':
        allowList.value = dataList.filter((data: any) => {
          return (
            !operateDisabled(data)
            && +userStore.userInfo.admin_id === +data.operator_id
            && [1].includes(+data.status)
          )
        })
        if (allowList.value.length > 0) {
          proxy.mittBus.emit('openChampionSettleBus', allowList.value)
        }
        else {
          ElMessage.error('没有满足该操作的选项')
        }
        break
      case 'reset':
        allowList.value = dataList.filter((data: any) => {
          return (
            !operateDisabled(data)
            && +userStore.userInfo.admin_id === +data.operator_id
            && [4].includes(+data.status)
          )
        })
        if (allowList.value.length > 0) {
          proxy.mittBus.emit('openChampionAbortConfirmBus', allowList.value)
        }
        else {
          ElMessage.error('没有满足该操作的选项')
        }
        break
      case 'invalid':
        allowList.value = dataList.filter((data: any) => {
          return (
            !operateDisabled(data)
            && ![3, 4, 5].includes(+data.status)
            && +userStore.userInfo.admin_id === +data.operator_id
            && !+data.has_aborted
          )
        })
        if (allowList.value.length > 0) {
          proxy.mittBus.emit('openChampionInvalidBus', allowList.value)
        }
        else {
          ElMessage.error('没有满足该操作的选项')
        }
        break
      default:
        ElMessage.error('无法进行批量操作')
    }
  }

  function operateDisabled(row: any) {
    return Boolean(
      +row.operator_id
        && +userStore.userInfo.admin_id !== +row.operator_id
        && ![3, 5].includes(row.status),
    )
  }

  function lockSwitchDisabled(row: any) {
    return (
      +row.status === 0
      || Boolean(
        row.operator_id && +userStore.userInfo.admin_id !== +row.operator_id,
      )
    )
  }

  const lockStatusChange = (row: any) => {
    return (): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        if (
          row.operator_id
          && row.operator_id !== +userStore.userInfo.admin_id
        ) {
          ElMessage.warning('您不是锁单人')
          reject(new Error('您不是锁单人'))
        }
        else {
          row.loading = true
          settleOperator(row.id, Number(!!row.operator_id))
            .then((res: any) => {
              if (+res.code === 1) {
                if (Number(!row.operator_id)) {
                  row.operator_id = userStore.userInfo.admin_id
                  row.current_operator = userStore.userInfo.nickname
                }
                else {
                  row.operator_id = 0
                  row.current_operator = ''
                }
                resolve(true)
              }
              else {
                reject(new Error(res.msg || res.message))
              }
            })
            .finally(() => {
              row.loading = false
            })
            .catch((err) => {
              reject(err)
            })
          setTimeout(() => {
            row.loading = false
            resolve(true)
          }, 10000)
        }
      })
    }
  }

  return {
    allowList,
    getAllowList,
    lockStatusChange,
    operateDisabled,
    lockSwitchDisabled,
  }
}
