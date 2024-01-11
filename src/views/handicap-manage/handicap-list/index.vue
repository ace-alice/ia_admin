<!-- suppress ALL -->
<route lang="yaml">
name: handicapList
meta:
  title: 盘口列表
  constant: false
  layout: true
</route>

<!-- suppress ES6MissingAwait -->
<script lang="ts" setup name="handicapList">
import {
  Delete,
  Edit,
  Plus,
  RefreshRight,
  Search,
} from '@element-plus/icons-vue'
import { ElMessageBox, ElNotification, ElOption, ElSelect } from 'element-plus'
import dayjs from 'dayjs'
import { otherPermission, tablePermission } from './hooks/permission'
import setHandicapStep1 from './hooks/setHandicapStep1'
import setHandicapStep2 from './hooks/setHandicapStep2'
import SeeDetailCom from './components/SeeDetailCom.vue'
import ThirdBindCom from './components/ThirdBindCom.vue'
import AssignOperators from './components/AssignOperators.vue'
import ChangeTheNameOfTheRound from './components/ChangeTheNameOfTheRound.vue'
import getMatchLevelListHook from '@/hooks/getMatchLevelListHook'
import visibleColumn from '@/hooks/visibleColumn'
import CRUD from '@/components/Crud'
import PageMain from '@/components/PageMain/index.vue'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/handicap-manage/handicap-list'
import { dictionary } from '@/hooks/lib'
import { parseTime } from '@/utils/formatTime'
import useUserStore from '@/store/modules/user'
import { i18n } from '@/i18n'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('table.handicap'),
  crudOptShow: {
    add: true,
    formSize: '80%',
  },
  defaultQuery: {
    game_type_id: null,
    event_id: null,
    level_id: null,
    is_champion: 0,
    is_parlay: null,
    is_live_notice: null,
    bo: null,
    is_finish: 0,
    is_hide: null,
    create_user: null,
    game_start_time: dayjs().subtract(2, 'day').startOf('date').unix(),
    game_end_time: dayjs().endOf('date').unix(),
  },
  crudMethod: { ...Api },
  defaultForm: {
    id: null,
  },
  crudTag: 'handicap:list:',
}

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  changeStatus,
  crudStatus,
  toAdd,
  resetCrudStatus,
  dialogVisible,
  submitHandle,
  crudOptShow,
  proxyForm,
  toEdit,
  reQuery,
  crudSetQueryKey,
  setTheQuery,
  crudHook,
} = CRUD(defaultCrudOptions)

const { isNot } = dictionary()

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()

const stepStatus = ref(0)

const { matchLevelList } = getMatchLevelListHook()

const {
  step1FormRef,
  step1Form,
  getHandicapInfo,
  waiting1,
  initStep1,
  submitInfo,
  step1FormRules,
  step1ChangeGameId,
  changeIsChampion,
  gameList,
  gameChange,
  teamList,
  eventList,
  getGameName,
  oldChampionTeamArr,
} = setHandicapStep1()

const {
  step2FormRef,
  championForm,
  unChampionForm,
  getSummaries,
  getGamePlayType,
  round1PlaysItems,
  round2PlaysItems,
  currentMatchLevelChange,
  currentRound,
  round1Checked,
  round2Checked,
  getPlaysItemsGroup,
  typeLabels,
  changePlayHandle,
  objectSpanMethod,
  getAllPlays,
  getChampionPlayList,
  initStep2,
  oldCheckedPlayIds,
  deletePlay,
  savePlays,
  waiting2,
  stopGameStopValid,
  warningGameValid,
  singleLimitValid,
  singlePayoutValid,
  gameReturnRateValid,
  oddChange,
  gameReturnRateChange,
  cacheReturnRate,
  championOddWarning,
  getMatchLevelLimit,
  setStep2Bo,
  playTypeExtTeam,
  getMatchLevelConfig,
  playTypeExtOffset,
  addAllPlays,
  clearAllPlays,
} = setHandicapStep2()

crudHook.beforeToCU = async (form: any) => {
  if (form.id) {
    getHandicapInfo(form.id)
  }
  return true
}

crudHook.beforeValidateCU = async () => {
  const result = await savePlays(step1Form.bo, !!step1Form.is_champion)
  if (!result) {
    return false
  }
  resetCrudStatus2()
  await toQuery()
  return false
}

async function nextStepHandle() {
  const isPass = await submitInfo()
  if (isPass) {
    ElNotification({
      title: '赛事基础信息保存成功',
      type: 'success',
    })
    setStep2Bo(+step1Form.bo)

    if (!+step1Form.is_champion) {
      getGamePlayType(step1Form.game_type_id)
      getAllPlays(step1Form.game_id, !step1Form.is_champion, proxyForm.leve_id)
      getMatchLevelLimit().then(() => {})
      getMatchLevelConfig(step1Form.game_type_id).then(() => {})
    }
    else {
      await getChampionPlayList(
        step1Form.game_id,
        step1Form.champion_team_arr,
        teamList.value,
        step1Form.game_type_id,
        !!step1Form.id,
      )
      await getGamePlayType(step1Form.game_type_id, true)
    }
    setTimeout(() => {
      stepStatus.value = 1
    }, 300)
  }
}

function prevStepHandle() {
  initStep2()
  stepStatus.value = 0
}

function changeGameId(id: string | number) {
  setTheQuery({ event_id: null })
  gameChange(id)
}

function resetCrudStatus2() {
  resetCrudStatus()
  initStep1()
  initStep2()
  stepStatus.value = 0
}

const seeDetailCom = ref(false)

const seeDetailId = ref('')

const seeDetailMatch = ref({})

function seeDetailComHandle(row: any) {
  seeDetailMatch.value = row
  seeDetailId.value = String(row.id)
  seeDetailCom.value = true
}

function changeSeeDetailCom(bool: boolean) {
  seeDetailCom.value = bool
}

const seeThirdBind = ref(false)

function seeThirdBindHandle(row: any) {
  seeDetailMatch.value = row
  seeDetailId.value = String(row.id)
  seeThirdBind.value = true
}

function changeThirdBind(bool: boolean) {
  seeThirdBind.value = bool
  if (!bool) {
    refresh()
  }
}

const router = useRouter()
function toFinish(row: any, is_champion: boolean) {
  const routePage = router.resolve({
    path: is_champion
      ? '/handicap-manage/champion-handicap-settle'
      : '/handicap-manage/normal-handicap-settle',
    query: {
      game_id: row.id,
      game_name: row.game_name,
      event_name: row.event_name,
      match: row.matches,
      vs_info:
        row.team_id_1_name && row.team_id_2_name
          ? `${row.team_id_1_name} vs ${row.team_id_2_name}  `
          : '',
    },
  })
  window.open(routePage.href, '_blank')
}

