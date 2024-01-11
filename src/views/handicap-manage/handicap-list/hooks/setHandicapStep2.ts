/* eslint-disable @typescript-eslint/no-use-before-define */
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules, TableColumnCtx } from 'element-plus'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  getAllPlaysApi,
  getChampionPlaysApi,
  getGamePlayTypeApi,
  getMatchLevelConfigApi,
  getMatchLevelLimitApi,
  submitChampionPlaysInfo,
  submitPlaysInfo,
} from '@/api/handicap-manage/handicap-list'

interface RoundItemType {
  id: number | string
  play_name: string
  ext_type: number | string
  desc: string
}

interface PlaysFormType {
  id: number | string
  game_type_id: number
  play_type_id: number
  play_type_ext: any
  match: any
  round: number
  is_recommend: number
  stop_game: number
  warning_game: number
  single_limit: number
  single_payout: number
  single_game: number
  single_parlay: number
  game_return_rate: number
  ext_type?: number
  play_name: string
  odds: Array<{ point: number; ext: number; desc?: string }>
}

interface MatchLevelLimitType {
  single_limit_min: number
  single_limit_max: number
  single_payout_min: number
  single_payout_max: number
  single_game_min: number
  single_game_max: number
  stop_game_min: number
  stop_game_max: number
  warning_game_min: number
  warning_game_max: number
  single_competition_min: number
  single_competition_max: number
  single_parlay_min: number
}

interface MatchLevelConfig {
  fix_left_odds: {
    [key: string]: number | string
  }
  fix_right_odds: {
    [key: string]: number | string
  }
  fix_return_rate: {
    [key: string]: number | string
  }
  live_return_rate: {
    [key: string]: number | string
  }
}

interface UnChampionFormType {
  level_id: string | number
  item: PlaysFormType[]
  single_competition: number | null
  game_id: number | null
}

interface ChPlaysFormType {
  id: number | string
  point: any
  desc: string
  team_id: number | string
}

interface ChampionFormType {
  id: number | string
  game_id: number | string
  play_type_id: number | string
  game_type_id: number | string
  play_name: string
  odds: ChPlaysFormType[]
}

const defaultChampionForm: ChampionFormType = {
  id: '',
  game_id: '',
  play_type_id: '',
  game_type_id: '',
  play_name: '',
  odds: [],
}
const defaultUnChampionForm: UnChampionFormType = {
  level_id: '',
  item: [],
  single_competition: null,
  game_id: null,
}

const oldCheckedPlayIds: Ref<number[]> = ref([])

