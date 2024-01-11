<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<!-- eslint-disable no-case-declarations -->
<script lang="ts" setup>
import { ElMessage, ElSwitch, ElTable } from 'element-plus'
import {
  Check,
  CircleCheck,
  CircleClose,
  Edit,
  Sort,
} from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import lockHook from './hooks/lockHook'
import GameInfoSetting from './components/game-info-setting/index.vue'
import HandicapClose from './components/handicap-close/index.vue'
import OperateHistory from './components/operate-history/index.vue'
import PlaySetting from './components/play-setting/index.vue'
import tableBet from './components/tableBet/index.vue'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import MatchResultSettingsCom from './components/match-result-settings/index.vue'
import CRUD from '@/components/Crud'
import PageMain from '@/components/PageMain/index.vue'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/handicap-manage/fix-live-list'
import useUserStore from '@/store/modules/user'
import { toFixedNumber } from '@/utils'
import getRoundNameList from '@/hooks/getRoundNameList'
const route = useRoute()
const i18n = useI18n()
const router = useRouter()

const userStore = useUserStore()

const gameInfo = ref<any>({})

const currentExpandRowKey = ref<number[]>([])
const currentExpandRow = ref<any[]>([])

const scrollTopTemp = ref(0)

const singleTableRef = ref<InstanceType<typeof ElTable>>()

function handleExpand(row: any, expandedRows: any) {
  if (!gameInfo.value.reject_time) {
    singleTableRef.value?.toggleRowExpansion(row, false)
    return
  }
  currentExpandRowKey.value = expandedRows.map((row: any) => +row.id)
  currentExpandRow.value = expandedRows
}

const {
  lockStatusChange,
  lockSwitchDisabled,
  teamlockStatusChange,
  teamDisabled,
  changeOddsHandle,
  handleLockMore,
  teamHideStatusChange,
  teamSetRecommend,
} = lockHook()

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.t('table.handicap'),
  crudOptShow: {
    add: true,
    formSize: '60%',
  },
  defaultQuery: {
    game_id: route.query.game_id,
    match: +(route.query?.c_match || 1),
  },
  crudMethod: { ...Api },
  defaultForm: {
    region: '',
  },
  crudTag: 'fix-live:monitor',
}

const { roundList } = getRoundNameList(String(route.query.game_id))

function gameInfoChange(game_Info: any) {
  Object.assign(gameInfo.value, game_Info)
  if (!gameInfo.value.reject_time && currentExpandRow.value.length > 0) {
    currentExpandRow.value.forEach((row) => {
      singleTableRef.value?.toggleRowExpansion(row, false)
    })
    currentExpandRowKey.value = []
    currentExpandRow.value = []
  }
}

const switchHeadShow = ref(false)

const switchHeadParams = ref<any>({})

const setHeadNum = (form: any) => {
  const { playId, option, point_id } = form
  const params = {
    game_id: route.query?.game_id,
    play_id: playId,
    option,
    value: null,
    old_value: form.value,
    point_id,
  }
  switchHeadParams.value = params
  switchHeadShow.value = true
  scrollTopTemp.value
    = singleTableRef.value?.scrollBarRef.wrapRef.scrollTop || 0
}

function submitHeadNum() {
  Api.setSwitchHead(switchHeadParams.value).then((res: any) => {
    if (res && res.code === 1) {
      ElMessage.success(res.msg)
      switchHeadShow.value = false
      setTimeout(() => {
        refresh().then(() => {
          nextTick(() => {
            singleTableRef.value?.setScrollTop(scrollTopTemp.value)
          })
        })
      }, 2000)
    }
  })
}

const matchsList = computed(() => {
  const temp: any = []
  let roundListTemp: any[] = []
  if (Array.isArray(roundList.value)) {
    roundListTemp = roundList.value
  }
  else {
    const temp: any = Object.assign({}, roundList.value)
    if (!Object.keys(roundList.value).includes('0')) {
      temp['0'] = ''
    }
    temp.length = Object.keys(temp).length
    roundListTemp = Array.from(temp)
  }
  for (let index = 0; index < +(roundListTemp.length || 0); index++) {
    if (index === 0) {
      continue
    }
    if (roundList.value[index]) {
      temp.push({
        label: roundList.value[index],
        value: index,
      })
    }
    else {
      temp.push({
        label: `${i18n.t('other.no')} ${index} ${i18n.t('other.b')}`,
        value: index,
      })
    }
  }
  return temp
})