function toHandicapMonitoring(
  row: any,
  game_id: string | number,
  is_champion: boolean,
  ob = 0,
) {
  const routePage = router.resolve({
    path: is_champion
      ? '/handicap-manage/champion-list'
      : '/handicap-manage/fix-live-monitor',
    query: {
      game_id,
      match: ob,
      game_name: row.game_name,
    },
  })
  window.open(routePage.href, '_blank')

  // router.push({
  //   name: is_champion ? 'championList' : 'fixLiveMonitor',
  //   query: {
  //     game_id,
  //     match: ob,
  //   },
  // })
}

const { userInfo } = storeToRefs(useUserStore())

const { proxy }: any = getCurrentInstance()

function toClaim(row: any) {
  proxy.mittBus.emit('assignOperatorsBus', row)
}

function changeRoundName(row: any) {
  proxy.mittBus.emit('openChangeRoundNameBus', row)
}

function editMatchLevel(row: any) {
  const isLoading = ref(false)
  const matchLevelForm = reactive<any>({
    game_id: null,
    level_id: null,
    leve_name: null,
  })
  Object.assign(matchLevelForm, {
    game_id: +row.id,
    level_id: +row.leve_id,
    leve_name: row.leve_name,
  })
  const options: any[] = []
  for (const matchLevel of matchLevelList.value) {
    options.push(
      h(ElOption, {
        value: matchLevel.id,
        label: matchLevel.level,
      }),
    )
  }
  ElMessageBox({
    title: `${i18n.global.t('crud.edit')}${i18n.global.t(
      'table.event_leve_name',
    )}`,
    showCancelButton: true,
    beforeClose: (action, instance, done) => {
      if (action === 'cancel') {
        done()
      }
      if (action === 'confirm') {
        if (isLoading.value) {
          return
        }
        isLoading.value = true
        Api.matchlevelEditApi(matchLevelForm)
          .then((res: any) => {
            if (+res.code === 1) {
              row.leve_id = matchLevelForm.level_id
              row.leve_name = matchLevelForm.leve_name
              done()
            }
          })
          .finally(() => {
            setTimeout(() => {
              isLoading.value = false
            }, 500)
          })
      }
    },
    // Should pass a function if VNode contains dynamic props
    message: () =>
      h(
        ElSelect,
        {
          'modelValue': matchLevelForm.level_id,
          'onUpdate:modelValue': (val: boolean | string | number) => {
            matchLevelForm.level_id = +val
          },
          'onChange': (val: any) => {
            const theMatch = matchLevelList.value.find((match) => {
              return +match.id === +val
            })
            if (!theMatch) {
              return
            }
            matchLevelForm.leve_name = theMatch.level
          },
        },
        () => options,
      ),
  })
}

const team1Img = ref('')
const team2Img = ref('')

function setTeam1Img(data: any) {
  const team = teamList.value.find((t: any) => {
    return +t.id === +data
  })
  if (team) {
    team1Img.value = team.logo
  }
}
function setTeam2Img(data: any) {
  const team = teamList.value.find((t: any) => {
    return +t.id === +data
  })
  if (team) {
    team2Img.value = team.logo
  }
}
</script>

