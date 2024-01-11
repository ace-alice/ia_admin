import type { Ref } from 'vue'
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { getGameListApi } from '@/api/global/gameInfo'
import Api from '@/api/match-data-manage/default-setting'
const gameList: Ref<any[]> = ref([])
export default function defaultSetHook() {
  // 所属游戏
  const gameId = ref<any>('')
  // 赛事等级
  const level = ref<any>('')
  // 赛事等级下拉
  const levelOption: Ref<any[]> = ref([])
  const tempData: any = ref([])
  const pageData: any = ref([])
  const playList: any = ref([])
  const checkedCities: any = ref([])

  const leftDefaultPoint = ref(1.9)
  const fixDefaultRate = ref(95)
  const liveDefaultRate = ref(95)
  const payoutDefaultScale = ref(50)
  // 赛事列表
  // const eventList: any = ref([])
  const eventSelect: any = ref([])

  const getChecked = (source: Array<any>) => {
    checkedCities.value = []
    if (!source.length) {
      checkedCities.value = []
      return false
    }

    source.forEach((el: any) => {
      checkedCities.value.push(el)
    })
  }

  // 赛事等级下拉列表
  const getLevelOption = () => {
    return new Promise((resolve) => {
      Api.getEventLevel().then((res: any) => {
        if (res && res.code === 1) {
          levelOption.value = res.data
          level.value = levelOption.value[0].id
          resolve(true)
        }
      })
    })
  }
  // 获取玩法列表
  const getPlayList = () => {
    Api.getDefaultConfigPlayList({
      game_type_id: gameId.value,
      level_id: level.value,
    }).then((res: any) => {
      if (res && res.code === 1) {
        playList.value = res.data
      }
      else {
        playList.value = []
      }
    })
  }
  const getPageData = () => {
    Api.getList({
      game_type_id: gameId.value,
      level_id: level.value,
    }).then((res: any) => {
      if (res && res.code === 1) {
        pageData.value = res.data
        tempData.value = cloneDeep(res.data)
        getChecked(res.data)
      }
    })
    getPlayList()
  }

  function getNewOdd(point: number, game_return_rate: number) {
    if (+point === 1.001) {
      return '21.000'
    }
    const rate = game_return_rate / 100
    return Number(((rate * point) / (point - rate)).toFixed(3))
  }

  const checkAll = ref(false)

  const isIndeterminate = ref(false)

  function handleCheckAllChange(bool: any) {
    pageData.value.forEach((play: any) => {
      play.no_checked = Number(bool)
    })
  }

  const changePlaySelect = (item: any) => {
    pageData.value = item.map((play: any) =>
      Object.assign(play, {
        // fix_left_odds: play.fix_left_odds || leftDefaultPoint.value,
        fix_return_rate: play.fix_return_rate || fixDefaultRate.value,
        live_return_rate: play.live_return_rate || liveDefaultRate.value,
        // fix_right_odds:
        //   play.fix_right_odds
        //   || getNewOdd(leftDefaultPoint.value, fixDefaultRate.value),
        payout_scale: play.payout_scale || payoutDefaultScale.value,
      }),
    )
  }

  watch(
    () => pageData.value,
    () => {
      checkAll.value
        = pageData.value.every((play: any) => {
          return play.no_checked
        }) && pageData.value.length > 0
      isIndeterminate.value
        = pageData.value.some((play: any) => {
          return play.no_checked
        })
        && !checkAll.value
        && pageData.value.length > 0
    },
    { deep: true },
  )
  const getGameList = () => {
    return new Promise((resolve) => {
      getGameListApi().then((res: any) => {
        if (+res.code === 1) {
          gameList.value = res.data
          gameId.value = gameList.value[0].id
          resolve(true)
        }
      })
    })
  }
  // 单行保存
  const handleSave = (row: any) => {
    Api.saveDefaultById({
      config_json: row,
    }).then((res: any) => {
      if (res && res.code === 1) {
        ElNotification.success(res.msg)
        getPageData()
      }
    })
  }
  const submit = () => {
    Api.save({
      game_type_id: gameId.value,
      competition_level_id: level.value,
      config_arr: pageData.value,
    }).then((res: any) => {
      if (res && res.code === 1) {
        ElNotification.success(res.msg)
      }
    })
  }
  const setGameId = (value: number) => {
    gameId.value = value
  }
  const getEventSelect = (data: Array<any>) => {
    if (data.length > 0) {
      const temp: any = []
      data.forEach((item: any) => {
        temp.push(item.event_name)
      })
      return temp
    }
  }
  const eventList: any = computed(() => {
    if (!gameId.value || !level.value) {
      return false
    }
    Api.getEventListByParams({
      game_type_id: gameId.value,
      level_id: level.value,
    }).then((res: any) => {
      if (res && res.code === 1) {
        eventSelect.value = getEventSelect(res.data)
        return res.data
      }
      else {
        return []
      }
    })
  })

  // 重置
  const reset = () => {
    pageData.value = cloneDeep(tempData.value)
  }
  const handleChange = (id: number) => {
    setGameId(id)
    getPageData()
  }

  function selectAll() {
    changePlaySelect(playList.value)
    checkedCities.value = [...playList.value]
  }

  function fixReturnRateChange(row: any) {
    row.fix_right_odds = getNewOdd(+row.fix_left_odds, +row.fix_return_rate)
  }

  function defaultFixReturnRateChange() {
    pageData.value.forEach((play: any) => {
      play.fix_return_rate = fixDefaultRate.value
      play.fix_right_odds = getNewOdd(+play.fix_left_odds, +play.fix_return_rate)
    })
  }

  function defaultliveReturnRateChange() {
    pageData.value.forEach((play: any) => {
      play.live_return_rate = liveDefaultRate.value
    })
  }

  function defaultpayoutDefaultScaleChange() {
    pageData.value.forEach((play: any) => {
      play.payout_scale = payoutDefaultScale.value
    })
  }

  onMounted(() => {
    const promise = getGameList().then((res: any) => res)
    promise.then((res: any) => {
      if (res) {
        getLevelOption().then((value: any) => {
          if (value) {
            getPageData()
          }
        })
      }
    })
  })
  return {
    gameId,
    level,
    levelOption,
    pageData,
    eventList,
    checkedCities,
    playList,
    eventSelect,
    getGameList,
    getLevelOption,
    getPageData,
    handleSave,
    reset,
    submit,
    handleChange,
    changePlaySelect,
    selectAll,
    leftDefaultPoint,
    fixDefaultRate,
    liveDefaultRate,
    payoutDefaultScale,
    checkAll,
    isIndeterminate,
    handleCheckAllChange,
    fixReturnRateChange,
    defaultFixReturnRateChange,
    defaultliveReturnRateChange,
    defaultpayoutDefaultScaleChange,
  }
}