function setMatchName(match: number, row: any) {
  // if (+match === 0) {
  //   return `${i18n.t('other.total_')} ${row.play_name}`
  // }
  if (roundList.value[match]) {
    return `${roundList.value[match]} ${row.play_name}`
  }
  else {
    return `${i18n.t('other.no')} ${match} ${i18n.t('other.b')} ${
      row.play_name
    }`
  }
}

const { crudData, crudQuery, refresh, crudHook, toQuery, queryLoading }
  = CRUD(defaultCrudOptions)

const crudDataNow = ref<any[]>([])
const changeMatch = () => {
  showLength.value = 15
  const newUrl = `${route.path}?game_id=${route.query.game_id}&match=${route.query.match}&c_match=${crudQuery.match}`
  window.history.replaceState('', '', newUrl)
  toQuery()
  currentExpandRowKey.value = []
}

const tableShow = ref(false)

function dealData() {
  crudDataNow.value = crudData.value.map((row: any) => {
    const teams = row.team.map((team: any) => {
      return Object.assign({}, team, {
        point: +team.point,
        old_point: +team.point,
      })
    })
    return Object.assign({}, row, {
      team: teams,
      is_lock: !!row.admin_taken,
      loading: false,
      game_return_rate: +row.game_return_rate,
    })
  })
  tableShow.value = true
}

const showLength = ref(15)
const allDataLength = ref(0)
const showProgress = ref(false)

crudHook.beforeRefresh = () => {
  tableShow.value = false
  crudDataNow.value = []
  return true
}

crudHook.afterRefresh = () => {
  dealData()
  allDataLength.value = crudDataNow.value.length
  if (allDataLength.value > 15) {
    if (showLength.value > 15) {
      showLength.value = allDataLength.value
    }
    showProgress.value = true
  }
  else {
    showLength.value = allDataLength.value
  }
  return true
}

const canMoreLack = computed(() => {
  const tempArr: number[] = []
  for (const data of crudDataNow.value) {
    if (!data.admin_taken) {
      tempArr.push(Number(data.id))
    }
  }
  return tempArr
})

const canMoreNoLack = computed(() => {
  const tempArr: number[] = []
  for (const data of crudDataNow.value) {
    if (
      !!data.admin_taken
      && data.admin_taken === userStore.userInfo.username
    ) {
      tempArr.push(Number(data.id))
    }
  }
  return tempArr
})
// 局暂停
const canMoreStop = computed(() => {
  const tempArr: number[] = []
  // filterValue
  const currData = crudDataNow.value.filter((row: any) => {
    if (filterValue.value.length === 0 || filterValue.value.length === 3) {
      return true
    }
    else {
      return (
        (filterValue.value.includes('self')
          && row.admin_taken
          && row.admin_taken === userStore.userInfo.username)
        || (row.admin_taken
          && row.admin_taken !== userStore.userInfo.username
          && filterValue.value.includes('other'))
        || (!row.admin_taken && filterValue.value.includes('off'))
      )
    }
  })
  for (const data of currData) {
    if (!data.is_stop) {
      tempArr.push(Number(data.id))
    }
  }
  return tempArr
})
// 局恢复
const canMoreRecover = computed(() => {
  const tempArr: number[] = []
  for (const data of crudDataNow.value) {
    if (data.is_stop) {
      tempArr.push(Number(data.id))
    }
  }
  return tempArr
})

