<!-- suppress JSUnresolvedVariable -->
<route lang="yaml">
name: championHandicapSettle
meta:
  title: fix/live结算
  constant: false
  layout: true
</route>

<script lang="ts" setup>
import { ArrowDown, RefreshRight, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import GlobalScoreSetting from './components/GlobalScoreSetting.vue'
import { otherPermission } from './hooks/permission'
import SettleCom from './components/SettleCom.vue'
import InvalidCom from './components/InvalidCom.vue'
import AbortConfirm from './components/AbortConfirm.vue'
import batchOperationHook from './hooks/batchOperationHook'
import GlobalSettle from './components/GlobalSettle.vue'
import MatchResultSettings from './components/MatchResultSettings.vue'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import userStore from '@/store/modules/user'
import { parseTime } from '@/utils/formatTime'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api, {
  multiSetOperatorApi,
  resettleApi,
} from '@/api/handicap-manage/normal-handicap-settle'
import { dictionary } from '@/hooks/lib'
import getRoundNameList from '@/hooks/getRoundNameList'

const route = useRoute()

const i18n = useI18n()

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: 'fix/live结算',
  crudOptShow: {
    formSize: '80%',
  },
  defaultQuery: {
    game_id: route.query.game_id,
    settle_status: null,
    play_id: null,
    play_name: null,
    lock_status: null,
    match_stage: route.query.match || 0,
  },
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'menu:config:',
}

const tagType: any[] = ['', 'success', 'info', 'warning', 'danger', '']

const { roundList } = getRoundNameList(String(route.query.game_id))

const gameStartTime = ref(0)

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
    if (roundList.value[index]) {
      temp.push({
        label: roundList.value[index],
        value: index,
      })
    }
    else {
      temp.push({
        label:
          index === 0
            ? i18n.t('other.total_')
            : `${i18n.t('other.no')} ${index} ${i18n.t('other.b')}`,
        value: index,
      })
    }
  }
  return temp
})

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  reQuery,
  crudFindRole,
} = CRUD(defaultCrudOptions)

provide(
  'match',
  computed(() => crudQuery.match_stage),
)

onMounted(() => {
  nextTick(() => {
    window.document!.title = `${route.query.vs_info}-${i18n.t(
      'router.normal-handicap-settle',
    )}`
  })
})

watch(
  () => queryLoading.value,
  (newVal) => {
    if (!newVal) {
      for (let i = 0; i < crudData.value.length; i++) {
        (crudData.value[i] as any).is_lock = !!(crudData.value[i] as any)
          .operator_id
        ;(crudData.value[i] as any).loading = false
      }
    }
  },
  { deep: true },
)

const { isLockOptions, getLabel, settleTypeOptions, finishTypeOptions }
  = dictionary()

const { getAllowList, lockStatusChange, operateDisabled, lockSwitchDisabled }
  = batchOperationHook()

function toBatchOperate(code: 'first' | 'reset' | 'invalid') {
  getAllowList(crudData.value, code)
}

const { proxy }: any = getCurrentInstance()

function openSettle(rowArr: any[]) {
  proxy.mittBus.emit('openChampionSettleBus', rowArr)
}

function openInvalid(rowArr: any[]) {
  proxy.mittBus.emit('openChampionInvalidBus', rowArr)
}

function openAbortConfirm(rowArr: any[]) {
  proxy.mittBus.emit('openChampionAbortConfirmBus', rowArr)
}

