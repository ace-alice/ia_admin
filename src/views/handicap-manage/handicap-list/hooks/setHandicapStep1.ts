import type { FormInstance, FormRules } from 'element-plus'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import getGameListHook from '@/hooks/getGameListHook'
import {
  editHandicapInfo,
  handicapInfo,
  submitHandicapInfo,
} from '@/api/handicap-manage/handicap-list'

const defaultForm: any = {
  id: null,
  game_id: null,
  game_type_id: null,
  event_id: null,
  show_time: null,
  game_start_time: null,
  is_champion: 0,
  team_id_1: null,
  team_id_2: null,
  bo: null,
  game_show_end_time: null,
  bonus_pool: null,
  team_info: '',
  champion_team_arr: [],
  champion_team: '',
}

export default function () {
  const i18n = useI18n()
  /**
   *  @description form表单DOM标识<crudDefaultForm>
   */
  const step1FormRef = ref<FormInstance>()

  const { gameList, gameChange, teamList, eventList, getGameName }
    = getGameListHook(true, true)

  const waiting1 = ref(false)

  const step1Form: any = reactive(Object.assign({}, defaultForm))

  const step1FormRules = reactive<FormRules>({
    game_type_id: [
      {
        required: true,
        message: i18n.t('table.game_type') + i18n.t('table.not_empty'),
      },
    ],
    event_id: [
      {
        required: true,
        message: i18n.t('table.game_event') + i18n.t('table.not_empty'),
      },
    ],
    team_id_1: [
      {
        required: true,
        message: i18n.t('table.team_id_1') + i18n.t('table.not_empty'),
      },
    ],
    team_id_2: [
      {
        required: true,
        message: i18n.t('table.team_id_2') + i18n.t('table.not_empty'),
      },
    ],
    show_time: [
      {
        required: true,
        message: i18n.t('table.show_time') + i18n.t('table.not_empty'),
      },
    ],
    game_start_time: [
      {
        required: true,
        message: i18n.t('table.game_start_time') + i18n.t('table.not_empty'),
      },
    ],
    game_show_end_time: [
      {
        required: true,
        message: i18n.t('table.game_show_end_time') + i18n.t('table.not_empty'),
      },
    ],
    champion_team_arr: [
      {
        required: true,
        message: i18n.t('table.champion_team_arr') + i18n.t('table.not_empty'),
      },
    ],
    bo: [
      {
        required: true,
        message: i18n.t('table.bo') + i18n.t('table.not_empty'),
      },
    ],
  })

  const oldChampionTeamArr: Ref<number[]> = ref([])

  function getHandicapInfo(gameId: number | string) {
    step1Form.game_id = gameId
    handicapInfo({ game_id: gameId })
      .then((res: any) => {
        waiting1.value = true
        if (+res.code === 1) {
          Object.assign(step1Form, res.data, {
            champion_team_arr: res.data.team_info
              ? res.data.team_info.split(',').map((id: string) => Number(id))
              : [],
            champion_team: res.data.team_info,
            bo: res.data.matches,
          })
          oldChampionTeamArr.value = res.data.team_info
            .split(',')
            .map((id: string) => Number(id))
          gameChange(step1Form.game_type_id)
        }
      })
      .finally(() => {
        waiting1.value = false
      })
  }

  function submitInfo() {
    return new Promise((resolve) => {
      if (!step1FormRef.value) {
        resolve(false)
        return
      }
      step1FormRef.value.validate((valid) => {
        if (valid) {
          waiting1.value = true
          const isEdit = !!step1Form.game_id
          const Api = isEdit ? editHandicapInfo : submitHandicapInfo
          const form = {
            game_id: step1Form.game_id,
            show_time: step1Form.show_time,
            game_start_time: step1Form.game_start_time,
            game_show_end_time: step1Form.game_show_end_time,
            bonus_pool: step1Form.bonus_pool,
            champion_team: step1Form.champion_team_arr.join(','),
            team_info: step1Form.champion_team_arr.join(','),
          }
          Api(
            isEdit
              ? form
              : Object.assign({}, step1Form, {
                champion_team: step1Form.champion_team_arr.join(','),
                team_info: step1Form.champion_team_arr.join(','),
                champion_team_arr: [],
              }),
          )
            .then((res: any) => {
              resolve(+res.code === 1)
              if (!isEdit) {
                step1Form.game_id = +res.data.game_id
              }
            })
            .catch(() => {
              resolve(false)
            })
            .finally(() => {
              waiting1.value = false
            })
        }
        else {
          resolve(false)
        }
      })
    })
  }

  function initStep1() {
    Object.assign(step1Form, defaultForm)
    oldChampionTeamArr.value = []
  }

  function step1ChangeGameId(id: any) {
    Object.assign(step1Form, {
      event_id: null,
      team_id_1: null,
      team_id_2: null,
      team_info: '',
      champion_team_arr: [],
      champion_team: '',
    })
    gameChange(id)
    setTimeout(() => {
      step1FormRef.value?.clearValidate()
    }, 100)
  }

  function changeIsChampion() {
    Object.assign(step1Form, {
      team_id_1: null,
      team_id_2: null,
      team_info: '',
      champion_team_arr: [],
      champion_team: '',
      bo: null,
      game_show_end_time: null,
      bonus_pool: null,
    })
    setTimeout(() => {
      step1FormRef.value?.clearValidate()
    }, 100)
  }

  return {
    step1FormRef,
    step1Form,
    initStep1,
    getHandicapInfo,
    waiting1,
    submitInfo,
    step1FormRules,
    step1ChangeGameId,
    changeIsChampion,
    gameChange,
    teamList,
    eventList,
    gameList,
    getGameName,
    oldChampionTeamArr,
  }
}
