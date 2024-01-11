/* eslint-disable @typescript-eslint/no-unused-vars */
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { useRoute } from 'vue-router'
import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'
import useUserStore from '@/store/modules/user'
import {
  setAdjustOdds,
  setPlayHide,
  setPlayLock,
  setPlayOpenUp,
  setStopBet,
} from '@/api/handicap-manage/fix-live-list'
export default function () {
  const i18n = useI18n()
  const userStore = useUserStore()
  const route = useRoute()
  const lockStatusChange = (row: any) => {
    return (): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        if (
          row.admin_taken
          && row.admin_taken !== userStore.userInfo.username
        ) {
          ElMessage.warning('您不是锁单人')
          reject(new Error('您不是锁单人'))
        }
        else {
          row.loading = true
          setPlayLock({
            game_id: route.query?.game_id,
            type: row.admin_taken ? 0 : 1,
            play_id: [row.id],
          })
            .then((res: any) => {
              if (+res.code === 1) {
                reject(new Error('admin_taken'))
                // resolve(true)
              }
              else {
                reject(new Error(res.msg || res.message))
              }
            })
            .finally(() => {
              row.loading = false
            })
            .catch((err: any) => {
              reject(err)
            })
        }
      })
    }
  }

  function handleLockMore(playIds: Number[], type: 1 | 0, callback: Function) {
    if (playIds.length > 0) {
      setPlayLock({
        game_id: route.query?.game_id,
        type,
        play_id: playIds,
      }).then((res: any) => {
        if (+res.code === 1) {
          ElNotification.success(i18n.t('crud.BaseHandlesuccessfully'))
        }
      })
    }
  }

  function handleStopMore(playIds: Number[], type: 1 | 0, callback: Function) {
    if (playIds.length > 0) {
      setPlayLock({
        game_id: route.query?.game_id,
        type,
        play_id: playIds,
      }).then((res: any) => {
        if (+res.code === 1) {
          ElNotification.success(i18n.t('crud.BaseHandlesuccessfully'))
        }
      })
    }
  }

  function lockSwitchDisabled(row: any) {
    return !!row.admin_taken && row.admin_taken !== userStore.userInfo.username
  }

  function teamDisabled(row: any, category_id: number) {
    // 早盘
    if (category_id === 2) {
      return false
    }
    return (
      !row.is_lock
      || (row.is_lock && row.admin_taken !== userStore.userInfo.username)
    )
  }

  function teamlockStatusChange(
    action: 'game' | 'match' | 'play' | 'side',
    form: any,
    team: any,
    callback: Function,
  ) {
    return (): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        team.loading = true
        setStopBet(
          Object.assign({}, form, {
            type: +!form.type,
            action,
            game_id: route.query?.game_id,
          }),
        )
          .then((res: any) => {
            if (+res.code === 1) {
              if (action === 'play') {
                team.team.forEach((t: any) => {
                  t.is_lock = +!form.type
                })
                team.is_stop = +!form.type
              }
              if (action === 'side') {
                team.is_lock = +!form.type
              }
              reject(new Error('.'))
              // resolve(true)
            }
            else {
              reject(new Error('.'))
            }
          })
          .catch((err: any) => {
            reject(err)
          })
          .finally(() => {
            team.loading = false
          })
      })
    }
  }

  function teamHideStatusChange(form: any, callback: Function) {
    return (): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        const dialogTips
          = form.type === 1
            ? i18n.t('table.display_play')
            : i18n.t('table.ca_display_play')

        ElMessageBox.alert(dialogTips, '', {
          showCancelButton: true,
          confirmButtonText: i18n.t('crud.submit'),
          cancelButtonText: i18n.t('crud.cancel'),
        })
          .then(() => {
            setPlayHide(
              Object.assign({}, form, {
                type: +!form.type,
                game_id: route.query?.game_id,
              }),
            )
              .then((res: any) => {
                if (res && res.code === 1) {
                  // resolve(true)
                  reject(new Error('resolve'))
                  // callback()
                }
                else {
                  reject(new Error('.'))
                }
              })
              .catch((err: any) => {
                reject(err)
              })
          })
          .catch((err: any) => {
            reject(err)
          })
      })
    }
  }
  const teamSetRecommend = (form: any, callback: Function) => {
    return (): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        const dialogTips
          = form.type === 1
            ? i18n.t('table.is_recommend')
            : i18n.t('crud.exhibition_cancel')

        ElMessageBox.alert(dialogTips, '', {
          showCancelButton: true,
          confirmButtonText: i18n.t('crud.submit'),
          cancelButtonText: i18n.t('crud.cancel'),
        })
          .then(() => {
            setPlayOpenUp(
              Object.assign({}, form, {
                game_id: route.query?.game_id,
                play_id: form.play_id,
                type: +!form.type,
              }),
            )
              .then((res: any) => {
                if (res && res.code === 1) {
                  reject(new Error('resolve'))
                  // resolve(true)
                  // callback()
                }
                else {
                  reject(new Error('.'))
                }
              })
              .catch((err: any) => {
                reject(err)
              })
          })
          .catch((err: any) => {
            reject(err)
          })
      })
    }
  }

  const changeOddsHandle = debounce(oddChange, 300)

  function oddChange(index: number, odds: any[], row: any) {
    if (!row.game_return_rate) {
      odds[index].point = odds[index].old_point
      return ElMessage.error(i18n.t('table.set_rate_first'))
    }
    const pointOdds: any = []
    pointOdds.push({
      id: odds[index].id,
      odds: odds[index].point,
    })
    if (odds.length === 2 && row.game_return_rate) {
      if (+row.lock_game_rate) {
        if (+odds[index].point < 1.001 || +odds[index].point > 24) {
          return ElMessage.warning('1.001 - 24')
        }
        if (+odds[index].point === 1.001) {
          odds[Number(!index)].point = 21
        }
        else {
          const rate = +row.game_return_rate / 100
          const nextOdd = Number(
            ((rate * +odds[index].point) / (odds[index].point - rate)).toFixed(3),
          )
          if (nextOdd < 1.001 || nextOdd > 24) {
            odds[Number(!index)].point = odds[Number(!index)].old_point
            odds[index].point = odds[index].old_point
            return ElMessage.warning('1.001 - 24')
          }
          else {
            odds[Number(!index)].point = nextOdd
          }
        }
      }
      pointOdds.push({
        id: odds[Number(!index)].id,
        odds: odds[Number(!index)].point,
      })
    }
    row.oddChangeLock = true
    setAdjustOdds({
      game_id: Number(route.query?.game_id),
      play_id: row.id,
      option: pointOdds,
    })
      .then((res: any) => {
        if (res && res.code === 1) {
          odds[index].old_point = odds[index].point
          if (odds.length === 2) {
            odds[Number(!index)].old_point = odds[Number(!index)].point
          }
        }
        else {
          odds[index].point = odds[index].old_point
          if (odds.length === 2) {
            odds[Number(!index)].point = odds[Number(!index)].old_point
          }
          ElMessage.warning(i18n.t('table.change_rate_fail'))
        }
      }).catch(() => {
        odds[index].point = odds[index].old_point
        if (odds.length === 2) {
          odds[Number(!index)].point = odds[Number(!index)].old_point
        }
      })
      .finally(() => {
        row.oddChangeLock = false
      })
  }

  return {
    teamHideStatusChange,
    lockStatusChange,
    lockSwitchDisabled,
    teamDisabled,
    teamlockStatusChange,
    oddChange,
    changeOddsHandle,
    handleLockMore,
    handleStopMore,
    teamSetRecommend,
  }
}