function reSettle(row: any) {
  ElMessageBox.confirm(i18n.t('crud.resettle_pl'), i18n.t('lib.resettle'), {
    confirmButtonText: i18n.t('lib.resettle'),
    cancelButtonText: i18n.t('crud.resettle_cancel'),
    type: 'warning',
  })
    .then(() => {
      resettleApi(row.id).then((res: any) => {
        if (+res.code === 1) {
          ElNotification.success(i18n.t('lib.resettle') + i18n.t('lib.success'))
          refresh()
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'warning',
        message: i18n.t('crud.resettle_cancel'),
      })
    })
}

const checkAll = ref(false)

const user = userStore()

function handleCheckAllChange() {
  let idArr: any[] = []
  if (checkAll.value) {
    idArr = crudData.value
      .filter((data: any) => {
        return data.id && !+data.operator_id && +data.status !== 0
      })
      .map((data: any) => data.id)
  }
  else {
    idArr = crudData.value
      .filter((data: any) => {
        return (
          data.id
          && +data.operator_id
          && +data.operator_id === +user.userInfo.admin_id
        )
      })
      .map((data: any) => data.id)
  }
  if (idArr.length > 0) {
    multiSetOperatorApi({
      ids: idArr.join(','),
      is_champion: 0,
      is_cancel: Number(!checkAll.value),
    })
      .then((res: any) => {
        if (+res.code === 1) {
          refresh()
        }
        else {
          checkAll.value = !checkAll.value
        }
      })
      .catch(() => {
        checkAll.value = !checkAll.value
      })
  }
  else {
    //
  }
}

const isIndeterminate = computed(() => {
  const hasNotLock = crudData.value.some((data: any) => {
    return !+data.operator_id
  })
  const hasLock = crudData.value.some((data: any) => {
    return data.operator_id
  })

  if (!hasNotLock) {
    checkAll.value = true
  }
  else {
    checkAll.value = false
  }

  return hasNotLock && hasLock
})

function dialogTitle(row: any) {
  let title = ''
  const disabled = Boolean(
    row.operator_id
      && +row.operator_id !== +user.userInfo.admin_id
      && ![3, 5].includes(+row.status),
  )
  let show = true
  if ([0, 1].includes(+row.status)) {
    title = i18n.t('lib.set_winner')
    show = crudFindRole.only(otherPermission.setWinner)
  }
  else if (+row.status === 2) {
    title = i18n.t('lib.confirm_winner')
    show = crudFindRole.only(otherPermission.confirmWinner)
  }
  else if ([3, 5].includes(+row.status)) {
    title = i18n.t('lib.see_result')
    show = crudFindRole.only(otherPermission.seeResult)
  }
  else if (+row.status === 4) {
    title = i18n.t('lib.abort_confirm')
    show = crudFindRole.only(otherPermission.abortConfirm)
  }

  return { title, disabled, show }
}

function getWinStatus(winner_point_extra_id: string, team_points: any[]) {
  return team_points.find(p => winner_point_extra_id === String(p.id))
}
</script>

<template>
  <PageMain
    :title="`${$t('router.normal-handicap-settle')} - ${
      route.query.game_name || ''
    } - ${route.query.event_name || ''} - ${
      route.query.game_id || ''
    } - ${gameStartTime ? parseTime(gameStartTime) : ''}`"
    :has-tool="true"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.is_lock')">
          <el-select
            v-model="crudQuery.lock_status"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
          >
            <el-option
              v-for="item in isLockOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.play_Id')">
          <el-input
            v-model="crudQuery.play_id"
            clearable
            :placeholder="$t('table.play_Id')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.play_name')">
          <el-input
            v-model="crudQuery.play_name"
            clearable
            :placeholder="$t('table.play_name')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.finish_status')">
          <el-select
            v-model="crudQuery.settle_status"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
          >
            <el-option
              v-for="item in finishTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
      <el-radio-group v-model="crudQuery.match_stage" @change="toQuery">
        <el-radio-button
          v-for="item in matchsList"
          :key="item.value"
          :label="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </template>
    <template #pageBody>
      <el-table
        v-loading="queryLoading"
        :data="crudData"
        stripe
        row-key="role_id"
        style="width: 100%; height: 100%"
        border
        resizable
        table-layout="fixed"
      >
        <el-table-column
          prop="is_lock"
          :label="$t('table.is_lock')"
          width="140"
          align="center"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.is_lock"
              v-only="otherPermission.lock"
              size="small"
              :loading="scope.row.loading"
              :disabled="lockSwitchDisabled(scope.row)"
              :before-change="lockStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          :label="$t('table.play_Id')"
          align="center"
        />
        <el-table-column
          prop="play_name"
          :label="$t('table.play_name')"
          align="center"
        />
        <el-table-column
          prop="team_info"
          :label="$t('table.betting')"
          align="center"
        />
        <el-table-column
          prop="bet_amount"
          :label="$t('table.bet_amount')"
          align="center"
        />
        <el-table-column
          prop="status"
          :label="$t('table.finish_status')"
          align="center"
        >
          <template #default="scope">
            <el-tag :type="tagType[+scope.row.status || 0]" effect="plain">
              {{ getLabel(scope.row.status, settleTypeOptions) }}
            </el-tag>
            <el-tag
              v-if="
                getWinStatus(
                  String(scope.row.winner_point_extra_id),
                  scope.row.team_points,
                )
              "
              type="danger"
              effect="dark"
              style="margin-left: 12px"
            >
              {{
                getWinStatus(
                  String(scope.row.winner_point_extra_id),
                  scope.row.team_points,
                ).desc
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="current_operator"
          :label="$t('table.lock_people')"
          align="center"
        />
        <el-table-column
          :label="$t('table.operate')"
          min-width="120"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <span v-some="Object.values(otherPermission)">
              <el-dropdown
                placement="bottom-end"
                :hide-on-click="false"
                trigger="click"
                :disabled="operateDisabled(scope.row)"
              >
                <el-button type="warning" link>
                  {{ $t("table.operate") }}
                </el-button>
                <template #dropdown>
                  <el-dropdown-item
                    v-if="
                      [0, 1, 2, 3, 5].includes(+scope.row.status)
                        && dialogTitle(scope.row).show
                    "
                  >
                    <el-button
                      v-some="[
                        otherPermission.setWinner,
                        otherPermission.confirmWinner,
                        otherPermission.setWinner,
                      ]"
                      type="primary"
                      size="small"
                      :disabled="dialogTitle(scope.row).disabled"
                      @click="openSettle([scope.row])"
                    >
                      {{ dialogTitle(scope.row).title }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="![3, 4, 5].includes(+scope.row.status)"
                  >
                    <el-button
                      v-only="otherPermission.abortApply"
                      type="primary"
                      size="small"
                      :disabled="+scope.row.has_aborted === 1"
                      @click="openInvalid([scope.row])"
                    >
                      {{ $t("crud.invalid") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="+scope.row.status === 4">
                    <el-button
                      v-only="otherPermission.abortConfirm"
                      type="primary"
                      size="small"
                      @click="openAbortConfirm([scope.row])"
                    >
                      {{ $t("lib.abort_confirm") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="[3].includes(+scope.row.status)">
                    <el-button
                      v-only="otherPermission.resettle"
                      type="warning"
                      size="small"
                      :disabled="lockSwitchDisabled(scope.row)"
                      @click="reSettle(scope.row)"
                    >
                      {{ $t("lib.resettle") }}
                    </el-button>
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
      <div>
        <GlobalSettle />
      </div>
      <div>
        <MatchResultSettings @refresh="refresh" />
      </div>
      <GlobalScoreSetting
        @get-start-time="(time:number) => {
          gameStartTime = time
        }"
      />
      <div>
        <el-checkbox
          v-model="checkAll"
          v-only="otherPermission.lock"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          {{ $t("other.checkAll") }}
        </el-checkbox>
        <span style="margin-right: 20px" />
        <el-dropdown popper-class="batch-operation" @command="toBatchOperate">
          <el-button type="primary">
            {{ $t("crud.batch_operation" /**批量操作 */) }}
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="first">
                {{ $t("lib.set_winner" /**第一次设置赛果 */) }}
              </el-dropdown-item>
              <el-dropdown-item command="reset">
                {{ $t("lib.abort_confirm" /**作废审核 */) }}
              </el-dropdown-item>
              <el-dropdown-item command="invalid">
                {{ $t("crud.invalid" /**作废 */) }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
    <template #other>
      <SettleCom @refresh="refresh" />
      <InvalidCom @refresh="refresh" />
      <AbortConfirm @refresh="refresh" />
    </template>
  </PageMain>
</template>

<style lang="scss" scoped></style>