const changeAutoOdd = (row: any) => {
  return (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      Api.setAutoOdds({
        play_id: row.id,
        auto: row.third_odds_auto === 1 ? 2 : 1,
      })
        .then((res: any) => {
          if (res && res.code === 1) {
            resolve(true)
            ElMessage.success(res.msg)
          }
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }
}

const { proxy }: any = getCurrentInstance()

function toOpenHistory(row: any, teams: any[]) {
  const play_name = setMatchName(+row.match, row)
  proxy.mittBus.emit('openHistoryBus', { play_id: row.id, teams, play_name })
}

function toOpenPlaySetting(play_id?: any) {
  proxy.mittBus.emit('openPlaySettingBus', play_id)
}

function toPbl() {
  const routePage = router.resolve({
    name: 'ProgressBetList',
    query: {
      game_id: route.query.game_id,
    },
  })
  window.open(routePage.href, '_blank')
}
onMounted(() => {
  document.body.addEventListener('dragover', drag_over, false)
  document.body.addEventListener('drop', drop, false)
  proxy.mittBus.on('fixLiveMonitorBus', (data: any) => {
    switch (data.type) {
      case 'message_type_push_point_change':
        if (
          data.data.admin_id
          && +data.data.admin_id === +userStore.userInfo.admin_id
        ) {
          return
        }
        const point_change_id = crudDataNow.value.findIndex((row: any) => {
          return +row.id === +data.data.play_id
        })
        if (point_change_id !== -1) {
          (crudDataNow.value as any[])[point_change_id].team.forEach(
            (row: any, index: number) => {
              if (+row.id === +data.data.point_id) {
                Object.assign(
                  (crudDataNow.value as any[])[point_change_id].team[index],
                  { point: +data.data.point },
                )
              }
            },
          )
        }
        break
      case 'message_type_handicap_edit':
        if (+data.data.is_close) {
          (crudDataNow.value as any[]) = (crudDataNow.value as any[]).filter(
            (row: any) => {
              return !data.data.play_id.includes(row.id)
            },
          )
        }
        else {
          refresh()
        }
        break
      case 'message_type_game_play_set_recommend':
        const recommend_index = crudData.value.findIndex((row: any) => {
          return +row.id === +data.data.play_id
        })
        if (recommend_index !== -1) {
          if (+data.data.is_recommend) {
            (crudDataNow.value as any[]).forEach((_, index: number) => {
              (crudDataNow.value as any[])[index].is_recommend = 0
            })
          }
          (crudDataNow.value as any[])[recommend_index].is_recommend
            = data.data.is_recommend
        }
        break
      case 'message_trader_profit_loss_value_push':
        const trader_profit_loss_index = crudDataNow.value.findIndex(
          (row: any) => {
            return +row.id === +data.data.play_id
          },
        )
        if (trader_profit_loss_index !== -1) {
          (crudDataNow.value as any[])[trader_profit_loss_index].team.forEach(
            (row: any, index: number) => {
              const teamInfo = data.data.team.find((t: any) => {
                return +t.id === +row.id
              })
              if (teamInfo) {
                Object.assign(
                  (crudDataNow.value as any[])[trader_profit_loss_index].team[
                    index
                  ],
                  teamInfo,
                )
              }
            },
          )
        }
        break
      case 'message_type_point_display_on':
        const iddx = crudDataNow.value.findIndex((row: any) => {
          return +row.id === +data.data.play_id
        })
        if (iddx !== -1) {
          (crudDataNow.value as any[])[iddx].is_hide = data.data.is_hide
        }
        break
      case 'message_trader_game_admin_taken_push':
        const play_id_arr = data.data.play_id.split(',')
        for (const playId of play_id_arr) {
          const taken_idx = crudDataNow.value.findIndex((row: any) => {
            return +row.id === +playId
          })
          if (taken_idx !== -1) {
            (crudDataNow.value as any[])[taken_idx].admin_taken
              = data.data.admin_taken
            ;(crudDataNow.value as any[])[taken_idx].is_lock
              = !!data.data.admin_taken
          }
        }
        break
      case 'message_type_bet_item_single_lock':
        switch (data.data.action) {
          case 'match':
            (crudDataNow.value as any[]).forEach((play, index) => {
              if (
                +play.match === +data.data.match
                && showDataFilterIds.value.includes(Number(play.id))
              ) {
                (crudDataNow.value as any[])[index].is_stop
                  = +data.data.status === 1 ? 0 : 1
                ;(crudDataNow.value as any[])[index].team.forEach(
                  (_: any, index2: number) => {
                    (crudDataNow.value as any[])[index].team[index2].is_lock
                      = +data.data.status === 1 ? 0 : 1
                  },
                )
              }
            })
            break
          case 'play':
            const play_idx = crudDataNow.value.findIndex((row: any) => {
              return +row.id === +data.data.play_id
            })
            if (play_idx !== -1) {
              const cStatus = +data.data.status === 1 ? 0 : 1
              if (+(crudDataNow.value as any[])[play_idx].is_stop !== cStatus) {
                (crudDataNow.value as any[])[play_idx].is_stop = cStatus
              }
              (crudDataNow.value as any[])[play_idx].team.forEach(
                (_: any, index: number) => {
                  if (
                    +(crudDataNow.value as any[])[play_idx].team[index]
                      .is_lock !== cStatus
                  ) {
                    (crudDataNow.value as any[])[play_idx].team[
                      index
                    ].is_lock = cStatus
                  }
                },
              )
              // (crudDataNow.value as any[])[play_idx].is_stop
              //   = +data.data.status === 1 ? 0 : 1
              // ;(crudDataNow.value as any[])[play_idx].team.forEach(
              //   (_: any, index: number) => {
              //     (crudDataNow.value as any[])[play_idx].team[index].is_lock
              //       = +data.data.status === 1 ? 0 : 1
              //   },
              // )
            }
            break
          case 'side':
            const side_inx = crudDataNow.value.findIndex((row: any) => {
              return +row.id === +data.data.play_id
            })
            if (side_inx !== -1) {
              (crudDataNow.value as any[])[side_inx].team.forEach(
                (row: any, indd: number) => {
                  if (+row.id === +data.data.point_id) {
                    (crudDataNow.value as any[])[side_inx].team[indd].is_lock
                      = +data.data.status === 1 ? 0 : 1
                  }
                },
              )
            }
            break
          case 'message_trader_third_auto_odds_push':
            // 操盘自动操盘
            const index = crudDataNow.value.findIndex(
              (row: any) => +row.id === +data.data.play_id,
            )
            if (index !== -1) {
              (crudDataNow.value as any[])[index].third_odds_auto
                = data.data.third_odds_auto
              ;(crudDataNow.value as any[])[index].odds_auto
                = data.data.odds_auto
            }
            break
        }
        break
    }
  })
})

function toSeeBetList(query: any) {
  const routePage = router.resolve({
    path: '/bet-manage/bet-list',
    query,
  })
  window.open(routePage.href, '_blank')
}

const changeRateAmplitude = ref<number>(0.01)

function closeSuccessHandle(params: any) {
  if (params.refresh) {
    setTimeout(() => {
      refresh()
    }, 300)
  }
  if (params.type === 1) {
    crudDataNow.value = (crudDataNow.value as any[]).filter((play) => {
      return !params.play_id
        .map((id: string | number) => +id)
        .includes(+play.id)
    })
    if (currentExpandRow.value.length > 0) {
      currentExpandRow.value.forEach((row) => {
        singleTableRef.value?.toggleRowExpansion(row, false)
      })
      currentExpandRowKey.value = []
      currentExpandRow.value = []
    }
  }
}

function tableBetChange({ play_id, teams }: { play_id: number; teams: any[] }) {
  const playIndex = crudDataNow.value.findIndex((play) => {
    return +play.id === +play_id
  })
  if (playIndex !== -1) {
    crudDataNow.value[playIndex].team.forEach((team: any, index: number) => {
      team.live_bet_amount_next = teams[index].live_bet_amount
      team.live_profit_loss_next = teams[index].live_profit_loss
    })
  }
}
onUnmounted(() => {
  proxy.mittBus.off('fixLiveMonitorBus')
  document.body.removeEventListener('dragover', drag_over, false)
  document.body.removeEventListener('drop', drop, false)
})

function drag_start(event: any) {
  const style = window.getComputedStyle(event.target, null)
  event.dataTransfer.setData(
    'text/plain',
    `${parseInt(style.getPropertyValue('left'), 10) - event.clientX},${
      parseInt(style.getPropertyValue('top'), 10) - event.clientY
    }`,
  )
}
function drop(event: any) {
  const offset = event.dataTransfer.getData('text/plain').split(',')
  const dm: any = document.getElementById('progressBoxRef')
  dm.style.left = `${event.clientX + parseInt(offset[0], 10)}px`
  dm.style.top = `${event.clientY + parseInt(offset[1], 10)}px`
  event.preventDefault()
  return false
}

function drag_over(event: any) {
  event.preventDefault()
  return false
}

const matchLoading = reactive({
  loading: false,
})

const filterValue = ref<Array<'self' | 'other' | 'off'>>([])

watch(
  () => filterValue.value.length,
  () => {
    if (currentExpandRow.value.length > 0) {
      currentExpandRow.value.forEach((row) => {
        singleTableRef.value?.toggleRowExpansion(row, false)
      })
      currentExpandRowKey.value = []
      currentExpandRow.value = []
    }
  },
)

const showData = computed(() => {
  return crudDataNow.value.filter((row: any, index) => {
    if (filterValue.value.length === 0 || filterValue.value.length === 3) {
      return index < showLength.value
    }
    else {
      return (
        ((filterValue.value.includes('self')
          && row.admin_taken
          && row.admin_taken === userStore.userInfo.username)
          || (row.admin_taken
            && row.admin_taken !== userStore.userInfo.username
            && filterValue.value.includes('other'))
          || (!row.admin_taken && filterValue.value.includes('off')))
        && index < showLength.value
      )
    }
  })
})

const showDataFilterIds = computed(() => {
  return crudDataNow.value
    .filter((row: any) => {
      if (filterValue.value.length === 0 || filterValue.value.length === 3) {
        return true
      }
      else {
        return (
          (filterValue.value.includes('self')
            && row.admin_taken
            && row.admin_taken === userStore.userInfo.username)
          || (row.admin_taken
            && row.admin_taken !== userStore.userInfo.username
            && filterValue.value.includes('other'))
          || (!row.admin_taken && filterValue.value.includes('off'))
        )
      }
    })
    .map((row: any) => Number(row.id))
})

const filterParmas = [
  { text: '自己锁单', value: 'self' },
  { text: '他人锁单', value: 'other' },
  { text: '未锁单', value: 'off' },
]

const showEarly = ref(false)

provide(
  'match',
  computed(() => crudQuery.match),
)
</script>

<template>
  <PageMain
    :has-search="false"
    :has-footer="true"
    :has-tool="true"
    :title="`${$t('router.fix-live-monitor')} - ${route.query.game_name || ''}`"
  >
    <template #pageFooter>
      <Teleport to="body">
        <div
          id="progressBoxRef"
          class="progress-box"
          :draggable="true"
          @dragstart="drag_start"
        >
          <el-progress
            v-show="showProgress"
            type="dashboard"
            :percentage="(showLength * 100) / (allDataLength || 100)"
            :status="showLength === allDataLength ? 'success' : 'exception'"
          >
            <template #default>
              <el-button
                v-if="showLength === allDataLength"
                type="success"
                :icon="Check"
                circle
                @click="showProgress = false"
              />
              <template v-else>
                <div class="percentage-value">
                  {{ showLength }}/{{ allDataLength }}
                </div>
                <el-button
                  type="danger"
                  size="small"
                  style="margin-top: 8px"
                  @click="showLength = allDataLength"
                >
                  {{ $t("lib.all") }}
                </el-button>
              </template>
            </template>
          </el-progress>
        </div>
      </Teleport>
      <el-radio-group v-model="crudQuery.match" @change="changeMatch">
        <el-radio-button
          v-for="item in matchsList"
          :key="item.value"
          :label="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
      <MatchResultSettingsCom />
      <el-button type="warning" :icon="Sort" @click="toPbl">
        {{ $t("router.progress-bet-list") }}
      </el-button>
    </template>

    <template #pageTool>
      <div class="page-tool-header">
        <div v-if="+gameInfo.category_id === 3" class="lock">
          <el-button
            type="primary"
            size="small"
            :disabled="canMoreLack.length === 0"
            @click="handleLockMore(canMoreLack, 1, refresh)"
          >
            {{ $t("crud.lock") }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            :disabled="canMoreNoLack.length === 0"
            @click="handleLockMore(canMoreNoLack, 0, refresh)"
          >
            {{ $t("crud.un_lock") }}
          </el-button>
        </div>
        <GameInfoSetting :game-info="gameInfo" @change="gameInfoChange" />
        <div>
          <HandicapClose
            v-if="+gameInfo.category_id === 3"
            :match="crudQuery.match"
            @close-success="closeSuccessHandle"
          />
          <el-button
            v-only="toolPermission.stop"
            type="primary"
            :loading="matchLoading.loading"
            :icon="CircleClose"
            @click="
              teamlockStatusChange(
                'match',
                {
                  type: 0,
                  match: crudQuery.match,
                  play_id: canMoreStop,
                },
                matchLoading,
                refresh,
              )()
            "
          >
            {{ $t("crud.stop") }}
          </el-button>
          <el-button
            v-only="toolPermission.recover"
            type="primary"
            :icon="CircleCheck"
            :loading="matchLoading.loading"
            @click="
              teamlockStatusChange(
                'match',
                {
                  type: 1,
                  match: crudQuery.match,
                  play_id: canMoreRecover,
                },
                matchLoading,
                refresh,
              )()
            "
          >
            {{ $t("crud.recover") }}
          </el-button>
        </div>
      </div>
    </template>
    <!-- :header-cell-style="filterHeaderColumn" -->
    <template #pageBody>
      <ElTable
        ref="singleTableRef"
        v-loading="queryLoading"
        stripe
        row-key="id"
        style="width: 100%"
        height="100%"
        border
        resizable
        :data="tableShow ? showData : []"
        @expand-change="handleExpand"
      >
        <el-table-column v-if="gameInfo.category_id === 3" type="expand">
          <template #default="scope">
            <tableBet
              v-if="currentExpandRowKey.includes(+scope.row.id)"
              :row-info="scope.row"
              :no-deal="teamDisabled(scope.row, +gameInfo.category_id)"
              @change="tableBetChange"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="+gameInfo.category_id === 3"
          prop="lock"
          label="锁单"
          width="110"
          column-key="lock"
          align="center"
        >
          <template #header>
            <el-dropdown
              size="small"
              split-button
              :type="filterValue.length ? 'warning' : 'primary'"
              trigger="click"
              @click="filterValue = []"
            >
              <span>
                {{ filterValue.length ? $t("lib.all") : $t("crud.lock") }}</span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-checkbox-group v-model="filterValue" @click.stop>
                      <el-checkbox-button
                        v-for="item in filterParmas"
                        :key="item.value"
                        :label="item.value"
                      >
                        {{ item.text }}
                      </el-checkbox-button>
                    </el-checkbox-group>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #default="scope">
            <ElSwitch
              v-model="scope.row.is_lock"
              size="small"
              :loading="scope.row.loading"
              :disabled="lockSwitchDisabled(scope.row)"
              :before-change="lockStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="play_name"
          :label="$t('table.play_name')"
          min-width="160"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            <span>
              <span v-if="+scope.row.match === 0" style="color: #e6a23c">{{
                roundList[0] || $t("other.total_")
              }}</span>
              {{ scope.row.play_name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_hide"
          :label="$t('table.is_hide')"
          min-width="65"
          align="center"
        >
          <template #default="scope">
            <ElSwitch
              v-model="scope.row.is_hide"
              v-only="tablePermission.is_hiddle"
              :active-value="1"
              :inactive-value="0"
              :disabled="teamDisabled(scope.row, +gameInfo.category_id)"
              :before-change="
                teamHideStatusChange(
                  {
                    type: scope.row.is_hide,
                    play_id: scope.row.id,
                  },
                  refresh,
                )
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="is_stop"
          :label="$t('table.is_stop')"
          min-width="65"
          align="center"
        >
          <template #default="scope">
            <ElSwitch
              v-model="scope.row.is_stop"
              v-only="tablePermission.is_stop"
              :active-value="1"
              :inactive-value="0"
              :loading="scope.row.loading"
              :before-change="
                teamlockStatusChange(
                  'play',
                  {
                    type: scope.row.is_stop,
                    match: crudQuery.match,
                    play_id: scope.row.id,
                  },
                  scope.row,
                  refresh,
                )
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="betting"
          :label="$t('table.betting')"
          min-width="1100"
          align="center"
        >
          <template #header>
            <div
              :style="{
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'center',
              }"
            >
              <span>{{ $t("table.betting") }}</span>
              <el-input-number
                v-model.number="changeRateAmplitude"
                size="small"
                :min="0.001"
                :max="1"
                style="width: 100px; margin-left: 12px; height: 24px"
                :step="0.01"
                step-strictly
              />
              <el-radio-group
                v-model="changeRateAmplitude"
                :style="{ 'padding-left': '12px' }"
                size="small"
              >
                <el-radio-button :label="0.001" />
                <el-radio-button :label="0.01" />
                <el-radio-button :label="0.02" />
                <el-radio-button :label="0.05" />
                <el-radio-button :label="0.10" />
              </el-radio-group>
              <ElSwitch
                v-if="+gameInfo.category_id === 3"
                v-model="showEarly"
                :style="{ 'padding-left': '12px' }"
                inline-prompt
                style="
                  --el-switch-on-color: #13ce66;
                  --el-switch-off-color: #ff4949;
                "
                :active-text="$t('table.show_early')"
                :inactive-text="$t('table.hidden_early')"
              />
            </div>
          </template>
          <template #default="scope">
            <div
              class="betting"
              :class="{
                'more-three': scope.row.team.length > 2,
              }"
            >
              <div v-for="(team, index) in scope.row.team" :key="team.id">
                <!-- v-tooltip="{
                width: 100,
                message: team.team_name,
                }" -->
                <span class="team-name" :title="team.team_name">
                  <span>{{ team.team_name }}</span>
                </span>
                <el-button
                  v-if="
                    [1, 3].includes(scope.row.ext_type)
                      || ([11, 13].includes(scope.row.ext_type) && index === 0)
                  "
                  type="primary"
                  size="small"
                  :icon="Edit"
                  circle
                  @click="
                    setHeadNum({
                      playId: scope.row.id,
                      option: scope.row.play_type_ext.team_id,
                      value: team.team_name,
                      point_id: +team.id,
                    })
                  "
                />
                <el-button
                  v-if="[4, 5].includes(scope.row.ext_type) && index === 0"
                  type="primary"
                  size="small"
                  :icon="Edit"
                  circle
                  @click="
                    setHeadNum({
                      playId: scope.row.id,
                      value: team.team_name,
                      point_id: +team.id,
                    })
                  "
                />
                <template v-if="+gameInfo.category_id === 2">
                  <el-link
                    type="warning"
                    :title="$t('table.live_amount')"
                    @click="toSeeBetList({ point_id: team.id })"
                  >
                    {{ toFixedNumber(team.early_bet_amount, 0) }}
                  </el-link>
                  <span style="color: red" :title="$t('table.live_win_loss')">{{
                    toFixedNumber(team.early_profit_loss, 0)
                  }}</span>
                </template>
                <template v-if="+gameInfo.category_id === 3">
                  <div style="display: flex; flex-direction: column">
                    <el-tag
                      v-show="showEarly"
                      :title="$t('table.live_amount')"
                      type="warning"
                      effect="dark"
                    >
                      {{ toFixedNumber(team.early_bet_amount, 0) }}
                    </el-tag>
                    <el-link
                      type="warning"
                      :title="$t('table.fix_amount')"
                      @click="toSeeBetList({ point_id: team.id })"
                    >
                      {{ toFixedNumber(team.live_bet_amount, 0) }}
                    </el-link>
                    <el-tag
                      v-if="currentExpandRowKey.includes(+scope.row.id)"
                      :title="$t('table.fix_amount')"
                      type="warning"
                    >
                      {{ toFixedNumber(team.live_bet_amount_next, 0) }}
                    </el-tag>
                  </div>
                  <div style="display: flex; flex-direction: column">
                    <el-tag
                      v-show="showEarly"
                      :title="$t('table.live_win_loss')"
                      type="danger"
                      effect="dark"
                    >
                      {{ toFixedNumber(team.early_profit_loss, 0) }}
                    </el-tag>
                    <span
                      style="color: red"
                      :title="$t('table.fix_profit_lost')"
                    >{{ toFixedNumber(team.live_profit_loss, 0) }}</span>
                    <el-tag
                      v-if="currentExpandRowKey.includes(+scope.row.id)"
                      type="danger"
                      :title="$t('table.fix_profit_lost')"
                    >
                      {{ toFixedNumber(team.live_profit_loss_next, 0) }}
                    </el-tag>
                  </div>
                </template>
                <ElSwitch
                  v-model="team.is_lock"
                  v-only="tablePermission.is_lock"
                  :active-value="1"
                  :inactive-value="0"
                  :disabled="teamDisabled(scope.row, +gameInfo.category_id)"
                  :loading="team.loading"
                  :before-change="
                    teamlockStatusChange(
                      'side',
                      {
                        type: team.is_lock,
                        point_id: team.id,
                        match: crudQuery.match,
                        play_id: scope.row.id,
                      },
                      team,
                      refresh,
                    )
                  "
                />
                <el-input-number
                  v-model.number="team.point"
                  v-only="tablePermission.point"
                  size="small"
                  style="width: 100px; flex-shrink: 0; height: 24px"
                  :disabled="teamDisabled(scope.row, +gameInfo.category_id)"
                  :step="changeRateAmplitude"
                  :precision="3"
                  @change="changeOddsHandle(index, scope.row.team, scope.row)"
                />
                <!-- :step-strictly="true" -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="admin_taken"
          :label="$t('table.lock_people')"
          align="center"
          min-width="80"
        />
        <el-table-column
          prop="id"
          :label="$t('table.play_Id')"
          min-width="80"
          align="center"
        />
        <el-table-column
          prop="third_odds_auto"
          align="center"
          :label="$t('table.is_operate_trader')"
          min-width="120"
        >
          <template #default="scope">
            <div v-if="scope.row.odds_auto">
              <ElSwitch
                v-model="scope.row.third_odds_auto"
                v-only="tablePermission.is_exhibition"
                :active-value="2"
                :inactive-value="1"
                :before-change="changeAutoOdd(scope.row)"
              />
            </div>
            <div v-else>
              --
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_username"
          align="center"
          :label="$t('table.create_name')"
          min-width="120"
        />
        <el-table-column
          prop="operate"
          min-width="120"
          :label="$t('table.operate')"
          fixed="right"
          align="center"
        >
          <template #default="scope">
            <span v-some="Object.values(otherPermission)">
              <el-dropdown
                placement="bottom-end"
                :hide-on-click="false"
                trigger="click"
              >
                <el-button type="warning" link>
                  {{ $t("table.operateControl") }}
                </el-button>
                <template #dropdown>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.view"
                      type="primary"
                      size="small"
                      @click="toOpenHistory(scope.row, scope.row.team)"
                    >
                      {{ $t("table.view_operate_history") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.modify"
                      type="primary"
                      size="small"
                      @click="toOpenPlaySetting(scope.row.id)"
                    >
                      {{ $t("table.game_param_modify") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div>
                      <div style="text-align: center">
                        {{ $t("table.is_recommend") }}
                      </div>
                      <ElSwitch
                        v-model="scope.row.is_recommend"
                        v-only="tablePermission.is_exhibition"
                        :active-value="1"
                        :inactive-value="0"
                        :before-change="
                          teamSetRecommend(
                            {
                              type: scope.row.is_recommend,
                              play_id: scope.row.id,
                            },
                            refresh,
                          )
                        "
                      />
                    </div>
                  </el-dropdown-item>
                </template>
              </el-dropdown>
            </span>
          </template>
        </el-table-column>
        <div>///</div>
      </ElTable>
    </template>
    <template #other>
      <OperateHistory />
      <PlaySetting @refresh="refresh" />
      <el-dialog v-model="switchHeadShow" title="切换球头" width="460px">
        <template #header>
          切换球头
          <span style="color: red">当前值 {{ switchHeadParams.old_value }}</span>
        </template>

        <el-form ref="formRef" :model="switchHeadParams" label-width="120px">
          <el-form-item
            prop="value"
            label="球头值"
            :rules="[
              {
                required: true,
                message: 'Please input efficient value',
                trigger: 'blur',
              },
            ]"
          >
            <el-input-number
              v-model="switchHeadParams.value"
              :step="0.5"
              :min="0"
              step-strictly
              placeholder="球头值"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="switchHeadShow = false">{{
              $t("crud.cancel")
            }}</el-button>
            <el-button type="primary" @click="submitHeadNum">
              {{ $t("crud.sure") }}
            </el-button>
          </span>
        </template>
      </el-dialog>
    </template>
  </PageMain>
</template>

<style scoped lang="scss">
.progress-box {
  position: fixed;
  top: calc(100vh - 230px);
  left: calc(100vw - 230px);
  z-index: 10000;
  background-color: #00000099;
  border-radius: 50%;
}
.page-tool-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.team-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  & > div {
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex-shrink: 0;
    flex-wrap: wrap;
  }
}

.table-header-box {
  display: flex;
  height: 46px;
  align-items: center;
  background-color: rgb(231 134 7);
}
:deep(.el-switch) {
  height: auto;
}
.betting {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  & > div {
    display: flex;
    width: 48%;
    flex-shrink: 0;
    justify-content: center;
    padding: 2px 4px;
    border-radius: 4px;
    align-items: center;
    & > * + * {
      margin: 6px;
      white-space: nowrap;
    }
    .team-name {
      flex-grow: 1;
      overflow: hidden;
      height: 36px;
      font-weight: 600;
      display: flex;
      align-items: center;
      span {
        display: inline;
        max-height: 36px;
        line-height: 18px;
      }
    }
    &:nth-child(1) {
      background-color: #ff000020;
      .team-name {
        text-align: left;
      }
    }
    &:nth-child(2) {
      background-color: #00800020;
      flex-direction: row-reverse;
      position: relative;
      .team-name {
        justify-content: flex-end;
      }
      &::before {
        content: "VS";
        position: absolute;
        left: -6%;
        top: 8px;
      }
    }
  }
}
.more-three {
  flex-direction: column;
  .team-name {
    justify-content: flex-end !important;
  }
  & > div {
    width: 60%;
    background-color: #00000000 !important;
    flex-direction: row !important;
    &::before {
      display: none;
    }
  }
}
</style>