<template>
  <PageMain
    class="handicap-list"
    :title="$t('router.handicap-list')"
    :has-footer="true"
    :has-tool="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="140px">
        <el-form-item :label="$t('table.game_id')">
          <el-input
            v-model="crudQuery.game_id"
            type="number"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.game_type')">
          <ElSelect
            v-model="crudQuery.game_type_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
            @change="changeGameId(crudQuery.game_type_id)"
          >
            <ElOption
              v-for="game in gameList"
              :key="game.id"
              :label="game.game_name"
              :value="game.id"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item :label="$t('table.game_event')">
          <ElSelect
            v-model="crudQuery.event_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <ElOption
              v-for="event in eventList"
              :key="event.id"
              :label="event.event_name"
              :value="event.id"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item :label="$t('table.event_leve_name')">
          <ElSelect
            v-model="crudQuery.level_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <ElOption
              v-for="item in matchLevelList"
              :key="item.id"
              :label="item.level"
              :value="item.id"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item :label="$t('table.is_champion')">
          <ElSelect
            v-model="crudQuery.is_champion"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
          >
            <ElOption
              v-for="item in isNot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item :label="$t('table.is_parlay')">
          <ElSelect
            v-model="crudQuery.is_parlay"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <ElOption
              v-for="item in isNot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item :label="$t('table.is_live_notice')">
          <ElSelect
            v-model="crudQuery.is_live_notice"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <ElOption
              v-for="item in isNot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item :label="$t('table.bo')">
          <el-input
            v-model="crudQuery.bo"
            type="number"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.is_finish')">
          <ElSelect
            v-model="crudQuery.is_finish"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <ElOption
              v-for="item in isNot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item :label="$t('table.is_hide')">
          <ElSelect
            v-model="crudQuery.is_hide"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <ElOption
              v-for="item in isNot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item :label="$t('table.is_hot')">
          <ElSelect
            v-model="crudQuery.is_hot"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <ElOption
              v-for="item in isNot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item :label="$t('table.is_bind_ant_before_game_info')">
          <ElSelect
            v-model="crudQuery.is_bind_ant_before_game_info"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <ElOption
              v-for="item in isNot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item :label="$t('table.create_name')">
          <el-input
            v-model="crudQuery.create_user"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.game_time')">
          <dateTimePickerQuery
            start-key="game_start_time"
            end-key="game_end_time"
            :prop-time="[crudQuery.game_start_time, crudQuery.game_end_time]"
            @set-time="crudSetQueryKey"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="Search"
            :loading="queryLoading"
            @click="toQuery"
          >
            {{ $t("crud.search") }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="RefreshRight"
            :loading="queryLoading"
            @click="reQuery"
          >
            {{ $t("crud.reset") }}
          </el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #pageTool>
      <el-button type="primary" :icon="Plus" @click="toAdd">
        {{ $t("crud.add") }}
      </el-button>
    </template>
    <template #pageBody>
      <el-table
        ref="tableRef"
        v-loading="queryLoading"
        :data="crudData"
        stripe
        row-key="id"
        style="width: 100%"
        height="100%"
        border
        resizable
        :header-cell-style="filterHeaderColumn"
      >
        <el-table-column
          v-if="getColumnShow('id')"
          prop="id"
          :label="$t('table.game_id')"
          min-width="80"
          align="center"
        >
          <!-- is_bind_ant_before_game_info -->
          <template #default="scope">
            <div>
              {{ scope.row.id }}
            </div>
            <template
              v-if="
                [1, 2, 3, 16].includes(+scope.row.game_type_id)
                  && !+scope.row.is_champion
              "
            >
              <div
                v-if="+scope.row.is_bind_ant_before_game_info > 0"
                style="color: green"
              >
                ({{ $t("lib.has_bind") }})
              </div>
              <div v-else style="color: red">
                ({{ $t("lib.no_bind") }})
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('game_start_time')"
          prop="game_start_time"
          :label="$t('table.game_start_time')"
          min-width="180"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.game_start_time">
              {{ parseTime(scope.row.game_start_time) }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('matches')"
          prop="matches"
          :label="$t('table.bo_number')"
          min-width="60"
          align="center"
        >
          <template #default="scope">
            <span v-if="!+scope.row.is_champion">
              {{ scope.row.matches }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('game_name')"
          prop="game_name"
          :label="$t('table.game_name')"
          min-width="100"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('event_name')"
          prop="event_name"
          :label="$t('table.event_name')"
          min-width="140"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('team_info')"
          prop="team_info"
          :label="$t('table.team_name')"
          min-width="200"
        >
          <template #default="scope">
            <span v-if="+scope.row.is_champion">
              <el-tag
                v-for="team in scope.row.team_info.split(',')"
                :key="team"
                style="margin: 3px 3px 0 0"
                type="success"
              >
                {{ team }}
              </el-tag>
            </span>
            <div v-else style="display: flex; align-items: center">
              <div
                :style="{
                  'margin-right': '5px',
                  'line-height': '54px',
                  'background': '#67c23a40',
                }"
              >
                VS
              </div>
              <div>
                <el-tag style="margin-bottom: 5px" type="danger" effect="dark">
                  {{ scope.row.team_id_1_name }}
                </el-tag>
                <br>
                <el-tag effect="dark">
                  {{ scope.row.team_id_2_name }}
                </el-tag>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('event_leve_name')"
          prop="leve_name"
          :label="$t('table.event_leve_name')"
          min-width="90"
          align="center"
        >
          <template #default="scope">
            <span v-if="!+scope.row.is_champion && scope.row.leve_name">
              {{ scope.row.leve_name }}
              <el-button
                size="small"
                type="primary"
                :icon="Edit"
                circle
                @click="editMatchLevel(scope.row)"
              />
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('points_count_2')"
          prop="points_count_2"
          :label="$t('table.points_count_2')"
          min-width="90"
          align="center"
        >
          <template #default="scope">
            <span v-if="!+scope.row.is_champion">
              {{ scope.row.points_count_2 }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
            v-if="getColumnShow('is_champion')"
            prop="is_champion"
            :label="$t('table.is_champion')"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              <el-tag
                effect="dark"
                :type="scope.row.is_champion ? 'warning' : 'success'"
              >
                {{ scope.row.is_champion ? $t("lib.yes") : $t("lib.no") }}
              </el-tag>
            </template>
          </el-table-column> -->
        <el-table-column
          v-if="getColumnShow('is_finish')"
          prop="is_finish"
          :label="$t('table.is_finish')"
          min-width="90"
          align="center"
        >
          <template #default="scope">
            <el-tag
              effect="dark"
              :type="+scope.row.is_finish ? 'warning' : 'success'"
            >
              {{
                scope.row.is_finish ? $t("lib.has_finish") : $t("lib.no_finish")
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('create_user_name')"
          prop="create_user_name"
          :label="$t('table.create_name')"
          min-width="120"
          align="center"
        >
          <template #default="scope">
            <el-tooltip placement="top-end">
              <template #content>
                <div>
                  {{ $t("table.create_name") }}：{{
                    scope.row.create_user_name
                  }}
                </div>
                <div>
                  {{ $t("table.create_time") }}：{{
                    parseTime(scope.row.create_time)
                  }}
                </div>
                <div>
                  {{ $t("table.action_name") }}：{{
                    scope.row.update_user_name
                  }}
                </div>
                <div>
                  {{ $t("table.update_time") }}：{{
                    parseTime(scope.row.update_time)
                  }}
                </div>
              </template>
              {{ scope.row.create_user_name }}
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('claim_user')"
          prop="claim_user"
          :label="$t('table.claim_user')"
          min-width="240"
          fixed="right"
        >
          <template #default="scope">
            <span v-if="scope.row.is_champion">--</span>
            <div v-else>
              <div>
                <span>{{ $t("table.fix") }}:</span>
                <span v-if="scope.row.fix_operator">
                  <el-tag
                    v-for="na in scope.row.fix_operator.split(',')"
                    :key="na"
                    :style="{ margin: '2px' }"
                    :effect="userInfo.username === na ? 'dark' : 'plain'"
                  >{{ na }}</el-tag>
                </span>
              </div>
              <div>
                <span>{{ $t("table.live") }}:</span>
                <span v-if="scope.row.live_operator">
                  <el-tag
                    v-for="na in scope.row.live_operator.split(',')"
                    :key="na"
                    :style="{ margin: '2px' }"
                    type="success"
                    :effect="userInfo.username === na ? 'dark' : 'plain'"
                  >{{ na }}</el-tag>
                </span>
              </div>
              <div>
                <span>{{ $t("table.toFinish") }}:</span>
                <span v-if="scope.row.settle_operator">
                  <el-tag
                    v-for="na in scope.row.settle_operator.split(',')"
                    :key="na"
                    :style="{ margin: '2px' }"
                    type="warning"
                    :effect="userInfo.username === na ? 'dark' : 'plain'"
                  >{{ na }}</el-tag>
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('is_hide')"
          prop="is_hide"
          :label="$t('table.is_hide')"
          width="120"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.id"
              :init-value="scope.row.is_hide"
              :options="isNot"
              :default-param="{
                game_id: scope.row.id,
                type: scope.row.is_hide,
              }"
              param-key="type"
              :change-fun="changeStatus"
              emit-fun-name="isHide"
              :permission="tablePermission.isHide"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('is_parlay')"
          prop="is_parlay"
          :label="$t('table.is_parlay')"
          width="120"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <PromiseSwitch
              v-if="!scope.row.is_champion"
              :key="scope.row.id"
              :init-value="scope.row.is_parlay"
              :options="isNot"
              :default-param="{
                game_id: scope.row.id,
                type: scope.row.is_parlay,
              }"
              param-key="type"
              :change-fun="changeStatus"
              emit-fun-name="isParlay"
              :permission="tablePermission.isParlay"
            />
            <div v-else>
              --
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operate')"
          width="120"
          align="center"
          fixed="right"
        >
          <template #header>
            <FilterColumnControl :column-info="columnInfo" />
          </template>
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
                      v-only="otherPermission.edit"
                      type="primary"
                      size="default"
                      @click="toEdit(scope.row)"
                    >
                      {{ $t("crud.edit") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="!scope.row.is_champion">
                    <el-button
                      v-only="otherPermission.thirdBind"
                      type="success"
                      size="default"
                      @click="seeThirdBindHandle(scope.row)"
                    >
                      {{ $t("crud.thirdBind") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.handicapMonitoring"
                      type="success"
                      size="default"
                      @click="
                        toHandicapMonitoring(
                          scope.row,
                          scope.row.id,
                          !!scope.row.is_champion,
                          scope.row.matches,
                        )
                      "
                    >
                      {{ $t("crud.handicapMonitoring") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.toFinish"
                      type="warning"
                      size="default"
                      @click="toFinish(scope.row, !!scope.row.is_champion)"
                    >
                      {{ $t("crud.toFinish") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="!scope.row.is_champion">
                    <el-button
                      v-only="otherPermission.toChangeRoundName"
                      type="info"
                      size="default"
                      @click="changeRoundName(scope.row)"
                    >
                      {{ $t("table.ChangeTheNameOfTheRound") }}
                    </el-button>
                  </el-dropdown-item>
                  <!-- v-only="otherPermission.toClaim" -->
                  <el-dropdown-item v-if="!scope.row.is_champion">
                    <el-button
                      type="info"
                      size="default"
                      @click="toClaim(scope.row)"
                    >
                      {{ $t("table.to_claim") }}
                    </el-button>
                  </el-dropdown-item>
                  <!-- <el-dropdown-item v-if="!scope.row.is_champion">
                      <div>
                        <div style="text-align: center">
                          {{ $t("table.is_parlay") }}
                        </div>
                        <PromiseSwitch
                          :key="scope.row.id"
                          :init-value="scope.row.is_parlay"
                          :options="isNot"
                          :default-param="{
                            game_id: scope.row.id,
                            type: scope.row.is_parlay,
                          }"
                          param-key="type"
                          :change-fun="changeStatus"
                          emit-fun-name="isParlay"
                          :permission="tablePermission.isParlay"
                        />
                      </div>
                    </el-dropdown-item> -->
                  <el-dropdown-item v-if="!scope.row.is_champion">
                    <div>
                      <div style="text-align: center">
                        {{ $t("table.is_live_notice") }}
                      </div>
                      <PromiseSwitch
                        :key="scope.row.id"
                        :init-value="scope.row.bowls_prediction"
                        :options="isNot"
                        :default-param="{
                          game_id: scope.row.id,
                          type: scope.row.bowls_prediction,
                        }"
                        param-key="type"
                        :change-fun="changeStatus"
                        emit-fun-name="bowlsPrediction"
                        :permission="tablePermission.bowlsPrediction"
                      />
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="!scope.row.is_champion">
                    <div>
                      <div style="text-align: center">
                        {{ $t("table.is_hot") }}
                      </div>
                      <PromiseSwitch
                        v-if="!scope.row.is_champion"
                        :key="scope.row.id"
                        :init-value="scope.row.is_hot"
                        :options="isNot"
                        :default-param="{
                          game_id: scope.row.id,
                          type: scope.row.is_hot,
                        }"
                        param-key="type"
                        :change-fun="changeStatus"
                        emit-fun-name="isHot"
                        :permission="tablePermission.isHot"
                      />
                    </div>
                  </el-dropdown-item>
                </template>
              </el-dropdown>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <template #pageFooter>
      <el-pagination
        v-model:current-page="crudPage.page"
        v-model:page-size="crudPage.limit"
        :page-sizes="[10, 50, 100, 500, 1000]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="crudPage.count"
        @size-change="refresh"
        @current-change="refresh"
      />
    </template>
    <template #other>
      <AssignOperators @change="refresh" />
      <ChangeTheNameOfTheRound />
      <SeeDetailCom
        :show="seeDetailCom"
        :game-id="seeDetailId"
        @change="changeSeeDetailCom"
      />
      <ThirdBindCom
        :game-id="seeDetailId"
        :match-info="seeDetailMatch"
        :show="seeThirdBind"
        @change="changeThirdBind"
      />
      <el-dialog
        v-model="dialogVisible"
        :before-close="resetCrudStatus"
        :width="crudOptShow.formSize"
        :close-on-press-escape="false"
        :show-close="false"
        fullscreen
        destroy-on-close
      >
        <template #header>
          <div class="body-step">
            <div class="title">
              {{ crudStatus.title }}
            </div>
            <div class="body">
              <el-steps
                :active="stepStatus"
                align-center
                finish-status="success"
              >
                <el-step :title="$t('table.baseConfig')" />
                <el-step :title="$t('table.playsConfig')" />
              </el-steps>
            </div>
            <div />
          </div>
        </template>
        <div class="dialog-body">
          <template v-if="stepStatus === 0">
            <el-form
              ref="step1FormRef"
              :model="step1Form"
              label-width="120px"
              :rules="step1FormRules"
              size="large"
              class="step1-form"
            >
              <el-form-item :label="$t('table.game_type')" prop="game_type_id">
                <ElSelect
                  v-model="step1Form.game_type_id"
                  style="width: 300px"
                  :placeholder="$t('table.to-select')"
                  popper-class="user-select"
                  clearable
                  filterable
                  :disabled="!!step1Form.game_id"
                  @change="step1ChangeGameId(step1Form.game_type_id)"
                >
                  <ElOption
                    v-for="game in gameList"
                    :key="game.id"
                    :label="game.game_name"
                    :value="game.id"
                  >
                    <div class="select-options">
                      <div>{{ game.game_name }}</div>
                    </div>
                  </ElOption>
                </ElSelect>
              </el-form-item>
              <el-form-item :label="$t('table.game_event')" prop="event_id">
                <ElSelect
                  v-model="step1Form.event_id"
                  style="width: 300px"
                  :placeholder="$t('table.to-select')"
                  popper-class="user-select"
                  :disabled="!!step1Form.game_id"
                  clearable
                  filterable
                >
                  <ElOption
                    v-for="event in eventList"
                    :key="event.id"
                    :label="event.event_name"
                    :value="event.id"
                  >
                    <div class="select-options">
                      <div>{{ event.event_name }}</div>
                    </div>
                  </ElOption>
                </ElSelect>
              </el-form-item>
              <el-form-item :label="$t('table.show_time')" prop="show_time">
                <el-date-picker
                  v-model="step1Form.show_time"
                  type="datetime"
                  style="width: 300px"
                  :placeholder="$t('table.show_time')"
                  value-format="X"
                />
              </el-form-item>
              <el-form-item
                :label="$t('table.game_start_time')"
                prop="game_start_time"
              >
                <el-date-picker
                  v-model="step1Form.game_start_time"
                  type="datetime"
                  style="width: 300px"
                  :placeholder="$t('table.game_start_time')"
                  value-format="X"
                />
              </el-form-item>
              <el-form-item :label="$t('table.is_champion')" prop="is_champion">
                <ElSelect
                  v-model="step1Form.is_champion"
                  style="width: 300px"
                  :placeholder="$t('table.to-select')"
                  popper-class="user-select"
                  :disabled="!!step1Form.game_id"
                  @change="changeIsChampion"
                >
                  <ElOption
                    v-for="data in isNot"
                    :key="data.value"
                    :label="data.label"
                    :value="data.value"
                  />
                </ElSelect>
              </el-form-item>
              <el-form-item
                v-if="+step1Form.is_champion"
                :label="$t('table.game_show_end_time')"
                prop="game_show_end_time"
              >
                <el-date-picker
                  v-model="step1Form.game_show_end_time"
                  type="datetime"
                  style="width: 300px"
                  :placeholder="$t('table.game_show_end_time')"
                  value-format="X"
                />
              </el-form-item>
              <el-form-item
                v-if="+step1Form.is_champion"
                :label="$t('table.bonus_pool')"
                prop="bonus_pool"
              >
                <el-input
                  v-model="step1Form.bonus_pool"
                  type="number"
                  style="width: 300px"
                  :placeholder="$t('table.bonus_pool')"
                  clearable
                />
              </el-form-item>
              <el-form-item
                v-if="+step1Form.is_champion"
                :label="$t('table.champion_team_arr')"
                prop="champion_team_arr"
              >
                <ElSelect
                  v-model="step1Form.champion_team_arr"
                  style="width: 300px"
                  :placeholder="$t('table.to-select')"
                  popper-class="user-select"
                  multiple
                  clearable
                  filterable
                >
                  <ElOption
                    v-for="data in teamList"
                    :key="data.id"
                    :disabled="oldChampionTeamArr.includes(data.id)"
                    :label="data.team_name"
                    :value="data.id"
                  >
                    <div class="select-options">
                      <div>{{ data.team_name }}</div>
                    </div>
                  </ElOption>
                </ElSelect>
              </el-form-item>
              <div v-if="!+step1Form.is_champion" class="inline-form-self">
                <div class="title-label">
                  {{ $t("table.team_vs") }}
                </div>
                <el-form-item :label="$t('table.team_id_1')" prop="team_id_1">
                  <ElSelect
                    v-model="step1Form.team_id_1"
                    style="width: 300px"
                    :placeholder="$t('table.to-select')"
                    popper-class="user-select"
                    :disabled="!!step1Form.game_id"
                    clearable
                    filterable
                    @change="setTeam1Img"
                  >
                    <template #prefix>
                      <img
                        v-show="step1Form.team_id_1"
                        :src="team1Img"
                        aly=""
                        style="height: 24px;width: 24px;"
                      >
                    </template>
                    <ElOption
                      v-for="data in teamList"
                      :key="data.id"
                      :label="data.team_name"
                      :disabled="data.id === step1Form.team_id_2"
                      :value="data.id"
                    >
                      <div class="select-options">
                        <div>{{ data.team_name }}</div>
                      </div>
                    </ElOption>
                  </ElSelect>
                </el-form-item>
                <div class="title-label-VS">
                  VS
                </div>
                <el-form-item :label="$t('table.team_id_2')" prop="team_id_2">
                  <ElSelect
                    v-model="step1Form.team_id_2"
                    style="width: 300px"
                    :placeholder="$t('table.to-select')"
                    popper-class="user-select"
                    :disabled="!!step1Form.game_id"
                    clearable
                    filterable
                    @change="setTeam2Img"
                  >
                    <template #prefix>
                      <img
                        v-show="step1Form.team_id_2"
                        :src="team2Img"
                        aly=""
                        style="height: 24px;width: 24px;"
                      >
                    </template>
                    <ElOption
                      v-for="data in teamList"
                      :key="data.id"
                      :label="data.team_name"
                      :disabled="data.id === step1Form.team_id_1"
                      :value="data.id"
                    >
                      <div class="select-options">
                        <div>{{ data.team_name }}</div>
                      </div>
                    </ElOption>
                  </ElSelect>
                </el-form-item>
              </div>
              <el-form-item
                v-if="!+step1Form.is_champion"
                :label="$t('table.bo')"
                prop="bo"
              >
                <el-input-number
                  v-model="step1Form.bo"
                  type="number"
                  clearable
                  :disabled="!!step1Form.game_id"
                  :min="1"
                  :max="100"
                  :step="1"
                  :placeholder="$t('table.bo')"
                  style="width: 300px"
                  step-strictly
                />
              </el-form-item>
            </el-form>
          </template>
          <template v-if="stepStatus === 1">
            <template v-if="+step1Form.is_champion">
              <el-form
                ref="step2FormRef"
                :model="championForm"
                label-width="120px"
                class="handicap-form"
                size="large"
                inline-message
              >
                <el-table
                  :data="championForm.odds"
                  border
                  style="width: 100%; height: 100%"
                  :summary-method="getSummaries"
                  show-summary
                >
                  <el-table-column
                    :label="$t('table.play_name')"
                    prop="play_type_ext"
                    align="center"
                  >
                    <template #default>
                      {{ championForm.play_name || "冠军盘" }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('table.play_Id')"
                    prop="play_type_id"
                    align="center"
                  >
                    <template #default>
                      {{ championForm.play_type_id || "" }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('table.team')"
                    prop="desc"
                    align="center"
                  />
                  <el-table-column
                    :label="$t('table.odd')"
                    prop="point"
                    align="center"
                  >
                    <template #default="props">
                      <el-form-item
                        :prop="`odds.${props.$index}.point`"
                        :rules="[
                          {
                            required: true,
                            message: `${$t('table.odd')}${$t(
                              'table.not_empty',
                            )}`,
                            trigger: 'blur',
                          },
                          {
                            validator: championOddWarning,
                            trigger: 'blur',
                          },
                        ]"
                      >
                        <el-input-number
                          v-model.number="props.row.point"
                          :step="0.001"
                          :min="1.001"
                          :max="9999.99"
                          :precision="3"
                          :placeholder="$t('table.odd')"
                          :disabled="props.row.id !== ''"
                          step-strictly
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('table.pump_water')"
                    prop="warning_game"
                    align="center"
                  >
                    <template #default="props">
                      <span v-if="+props.row.point" style="color: #ac1919">
                        {{ Number((100 / +props.row.point).toFixed(3)) }}
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </template>
            <template v-else>
              <el-form
                ref="step2FormRef"
                :model="unChampionForm"
                label-width="120px"
                class="handicap-form"
                size="large"
                inline-message
              >
                <el-form-item
                  :label="$t('table.event_leve_name')"
                  prop="level_id"
                  class="event_leve_name"
                  :rules="[
                    {
                      required: true,
                      message: `${$t('table.event_leve_name')}${$t(
                        'table.not_empty',
                      )}`,
                      trigger: 'change',
                    },
                  ]"
                >
                  <!--                  :disabled="!!step1Form.id && unChampionForm.level_id" -->
                  <ElSelect
                    v-model="unChampionForm.level_id"
                    style="width: 300px"
                    :placeholder="$t('table.to-select')"
                    popper-class="user-select"
                    filterable
                    @change="
                      currentMatchLevelChange(
                        step1Form.game_type_id,
                        getGameName(step1Form.team_id_1),
                        getGameName(step1Form.team_id_2),
                      )
                    "
                  >
                    <ElOption
                      v-for="matchLevel in matchLevelList"
                      :key="matchLevel.id"
                      :disabled="+matchLevel.status !== 1"
                      :label="matchLevel.level"
                      :value="matchLevel.id"
                    />
                  </ElSelect>
                </el-form-item>
                <div class="inline-form-self">
                  <el-tabs
                    v-model="currentRound"
                    type="border-card"
                    size="large"
                  >
                    <el-tab-pane
                      :label="$t('other.total_' /**总局 */)"
                      :name="1"
                    >
                      <el-button
                        type="danger"
                        size="small"
                        style="margin-bottom: 8px"
                        @click="
                          addAllPlays(
                            1,
                            step1Form.game_type_id,
                            getGameName(step1Form.team_id_1),
                            getGameName(step1Form.team_id_2),
                          )
                        "
                      >
                        {{ $t("table.all_types_game") }}
                      </el-button>
                      <el-button
                        type="warning"
                        size="small"
                        style="margin-bottom: 8px; margin-left: 12px"
                        @click="clearAllPlays(1)"
                      >
                        {{ $t("table.clear_all_types_game") }}
                      </el-button>
                      <el-checkbox-group v-model="round1Checked">
                        <template
                          v-for="extType in [2, 6, 1, 4, 8, 12, 13]"
                          :key="extType"
                        >
                          <div
                            v-if="
                              getPlaysItemsGroup(extType, round1PlaysItems)
                                .length > 0
                            "
                          >
                            <div class="group-title">
                              {{ typeLabels[Number(extType)] }}
                            </div>
                            <div>
                              <el-checkbox
                                v-for="item in getPlaysItemsGroup(
                                  extType,
                                  round1PlaysItems,
                                )"
                                :key="item.id"
                                :label="item.id"
                                :disabled="oldCheckedPlayIds.includes(+item.id)"
                                @change="
                                  changePlayHandle(
                                    1,
                                    item.id,
                                    item,
                                    step1Form.game_type_id,
                                    getGameName(step1Form.team_id_1),
                                    getGameName(step1Form.team_id_2),
                                  )
                                "
                              >
                                {{ item.play_name }}
                                <el-button
                                  v-if="
                                    [1, 3, 4, 5, 12, 13].includes(
                                      Number(extType),
                                    )
                                  "
                                  type="warning"
                                  size="small"
                                  :icon="Plus"
                                  circle
                                  :disabled="!round1Checked.includes(item.id)"
                                  @click="
                                    changePlayHandle(
                                      1,
                                      item.id,
                                      item,
                                      step1Form.game_type_id,
                                      getGameName(step1Form.team_id_1),
                                      getGameName(step1Form.team_id_2),
                                      true,
                                    )
                                  "
                                />
                              </el-checkbox>
                            </div>
                          </div>
                        </template>
                      </el-checkbox-group>
                    </el-tab-pane>
                    <el-tab-pane
                      :label="$t('other.branch_' /**分局 */)"
                      :name="2"
                    >
                      <el-button
                        type="danger"
                        size="small"
                        style="margin-bottom: 8px"
                        @click="
                          addAllPlays(
                            2,
                            step1Form.game_type_id,
                            getGameName(step1Form.team_id_1),
                            getGameName(step1Form.team_id_2),
                          )
                        "
                      >
                        {{ $t("table.all_types_game") }}
                      </el-button>
                      <el-button
                        type="warning"
                        size="small"
                        style="margin-bottom: 8px; margin-left: 12px"
                        @click="clearAllPlays(2)"
                      >
                        {{ $t("table.clear_all_types_game") }}
                      </el-button>
                      <el-checkbox-group v-model="round2Checked">
                        <template
                          v-for="extType in [0, 3, 5, 9, 10, 11]"
                          :key="extType"
                        >
                          <div
                            v-if="
                              getPlaysItemsGroup(extType, round2PlaysItems)
                                .length > 0
                            "
                          >
                            <div class="group-title">
                              {{ typeLabels[Number(extType)] }}
                            </div>
                            <div>
                              <el-checkbox
                                v-for="item in getPlaysItemsGroup(
                                  extType,
                                  round2PlaysItems,
                                )"
                                :key="item.id"
                                :label="item.id"
                                :disabled="oldCheckedPlayIds.includes(+item.id)"
                                @change="
                                  changePlayHandle(
                                    2,
                                    item.id,
                                    item,
                                    step1Form.game_type_id,
                                    getGameName(step1Form.team_id_1),
                                    getGameName(step1Form.team_id_2),
                                  )
                                "
                              >
                                {{ item.play_name }}
                                <el-button
                                  v-if="
                                    [1, 3, 4, 5, 10, 11].includes(
                                      Number(extType),
                                    )
                                  "
                                  type="warning"
                                  size="small"
                                  :icon="Plus"
                                  circle
                                  :disabled="!round2Checked.includes(item.id)"
                                  @click="
                                    changePlayHandle(
                                      2,
                                      item.id,
                                      item,
                                      step1Form.game_type_id,
                                      getGameName(step1Form.team_id_1),
                                      getGameName(step1Form.team_id_2),
                                      true,
                                    )
                                  "
                                />
                              </el-checkbox>
                            </div>
                          </div>
                        </template>
                      </el-checkbox-group>
                    </el-tab-pane>
                  </el-tabs>
                </div>
                <div class="table-body">
                  <el-table
                    :key="unChampionForm.item.length"
                    :data="unChampionForm.item"
                    border
                    :span-method="objectSpanMethod"
                    style="width: 100%; height: 100%"
                  >
                    <el-table-column
                      :label="$t('table.bo_number')"
                      prop="play_type_id"
                      align="center"
                      width="120px"
                      class-name="round-card"
                    >
                      <template #default="props">
                        <div
                          :class="
                            props.row.round === 2 ? 'has-red' : 'has-green'
                          "
                        >
                          {{
                            props.row.round === 1
                              ? $t("table.overall")
                              : $t("table.single game")
                          }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="$t('table.play_Id')"
                      prop="play_type_id"
                      align="center"
                      width="100px"
                    />
                    <el-table-column
                      :label="$t('table.play_name')"
                      prop="play_name"
                      align="center"
                      width="140px"
                    />
                    <el-table-column
                      :label="$t('table.expand_info')"
                      prop="play_type_ext"
                      align="center"
                      width="180px"
                    >
                      <template #default="props">
                        <template v-if="[10, 12].includes(+props.row.ext_type)">
                          <el-form-item
                            :prop="`item.${props.$index}.play_type_ext.team_id`"
                            :rules="[
                              {
                                required: true,
                                message: `${$t('table.team_name')}${$t(
                                  'table.not_empty',
                                )}`,
                                trigger: 'blur',
                              },
                            ]"
                          >
                            <ElSelect
                              v-model="props.row.play_type_ext.team_id"
                              style="width: 300px"
                              :placeholder="$t('table.to-select')"
                              popper-class="user-select"
                              :disabled="!!props.row.id"
                              @change="
                                playTypeExtTeam(
                                  props.row.play_type_ext,
                                  props.$index,
                                  props.row.play_type_id,
                                  props.row.ext_type,
                                )
                              "
                            >
                              <ElOption
                                :label="getGameName(step1Form.team_id_1)"
                                :value="1"
                              />
                              <ElOption
                                :label="getGameName(step1Form.team_id_2)"
                                :value="2"
                              />
                            </ElSelect>
                          </el-form-item>
                        </template>
                        <template
                          v-if="
                            (props.row.play_type_ext
                              && props.row.play_type_ext instanceof Object
                              && Object.keys(props.row.play_type_ext).includes(
                                'team_id',
                              )
                              && ![10, 12].includes(+props.row.ext_type))
                              || [1, 3, 11, 13].includes(+props.row.ext_type)
                          "
                        >
                          <el-form-item
                            :prop="`item.${props.$index}.play_type_ext.team_id`"
                            :rules="[
                              {
                                required: true,
                                message: `${$t('table.team_name')}${$t(
                                  'table.not_empty',
                                )}`,
                                trigger: 'blur',
                              },
                            ]"
                          >
                            <ElSelect
                              v-model="props.row.play_type_ext.team_id"
                              style="width: 300px"
                              :placeholder="$t('table.to-select')"
                              popper-class="user-select"
                              :disabled="!!props.row.id"
                              @change="
                                playTypeExtTeam(
                                  props.row.play_type_ext,
                                  props.$index,
                                  props.row.play_type_id,
                                  props.row.ext_type,
                                )
                              "
                            >
                              <ElOption
                                :label="getGameName(step1Form.team_id_1)"
                                :value="1"
                              />
                              <ElOption
                                :label="getGameName(step1Form.team_id_2)"
                                :value="2"
                              />
                            </ElSelect>
                          </el-form-item>
                          <el-form-item
                            v-if="props.row.play_type_ext.number !== 'opc'"
                            :prop="`item.${props.$index}.play_type_ext.number`"
                            :rules="[
                              {
                                required: true,
                                message: `${$t('table.not_empty')}${$t(
                                  'table.not_empty',
                                )}`,
                                trigger: 'blur',
                              },
                            ]"
                          >
                            <el-input-number
                              v-model="props.row.play_type_ext.number"
                              :step="0.5"
                              :min="0.5"
                              :max="100"
                              :disabled="!!props.row.id"
                              step-strictly
                              @blur="
                                playTypeExtTeam(
                                  props.row.play_type_ext,
                                  props.$index,
                                  props.row.play_type_id,
                                  props.row.ext_type,
                                )
                              "
                            />
                          </el-form-item>
                        </template>
                        <template
                          v-if="
                            typeof props.row.play_type_ext === 'number'
                              || [4, 5].includes(+props.row.ext_type)
                          "
                        >
                          <el-form-item
                            :prop="`item.${props.$index}.play_type_ext`"
                            :rules="[
                              {
                                required: true,
                                message: `${$t('table.not_empty')}${$t(
                                  'table.not_empty',
                                )}`,
                                trigger: 'blur',
                              },
                            ]"
                          >
                            <el-input-number
                              v-model="props.row.play_type_ext"
                              :step="0.5"
                              :min="0.5"
                              :max="500"
                              :disabled="!!props.row.id"
                              step-strictly
                              @blur="
                                playTypeExtOffset(
                                  props.row.play_type_ext,
                                  props.$index,
                                  props.row.play_type_id,
                                )
                              "
                            />
                          </el-form-item>
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="$t('table.stop_game')"
                      prop="stop_game"
                      align="center"
                      min-width="125px"
                    >
                      <template #default="props">
                        <el-form-item
                          :prop="
                            props.row.id ? '' : `item.${props.$index}.stop_game`
                          "
                          :rules="[
                            {
                              validator: stopGameStopValid,
                              trigger: 'blur',
                            },
                          ]"
                        >
                          <el-input
                            v-model="props.row.stop_game"
                            :disabled="!!props.row.id"
                            :placeholder="$t('table.stop_game')"
                            type="number"
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="$t('table.warning_game')"
                      prop="warning_game"
                      align="center"
                      min-width="125px"
                    >
                      <template #default="props">
                        <el-form-item
                          :prop="
                            props.row.id
                              ? ''
                              : `item.${props.$index}.warning_game`
                          "
                          :rules="[
                            {
                              validator: warningGameValid,
                              trigger: 'blur',
                            },
                          ]"
                        >
                          <el-input
                            v-model="props.row.warning_game"
                            :disabled="!!props.row.id"
                            :placeholder="$t('table.warning_game')"
                            type="number"
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="$t('table.odd')"
                      prop="odd"
                      min-width="300px"
                      align="center"
                    >
                      <template #default="props">
                        <div class="odd-list">
                          <el-form-item
                            v-for="(odd, index) in props.row.odds"
                            :key="odd.ext"
                            :label="
                              odd.team_name
                                || odd.desc
                                || getGameName(step1Form[`team_id_${index + 1}`])
                            "
                            :prop="
                              oldCheckedPlayIds.includes(
                                +props.row.play_type_id,
                              )
                                ? ''
                                : `item.${props.$index}.odds.${index}.point`
                            "
                            :rules="[
                              {
                                required: true,
                                message: `${$t('table.odd')}${$t(
                                  'table.not_empty',
                                )}`,
                                trigger: 'blur',
                              },
                            ]"
                          >
                            <el-input-number
                              v-model="odd.point"
                              :step="0.001"
                              :min="1.001"
                              :precision="3"
                              :controls="false"
                              :max="props.row.odds.length === 2 ? 24 : 500"
                              :disabled="!!props.row.id"
                              :placeholder="$t('table.odd')"
                              step-strictly
                              @change="
                                oddChange(index, props.row.odds, props.row)
                              "
                            />
                          </el-form-item>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="$t('table.single_limit')"
                      prop="single_limit"
                      align="center"
                      min-width="125px"
                    >
                      <template #default="props">
                        <el-form-item
                          :prop="
                            oldCheckedPlayIds.includes(+props.row.play_type_id)
                              ? ''
                              : `item.${props.$index}.single_limit`
                          "
                          :rules="[
                            {
                              validator: singleLimitValid,
                              trigger: 'blur',
                            },
                          ]"
                        >
                          <el-input
                            v-model="props.row.single_limit"
                            :placeholder="$t('table.single_limit')"
                            type="number"
                            :disabled="!!props.row.id"
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="$t('table.single_payout')"
                      prop="single_payout"
                      align="center"
                      min-width="125px"
                    >
                      <template #default="props">
                        <el-form-item
                          :prop="
                            oldCheckedPlayIds.includes(+props.row.play_type_id)
                              ? ''
                              : `item.${props.$index}.single_payout`
                          "
                          :rules="[
                            {
                              validator: singlePayoutValid,
                              trigger: 'blur',
                            },
                          ]"
                        >
                          <el-input
                            v-model="props.row.single_payout"
                            :placeholder="$t('table.single_payout')"
                            type="number"
                            :disabled="!!props.row.id"
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="$t('table.game_return_rate')"
                      prop="game_return_rate"
                      align="center"
                      min-width="125px"
                    >
                      <template #default="props">
                        <el-form-item
                          :prop="
                            oldCheckedPlayIds.includes(+props.row.play_type_id)
                              ? ''
                              : `item.${props.$index}.game_return_rate`
                          "
                          :rules="[
                            {
                              required: true,
                              message: `${$t('table.game_return_rate')}${$t(
                                'table.not_empty',
                              )}`,
                              trigger: 'blur',
                            },
                            {
                              validator: gameReturnRateValid,
                              trigger: 'blur',
                            },
                          ]"
                        >
                          <el-input
                            v-model="props.row.game_return_rate"
                            :placeholder="$t('table.game_return_rate')"
                            type="number"
                            :disabled="!!props.row.id"
                            @change="
                              gameReturnRateChange(props.row.odds, props.row)
                            "
                            @focus="cacheReturnRate(props.row)"
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="80px">
                      <template #default="props">
                        <el-button
                          type="danger"
                          :icon="Delete"
                          size="small"
                          circle
                          :disabled="!!props.row.id"
                          @click="
                            deletePlay(
                              props.row.round,
                              props.row.play_type_id,
                              props.$index,
                            )
                          "
                        />
                        <!-- <el-button
                            :type="!!props.row.is_recommend ? 'info' : 'primary'"
                            round
                            size="small"
                            :disabled="!!props.row.is_recommend"
                            @click="
                              setRecommend(
                                props.row.play_type_id,
                                props.row.round,
                                props.$index,
                              )
                            "
                          >
                            {{ +props.row.is_recommend ? '已设展' : '设展' }}
                          </el-button> -->
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-form>
            </template>
          </template>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              :disabled="waiting1 || waiting2"
              @click="resetCrudStatus2"
            >
              {{ $t("crud.cancel") }}
            </el-button>
            <el-button
              v-if="stepStatus === 0"
              type="primary"
              :loading="waiting1"
              @click="nextStepHandle"
            >
              {{ $t("crud.next-step") }}
            </el-button>
            <el-button
              v-if="stepStatus === 1"
              type="primary"
              :loading="waiting2"
              @click="prevStepHandle"
            >
              {{ $t("crud.prev-step") }}
            </el-button>
            <el-button
              v-if="stepStatus === 1"
              type="primary"
              :loading="waiting2"
              @click="submitHandle"
            >
              {{ $t("crud.submit") }}
            </el-button>
          </span>
        </template>
      </el-dialog>
    </template>
  </PageMain>
</template>

<style lang="scss" scoped>
.handicap-list {
  width: auto;
}

.body-step {
  width: 96%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-content: center;

  .body {
    width: 80%;
  }

  &:deep(.el-step.is-horizontal .el-step__line) {
    top: 12px;
  }

  &:deep(.el-step__icon) {
    height: 24px;
    width: 24px;
  }

  &:deep(.el-step__head) {
    .el-step__icon-inner {
      font-size: 20px;
    }
  }

  &:deep(.el-step__head.is-process) {
    .el-step__icon {
      background: #2dc26b;
    }

    .el-step__icon-inner {
      color: #fff;
    }
  }

  &:deep(.el-step__title.is-process) {
    color: #2dc26b;
  }
}

.dialog-body {
  width: 100%;
  padding: 0;
  margin: auto;
  height: 100%;
  overflow: hidden;

  &:deep(.el-tabs__content) {
    max-height: 200px;
    overflow-y: auto;
  }

  .step1-form {
    max-width: 900px;
    margin: auto;
  }
}
</style>
