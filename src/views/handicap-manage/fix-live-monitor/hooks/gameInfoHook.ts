import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {
  getGameInfo,
  setHandicapTime,
  setRejectOrder,
  setStartRoll,
  setTeamScore,
} from '@/api/handicap-manage/fix-live-list'

export default function gameInfoHook() {
  const i18n = useI18n()
  const gameInfo = ref<any>({})
  const dialogVisible = ref(false)
  const route = useRoute()

  const getGameInfoHandle = () => {
    getGameInfo({
      game_id: route.query.game_id,
    }).then((res: any) => {
      gameInfo.value = res.data
      window.document.title = `${gameInfo.value.team_name_1} vs ${gameInfo.value.team_name_2}`
    })
  }

  const open = () => {
    dialogVisible.value = true
  }
  const closeHandle = () => {
    getGameInfoHandle()
    dialogVisible.value = false
  }

  const setScore = (score1: number, score2: number) => {
    setTeamScore({
      game_id: route.query.game_id,
      score_one: score1,
      score_two: score2,
    }).then((res: any) => {
      if (+res.code === 1) {
        ElNotification.success(i18n.t('other.set_score_success'))
        closeHandle()
      }
    })
  }
  const startLive = () => {
    ElMessageBox.confirm(
      i18n.t('other.isSure_start'),
      '',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )
      .then(() => {
        setStartRoll({ game_id: route.query.game_id }).then((res: any) => {
          if (+res.code === 1) {
            ElNotification.success('开始滚球')
            window.location.reload()
          }
        }).finally(() => {
          getGameInfoHandle()
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Delete canceled',
        })
      })
  }

  const rejectOrder = (reject_time: number | string) => {
    setRejectOrder({
      game_id: route.query.game_id,
      time: reject_time,
    })
      .then((res: any) => {
        if (+res.code === 1) {
          ElNotification.success('修改成功')
        }
      })
      .finally(() => {
        getGameInfoHandle()
      })
  }

  const handicapTime = (startTime: any) => {
    setHandicapTime({
      game_id: route.query.game_id,
      match: route.query.match,
      time: startTime,
    })
      .then((res: any) => {
        if (+res.code === 1) {
          ElNotification.success('修改成功')
        }
      })
      .finally(() => {
        getGameInfoHandle()
      })
  }

  onMounted(() => {
    getGameInfoHandle()
  })

  return {
    gameInfo,
    dialogVisible,
    getGameInfoHandle,
    open,
    closeHandle,
    setScore,
    startLive,
    rejectOrder,
    handicapTime,
  }
}