export default function () {
  const i18n = useI18n()

  const boRound = ref(0)

  function setStep2Bo(bo: number) {
    boRound.value = bo
  }

  const step2FormRules = reactive<FormRules>({
    match_level: [
      {
        required: true,
        message: i18n.t('table.event_leve_name') + i18n.t('table.not_empty'),
      },
    ],
  })

  const step2FormRef = ref<FormInstance>()

  const waiting2 = ref(false)

  /**
   * @description 冠军盘数据
   * */
  const championForm: ChampionFormType = reactive(
    Object.assign({}, defaultChampionForm),
  )

  /**
   * @description 非冠军数据
   * */
  const unChampionForm: UnChampionFormType = reactive(
    Object.assign({}, defaultUnChampionForm),
  )

  const currentRound = ref(1)

  /**
   * @description 游戏玩法
   * */
  const round1PlaysItems: Ref<RoundItemType[]> = ref([])

  const round1Checked: Ref<any[]> = ref([])

  const round2PlaysItems: Ref<RoundItemType[]> = ref([])

  const round2Checked: Ref<any[]> = ref([])

  const chPlaysItems: Ref<RoundItemType[]> = ref([])

  function getPlaysItemsGroup(
    ext_type: number | string,
    items: RoundItemType[],
  ) {
    return items.filter((play) => {
      return +play.ext_type === +ext_type
    })
  }

  const typeLabels = [
    i18n.t('table.basic (single game)'),
    i18n.t('table.handicap (overall)'),
    i18n.t('table.winner (overall)'),
    i18n.t('table.handicap (single game)'),
    i18n.t('table.over/under (overall)'),
    i18n.t('table.over/under (single game)'),
    i18n.t('table.score (overall)'),
    '',
    i18n.t('table.multiple options (overall)'),
    i18n.t('table.multiple options (single game)'),
    i18n.t('table.single team (single game)'),
    i18n.t('table.single team over/under (single game)'),
    i18n.t('table.single team (overall)'),
    i18n.t('table.single team over/under (overall)'),
  ]

  function getGamePlayType(
    game_type_id: string | number,
    isC: Boolean = false,
  ) {
    if (isC) {
      getGamePlayTypeApi({ game_type_id, round: 3 }).then((res: any) => {
        if (+res.code === 1) {
          chPlaysItems.value = res.data
          if (
            chPlaysItems.value.length > 0
            && championTeamArr.value.length > championForm.odds.length
          ) {
            if (!championForm.play_type_id) {
              championForm.play_type_id = chPlaysItems.value[0].id
              championForm.play_name = chPlaysItems.value[0].play_name
            }
            // getGamePlayTypeApi3
            const otherTeam = championTeamArr.value.filter((teamId) => {
              return !championForm.odds.find((team) => {
                return +team.team_id === +teamId
              })
            })
            otherTeam.forEach((teamId) => {
              const team = teamListArr.value.find((teamInfo) => {
                return teamId === teamInfo.id
              })
              if (team) {
                championForm.odds.push({
                  id: '',
                  team_id: teamId,
                  desc: team.team_name,
                  point: null,
                })
              }
            })
          }
        }
      })
      return
    }
    getGamePlayTypeApi({ game_type_id, round: 1 }).then((res: any) => {
      if (+res.code === 1) {
        round1PlaysItems.value = res.data
      }
    })
    getGamePlayTypeApi({ game_type_id, round: 2 }).then((res: any) => {
      if (+res.code === 1) {
        round2PlaysItems.value = res.data
      }
    })
  }

  /**
   * @description 当前赛事等级的限红配置信息
   * */
  const currentMatchLevelLimit: Ref<MatchLevelLimitType | any> = ref({})

  function getMatchLevelLimit() {
    return new Promise((resolve) => {
      if (!unChampionForm.level_id) {
        currentMatchLevelLimit.value = {}
        return resolve(false)
      }
      getMatchLevelLimitApi({
        level_id: unChampionForm.level_id,
      })
        .then((res: any) => {
          if (+res.code === 1) {
            currentMatchLevelLimit.value = res.data
            unChampionForm.single_competition
              = currentMatchLevelLimit.value.single_competition_min
            resolve(true)
          }
          else {
            currentMatchLevelLimit.value = {}
            resolve(false)
          }
        })
        .catch(() => {
          currentMatchLevelLimit.value = {}
          resolve(false)
        })
    })
  }

  const currentMatchLevelConfig: Ref<MatchLevelConfig | any> = ref({})

  function getMatchLevelConfig(game_type_id: number | string) {
    return new Promise((resolve) => {
      if (!unChampionForm.level_id) {
        currentMatchLevelConfig.value = {}
        return resolve(false)
      }
      getMatchLevelConfigApi({
        game_type_id,
        level_id: unChampionForm.level_id,
      })
        .then((res: any) => {
          if (+res.code === 1) {
            if (!Array.isArray(res.data)) {
              currentMatchLevelConfig.value = res.data
              resolve(true)
            }
            else {
              currentMatchLevelConfig.value = {}
              resolve(true)
            }
          }
          else {
            currentMatchLevelConfig.value = {}
            resolve(false)
          }
        })
        .catch(() => {
          currentMatchLevelConfig.value = {}
          resolve(false)
        })
    })
  }

  function currentMatchLevelChange(
    game_type_id: number | string,
    team1: string,
    team2: string,
  ) {
    Promise.all([getMatchLevelLimit(), getMatchLevelConfig(game_type_id)]).then(
      ([data1, data2]: any[]) => {
        if (data1 && data2) {
          if (!unChampionForm.game_id) {
            //
          }
          else {
            unChampionForm.item = unChampionForm.item.filter((play) => {
              return oldCheckedPlayIds.value.includes(+play.play_type_id)
            })
            round1Checked.value = round1Checked.value.filter((playId) => {
              return oldCheckedPlayIds.value.includes(+playId)
            })
            round2Checked.value = round2Checked.value.filter((playId) => {
              return oldCheckedPlayIds.value.includes(+playId)
            })
            if (Object.keys(currentMatchLevelConfig.value).length > 3) {
              const plays = Object.keys(
                currentMatchLevelConfig.value.fix_return_rate,
              )
                .map((id: string) => Number(id))
                .filter(
                  id =>
                    +currentMatchLevelConfig.value.no_checked[String(id)] === 1,
                )
              for (const playId of plays) {
                const thePlay1 = round1PlaysItems.value.find((play) => {
                  return playId === play.id
                })
                const thePlay2 = round2PlaysItems.value.find((play) => {
                  return playId === play.id
                })
                if (
                  thePlay1
                  && !oldCheckedPlayIds.value.includes(+thePlay1.id)
                ) {
                  round1Checked.value.push(playId)
                  changePlayHandle(
                    1,
                    playId,
                    thePlay1,
                    +game_type_id,
                    team1,
                    team2,
                  )
                }
                if (
                  thePlay2
                  && !oldCheckedPlayIds.value.includes(+thePlay2.id)
                ) {
                  round2Checked.value.push(playId)
                  changePlayHandle(
                    2,
                    playId,
                    thePlay2,
                    +game_type_id,
                    team1,
                    team2,
                  )
                }
              }
            }
          }
        }
      },
    )
  }

  function countScoreArr(match: number) {
    const arr = []
    let i
    const left = match % 2
    const max = Math.ceil((match + 1) / 2)
    for (i = 0; i < max; i++) {
      if (i + max > match) {
        break
      }
      arr.push(`${max}-${i}`)
      arr.push(`${i}-${max}`)
    }
    if (left === 0) {
      arr.push(`${match / 2}-${match / 2}`)
    }

    return arr
  }

  function changePlayHandle(
    round: number,
    playId: number | string,
    playInfo: any,
    game_type_id: number,
    team1: string,
    team2: string,
    add = false,
  ) {
    const thRound = round === 1 ? round1Checked.value : round2Checked.value
    const isAdd = thRound.includes(playId) || add
    if (isAdd) {
      const game_return_rate = currentMatchLevelConfig.value.fix_return_rate
        ? currentMatchLevelConfig.value.fix_return_rate[String(playId)] || null
        : null
      const ballValue = currentMatchLevelConfig.value.ball_value
        ? +currentMatchLevelConfig.value.ball_value[String(playId)] || null
        : null
      const odds: Array<{
        point: number
        ext: number
        team_name: string
        desc?: string
      }> = []
      if (playInfo.desc) {
        playInfo.desc.split(',').forEach((item: string, index: number) => {
          const team_name
            = item === '[team1]' ? team1 : item === '[team2]' ? team2 : item
          let point: any = null
          if (playInfo.desc.split(',').length < 3) {
            const pointCache
              = currentMatchLevelConfig.value[
                index === 0 ? 'fix_left_odds' : 'fix_right_odds'
              ]
            point = pointCache ? pointCache[String(playId)] || null : null
          }
          odds.push({
            point,
            ext: index + 1,
            team_name,
          })
        })
      }
      else {
        if (+playInfo.ext_type === 6) {
          const oddTemp = countScoreArr(boRound.value)
          oddTemp.forEach((pointName: string, index: number) => {
            odds.push({
              point: 0,
              ext: index + 1,
              team_name: pointName,
              desc: pointName,
            })
          })
        }
        else {
          [0, 1].forEach((_, index: number) => {
            const pointCache
              = currentMatchLevelConfig.value[
                index === 0 ? 'fix_left_odds' : 'fix_right_odds'
              ]
            const point = pointCache ? pointCache[String(playId)] || null : null
            odds.push({
              point,
              ext: index + 1,
              team_name: index === 0 ? team1 : team2,
            })
          })
        }
      }
      let addIdx = unChampionForm.item.length

      if (round === 1) {
        addIdx = unChampionForm.item.filter((play) => {
          return play.round === 1
        }).length
      }
      let playTypeExt: any = ''
      if ([1, 3, 11, 13].includes(+playInfo.ext_type)) {
        playTypeExt = {
          team_id: null,
          number: ballValue,
        }
      }
      if ([10, 12].includes(+playInfo.ext_type)) {
        playTypeExt = {
          team_id: null,
        }
      }
      if ([4, 5].includes(+playInfo.ext_type)) {
        playTypeExt = ballValue
      }
      unChampionForm.item.splice(addIdx, 0, {
        id: '',
        round,
        game_type_id,
        play_type_id: +playId,
        play_type_ext: playTypeExt,
        ext_type: playInfo.ext_type,
        match: round === 1 ? 0 : null,
        is_recommend: 0,
        play_name: playInfo.play_name,
        stop_game: currentMatchLevelLimit.value.stop_game_min || null,
        warning_game: currentMatchLevelLimit.value.warning_game_min || null,
        single_limit: currentMatchLevelLimit.value.single_limit_min || null,
        single_payout: currentMatchLevelLimit.value.single_payout_min || null,
        single_game: currentMatchLevelLimit.value.single_game_min || null,
        single_parlay: currentMatchLevelLimit.value.single_parlay_min || null,
        game_return_rate,
        odds,
      })
    }
    else {
      if ([1, 3, 4, 5].includes(+playInfo.ext_type)) {
        unChampionForm.item = unChampionForm.item.filter((play) => {
          return play.id || +play.play_type_id !== +playId
        })
      }
      else {
        const idx = unChampionForm.item.findIndex((play) => {
          return +play.play_type_id === +playId
        })
        if (idx !== -1) {
          unChampionForm.item.splice(idx, 1)
        }
      }
    }
  }

  function playTypeExtTeam(
    playTypeExt: { team_id: any; number?: any },
    index: number,
    playTypeId: string | number,
    extType: number | string,
  ) {
    if (
      [10, 12].includes(+extType)
      || (playTypeExt.team_id && playTypeExt.number)
    ) {
      const extPlay = unChampionForm.item.filter((play, inx) => {
        if ([10, 12].includes(+extType)) {
          return (
            play.play_type_ext
            && play.play_type_ext.team_id
            && index !== inx
            && +playTypeExt.team_id === +play.play_type_ext.team_id
            && +playTypeId === +play.play_type_id
          )
        }
        else {
          return (
            play.play_type_ext
            && play.play_type_ext.number
            && play.play_type_ext.team_id
            && index !== inx
            && +playTypeExt.team_id === +play.play_type_ext.team_id
            && +playTypeExt.number === +play.play_type_ext.number
            && +playTypeId === +play.play_type_id
          )
        }
      })
      if (extPlay.length > 0) {
        ElMessage.warning('玩法已存在')
        if ([10, 12].includes(+extType)) {
          playTypeExt.team_id = null
        }
        else {
          playTypeExt.number = null
        }
      }
    }
  }

  function playTypeExtOffset(
    playTypeExt: any,
    index: number,
    playTypeId: string | number,
  ) {
    if (playTypeExt) {
      const extPlay = unChampionForm.item.filter((play, inx) => {
        return (
          play.play_type_ext
          && index !== inx
          && +playTypeExt === +play.play_type_ext
          && +playTypeId === +play.play_type_id
        )
      })

      if (extPlay.length > 0) {
        ElMessage.warning('玩法已存在')
        unChampionForm.item[index].play_type_ext = null
      }
    }
  }

  function objectSpanMethod({
    row,
    rowIndex,
    columnIndex,
  }: {
    row: PlaysFormType
    column: TableColumnCtx<PlaysFormType>
    rowIndex: number
    columnIndex: number
  }) {
    if (columnIndex < 1) {
      const rowSpan: number = unChampionForm.item.filter(
        item => item.round === row.round,
      ).length
      if (rowIndex === 0) {
        return {
          rowspan: rowSpan,
          colspan: 1,
        }
      }
      else {
        if (unChampionForm.item[rowIndex - 1].round === row.round) {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
        else {
          const rowSpan: number = unChampionForm.item.filter(
            item => item.round === row.round,
          ).length
          return {
            rowspan: rowSpan,
            colspan: 1,
          }
        }
      }
    }
  }

  function deletePlay(round: number, playId: number, index: number) {
    unChampionForm.item.splice(index, 1)
    if (round === 2) {
      round2Checked.value = [
        ...new Set(
          unChampionForm.item
            .filter(item => +item.round === +round)
            .map((item) => {
              return +item.play_type_id
            }),
        ),
      ]
    }
    else {
      round1Checked.value = [
        ...new Set(
          unChampionForm.item
            .filter(item => +item.round === +round)
            .map((item) => {
              return +item.play_type_id
            }),
        ),
      ]
    }
  }

  function dealPlayTypeExt(playTypeExt: any) {
    let temp: any
    if (!playTypeExt) {
      temp = ''
    }
    else if (!Number.isNaN(Number(playTypeExt))) {
      temp = Number(playTypeExt)
    }
    else {
      const playTypeExtInfo = JSON.parse(playTypeExt || '')
      if (Object.keys(playTypeExtInfo).includes('team_id')) {
        temp = {
          team_id: Number(playTypeExtInfo.team_id),
          number: Number.isNaN(Number(playTypeExtInfo.number))
            ? 'opc'
            : Number(playTypeExtInfo.number),
        }
      }
    }
    return temp
  }

  function mapPlaysHandle(playsItem: any[]) {
    return playsItem
      .filter((item: any) => {
        return +item.match === 1 || +item.match === 0
      })
      .map((play: any) => {
        const temp: any = {}
        if (dealPlayTypeExt(play.play_type_ext)) {
          temp.assist_play_id = `${play.id}`
        }
        Object.assign(play, {
          round: Number(play.match) + 1,
          game_return_rate: Number(play.game_return_rate),
          play_type_ext: dealPlayTypeExt(play.play_type_ext),
          odds: play.odds.map((odd: any, index: number) => {
            return Object.assign(odd, {
              point: Number(odd.point),
              ext: index + 1,
            })
          }),
        })
        delete play.match
        return play
      })
      .sort((a, b) => a.round - b.round)
  }

  function getPlayIds(playsItem: any[], match: number) {
    return playsItem
      .filter((item: any) => {
        return +item.round === +match
      })
      .map((play: any) => Number(play.play_type_id))
  }

  function getAllPlays(
    game_id: string | number,
    is_champion: boolean,
    leve_id: any,
  ) {
    if (leve_id) {
      unChampionForm.level_id = leve_id
    }
    getAllPlaysApi(game_id).then((res: any) => {
      if (+res.code === 1) {
        unChampionForm.game_id = +game_id
        unChampionForm.item = mapPlaysHandle(res.data)
        round1Checked.value = getPlayIds(res.data, 1)
        round2Checked.value = getPlayIds(res.data, 2)
        oldCheckedPlayIds.value = [
          ...round1Checked.value,
          ...round2Checked.value,
        ]
      }
    })
  }

  const championTeamArr: Ref<any[]> = ref([])

  const teamListArr: Ref<any[]> = ref([])

  function getChampionPlayList(
    game_id: string | number,
    champion_team_arr: any[],
    teamList: any[],
    game_type_id: string | number,
    isEdit: boolean,
  ) {
    championForm.game_id = +game_id
    championTeamArr.value = champion_team_arr
    teamListArr.value = teamList
    championForm.game_type_id = game_type_id
    if (!isEdit) {
      return
    }
    Object.assign(championForm, { odds: [] })
    return new Promise((resolve) => {
      getChampionPlaysApi(game_id)
        .then((res: any) => {
          if (+res.code === 1) {
            Object.assign(
              championForm,
              Object.keys(res.data).length > 0
                && res.data.game_id
                && res.data.play_type_id
                ? res.data
                : { odds: [] },
            )
            for (let i = 0; i < championForm.odds.length; i++) {
              championForm.odds[i].point = Number(championForm.odds[i].point)
            }
          }
        })
        .finally(() => {
          resolve(true)
        })
    })
  }

  function initStep2() {
    Object.assign(unChampionForm, defaultUnChampionForm)
    unChampionForm.item = []
    Object.assign(championForm, defaultChampionForm)
    championForm.odds = []
    currentMatchLevelConfig.value = {}
    currentMatchLevelLimit.value = {}
    round1Checked.value = []
    round2Checked.value = []
    round1PlaysItems.value = []
    round2PlaysItems.value = []
    oldCheckedPlayIds.value = []
  }

  function savePlays(bo: number, isChampion = false) {
    return new Promise((resolve) => {
      if (!step2FormRef.value) {
        return resolve(false)
      }
      step2FormRef.value?.validate((valid) => {
        if (!valid) {
          resolve(false)
        }
        else {
          waiting2.value = true
          if (isChampion) {
            let items: any[] = []
            items = championForm.odds
              .filter(item => !item.id)
              .map((item) => {
                return {
                  point: item.point,
                  team_id: item.team_id,
                  ext: 1,
                }
              })
            const formData = {
              game_id: championForm.game_id,
            }
            const itemTemp = {
              odds: items,
              play_type_id: championForm.play_type_id,
              play_id: championForm.id,
            }
            Object.assign(formData, { item: JSON.stringify(itemTemp) })
            submitChampionPlaysInfo(formData)
              .then((res: any) => {
                if (+res.code === 1) {
                  resolve(true)
                }
                else {
                  resolve(false)
                }
              })
              .catch(() => resolve(false))
              .finally(() => {
                waiting2.value = false
              })
          }
          else {
            let items: any[] = []
            const formData: any = {}
            const round1Plays = unChampionForm.item
              .filter((play) => {
                return play.round === 1 && !play.id
              })
              .map((play) => {
                const form: any = {}
                return Object.assign(
                  {},
                  play,
                  {
                    match: 0,
                    play_type_ext: JSON.stringify(play.play_type_ext),
                  },
                  form,
                )
              })
            items = [...items, ...round1Plays]
            const round2Plays = unChampionForm.item.filter((play) => {
              return play.round === 2 && !play.id
            })
            for (let i = 1; i <= bo; i++) {
              const match = i
              round2Plays.forEach((play) => {
                const form: any = {}
                if (play.id) {
                  form.play_id = play.id
                }
                items.push(
                  Object.assign(
                    {},
                    play,
                    {
                      match,
                      is_recommend: Number(i === 1 && !!play.is_recommend),
                      play_type_ext: JSON.stringify(play.play_type_ext),
                    },
                    form,
                  ),
                )
              })
            }
            Object.assign(formData, unChampionForm, {
              item: JSON.stringify(items),
            })
            submitPlaysInfo(formData)
              .then((res: any) => {
                if (+res.code === 1) {
                  resolve(true)
                }
                else {
                  resolve(false)
                }
              })
              .catch(() => resolve(false))
              .finally(() => {
                waiting2.value = false
              })
          }
        }
      })
    })
  }

  function setRecommend(playTypeId: number, round: number, index: number) {
    const thePlays
      = round === 1 ? round1PlaysItems.value : round2PlaysItems.value
    const playInfo = thePlays.find((play) => {
      return +play.id === +playTypeId
    })
    if (playInfo && ![6, 7, 8, 9].includes(+playInfo.ext_type)) {
      for (let i = 0; i < unChampionForm.item.length; i++) {
        unChampionForm.item[i].is_recommend = Number(i === index)
      }
    }
    else {
      ElMessage.warning('该玩法玩法设展')
    }
  }

  const stopGameStopValid = (rule: any, value: any, callback: any) => {
    if (!+value) {
      callback(
        new Error(`${i18n.t('table.stop_game')}${i18n.t('table.not_empty')}`),
      )
    }
    if (
      +value < currentMatchLevelLimit.value.stop_game_min
      || +value > currentMatchLevelLimit.value.stop_game_max
    ) {
      callback(
        new Error(
          `${i18n.t('table.stop_game')} ${
            currentMatchLevelLimit.value.stop_game_min
          } - ${currentMatchLevelLimit.value.stop_game_max}`,
        ),
      )
    }
    else {
      callback()
    }
  }

  const warningGameValid = (rule: any, value: any, callback: any) => {
    if (!+value) {
      callback(
        new Error(`${i18n.t('table.warning_game')}${i18n.t('table.not_empty')}`),
      )
    }
    if (
      +value < currentMatchLevelLimit.value.warning_game_min
      || +value > currentMatchLevelLimit.value.warning_game_max
    ) {
      callback(
        new Error(
          `${i18n.t('table.warning_game')} ${
            currentMatchLevelLimit.value.warning_game_min
          } - ${currentMatchLevelLimit.value.warning_game_max}`,
        ),
      )
    }
    else {
      callback()
    }
  }

  const singleLimitValid = (rule: any, value: any, callback: any) => {
    if (!+value) {
      return callback(
        new Error(`${i18n.t('table.single_limit')}${i18n.t('table.not_empty')}`),
      )
    }
    if (
      +value < currentMatchLevelLimit.value.single_limit_min
      || +value > currentMatchLevelLimit.value.single_game_max
    ) {
      callback(
        new Error(
          `${i18n.t('table.single_limit')} ${
            currentMatchLevelLimit.value.single_limit_min
          } - ${currentMatchLevelLimit.value.single_game_max}`,
        ),
      )
    }
    else {
      callback()
    }
  }

  const singlePayoutValid = (rule: any, value: any, callback: any) => {
    if (!+value) {
      callback(
        new Error(
          `${i18n.t('table.single_payout')}${i18n.t('table.not_empty')}`,
        ),
      )
    }
    if (
      +value < currentMatchLevelLimit.value.single_payout_min
      || +value > currentMatchLevelLimit.value.single_payout_max
    ) {
      callback(
        new Error(
          `${i18n.t('table.single_payout')} ${
            currentMatchLevelLimit.value.single_payout_min
          } - ${currentMatchLevelLimit.value.single_payout_max}`,
        ),
      )
    }
    else {
      callback()
    }
  }

  function oddChange(index: number, odds: any[], row: any) {
    if (odds.length > 2) {
      const allHas = odds.every((odd: any) => {
        return +odd.point >= 1.001 && +odd.point <= 500
      })
      if (allHas) {
        let temp = 0
        odds.forEach((odd: any) => {
          temp += 1 / +odd.point
        })
        row.game_return_rate = Number(((1 / temp) * 100).toFixed(3))
      }
      return
    }
    if (!row.game_return_rate) {
      odds[index].point = null
      return ElMessage.error('请先输入返还率')
    }
    if (odds.length === 2 && row.game_return_rate) {
      if (+odds[index].point === 1.001) {
        odds[Number(!index)].point = 21
      }
      else {
        const rate = +row.game_return_rate / 100
        const nextOdd = Number(
          ((rate * +odds[index].point) / (odds[index].point - rate)).toFixed(3),
        )
        if (nextOdd < 1.001 || nextOdd > 24) {
          odds[Number(!index)].point = null
          odds[index].point = null
          return ElMessage.warning('请输入 1.001 - 24 的数字')
        }
        else {
          odds[Number(!index)].point = nextOdd
        }
      }
    }
  }

  const oldReturnRate = ref(0)

  function gameReturnRateChange(odds: any[], row: any) {
    if (odds.length === 2) {
      odds[0].point = null
      odds[1].point = null
    }
    if (
      odds.length > 2
      && row.game_return_rate < 100.1
      && row.game_return_rate > 9
      && oldReturnRate.value
    ) {
      for (let i = 0; i < odds.length; i++) {
        odds[i].point = Number(
          (
            +row.game_return_rate
            / 100
            / (oldReturnRate.value / 100 / odds[i].point)
          ).toFixed(2),
        )
      }
    }
  }

  function cacheReturnRate(row: any) {
    if (row.game_return_rate < 100.1 && row.game_return_rate > 9) {
      oldReturnRate.value = +row.game_return_rate
    }
  }

  interface SummaryMethodProps<T = ChPlaysFormType> {
    columns: TableColumnCtx<T>[]
    data: T[]
  }

  const getSummaries = (param: SummaryMethodProps) => {
    const { columns, data } = param
    const sums: any[] = []
    columns.forEach((column, index) => {
      if (index < 3) {
        sums[index] = ''
        return
      }
      if (index === 3) {
        sums[index] = '抽水总和'
        return
      }
      const values = data.map(item => Number(item.point))
      let prev = 0
      for (const value of values) {
        if (value && value > 0) {
          prev += 100 / value
        }
      }
      sums[index] = prev.toFixed(3)
    })

    return sums
  }

  const championOddWarning = (rule: any, value: any, callback: any) => {
    const values = championForm.odds.map(item => Number(item.point))
    if (
      values.every((value) => {
        return !Number.isNaN(value) && value > 1
      })
    ) {
      let prev = 0
      for (const value of values) {
        if (value && value > 0) {
          prev += 100 / value
        }
      }
      if (prev < 100) {
        callback(new Error('预警值必须大于100'))
      }
      else {
        callback()
      }
    }
    else {
      callback()
    }
  }

  const gameReturnRateValid = (rule: any, value: any, callback: any) => {
    if (Number(value) < 0 || Number(value) === 0) {
      callback(new Error('请输入合法的返还率'))
    }
    if (
      currentMatchLevelLimit.value
      && currentMatchLevelLimit.value.game_return_rate_max
    ) {
      if (+value > +currentMatchLevelLimit.value.game_return_rate_max) {
        callback(
          new Error(
            `返还率不能大于${currentMatchLevelLimit.value.game_return_rate_max}`,
          ),
        )
      }
      else {
        callback()
      }
    }
    else {
      if (+value > 98) {
        callback(
          new Error(
            `返还率不能大于${currentMatchLevelLimit.value.game_return_rate_max}`,
          ),
        )
      }
      else {
        callback()
      }
    }
  }

  // function changePlayHandle(
  //   round: number,
  //   playId: number | string,
  //   playInfo: any,
  //   game_type_id: number,
  //   team1: string,
  //   team2: string,
  //   add = false,
  // )

  function addAllPlays(
    round: 1 | 2,
    play_type_id: number,
    team1: string,
    team2: string,
  ) {
    const playsItems
      = round === 2 ? round2PlaysItems.value : round1PlaysItems.value
    const roundChecked = round === 2 ? round2Checked.value : round1Checked.value
    playsItems
      .filter((play) => {
        return !roundChecked.includes(+play.id)
      })
      .forEach((playItem) => {
        changePlayHandle(
          round,
          +playItem.id,
          playItem,
          play_type_id,
          team1,
          team2,
          true,
        )
      })
    if (round === 2) {
      round2Checked.value = playsItems.map(play => Number(play.id))
    }
    else {
      round1Checked.value = playsItems.map(play => Number(play.id))
    }
  }

  function clearAllPlays(roundTemp: number) {
    unChampionForm.item = unChampionForm.item.filter((play) => {
      return play.id || +play.round !== roundTemp
    })
    if (roundTemp === 2) {
      round2Checked.value = unChampionForm.item
        .filter(play => +play.round === +roundTemp)
        .map((play: any) => Number(play.play_type_id))
      round2Checked.value = [...new Set([...round2Checked.value])]
    }
    else {
      round1Checked.value = unChampionForm.item
        .filter(play => +play.round === +roundTemp)
        .map((play: any) => Number(play.play_type_id))
      round1Checked.value = [...new Set([...round1Checked.value])]
    }
  }

  return {
    clearAllPlays,
    championOddWarning,
    getSummaries,
    getChampionPlayList,
    singleLimitValid,
    singlePayoutValid,
    step2FormRef,
    championForm,
    unChampionForm,
    getGamePlayType,
    round1PlaysItems,
    round2PlaysItems,
    currentMatchLevelLimit,
    currentMatchLevelConfig,
    currentMatchLevelChange,
    currentRound,
    round1Checked,
    round2Checked,
    getPlaysItemsGroup,
    typeLabels,
    step2FormRules,
    changePlayHandle,
    objectSpanMethod,
    getAllPlays,
    initStep2,
    oldCheckedPlayIds,
    deletePlay,
    savePlays,
    waiting2,
    setRecommend,
    stopGameStopValid,
    warningGameValid,
    oddChange,
    gameReturnRateChange,
    cacheReturnRate,
    getMatchLevelLimit,
    setStep2Bo,
    playTypeExtTeam,
    playTypeExtOffset,
    getMatchLevelConfig,
    gameReturnRateValid,
    addAllPlays,
  }
}
