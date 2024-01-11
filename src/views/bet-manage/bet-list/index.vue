<route lang="yaml">
name: betList
meta:
  title: 注单列表
  constant: false
  layout: true
</route>

<script lang="ts" setup name="betList">
import {
  ArrowDown,
  Download,
  RefreshRight,
  Search,
  Sort,
} from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import type { TableColumnCtx } from 'element-plus'
import dayjs from 'dayjs'
import { otherPermission, toolPermission } from './hooks/permission'
import VoidBetOperate from './components/VoidBetOperate.vue'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/bet-manage/bet-list'
import { getGamePlayTypeApi } from '@/api/handicap-manage/handicap-list'
import { dictionary } from '@/hooks/lib'
import { dynamicParam } from '@/hooks/dynamicParamHook'
import { getBetListStatus, getLabel, toFixedNumber } from '@/utils'
import { parseTime } from '@/utils/formatTime'
import getGameListHook from '@/hooks/getGameListHook'
import visibleColumn from '@/hooks/visibleColumn'
import getCompanyList from '@/hooks/getCompanyList'
import getAdminListHook from '@/hooks/getAdminListHook'

const i18n = useI18n()

const { proxy }: any = getCurrentInstance()
const { companyList } = getCompanyList()
const { adminList } = getAdminListHook()

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()

const route = useRoute()

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.t('router.bet-list'),
  crudOptShow: {
    add: true,
    formSize: '800px',
  },
  defaultQuery: {
    game_type_id: null,
    start_time: dayjs().subtract(2, 'day').startOf('day').unix(),
    end_time: dayjs().endOf('day').unix(),
    currency_id: null,
    is_cancel: +(route.query?.is_cancel || 0),
    prize_status: null,
    company_id: null,
    update_start_time: null,
    update_end_time: null,
    is_getprize: null,
    receive_status: null,
    is_parlay: null,
    device: null,
    trade_user: null,
    project: route.query?.project || null,
    risk_id: null,
    proxy_id: null,
    play_type_id: null,
    ip_address: null,
    term: null,
    odds: null,
    is_sum: 0,
    username: null,
    play_id: route.query?.play_id || null,
    point_id: route.query?.point_id || null,
    is_reverse: null,
    is_has_trade_user: null,
  },
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'bet:list',
}

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  crudSetQueryKey,
  reQuery,
  crudHook,
  crudFindRole,
} = CRUD(defaultCrudOptions)

const tableKey = ref(0)

crudHook.afterRefresh = () => {
  tableKey.value++
  tableRef.value && tableRef.value.doLayout()
  return true
}

const crudResData = ref<any>({})
const statisticsDtail = computed(() => {
  if (
    crudResData.value.statistics
    && crudResData.value.statistics.currency
    && crudResData.value.statistics.total
  ) {
    return [
      ...crudResData.value.statistics.currency,
      crudResData.value.statistics.total,
    ]
  }
  else {
    return []
  }
})

watch(
  () => crudData.value,
  () => {
    crudData.value.forEach((data: any) => {
      if (data.parlay_info && data.parlay_info.length > 0) {
        data.parlay_info.forEach((data2: any) => {
          data2.username = data.username
        })
      }
    })
  },
  { deep: true },
)

function getQueryDatas(query: any) {
  const from: any = {}
  if (Object.keys(query).length !== 0) {
    Object.keys(query).forEach((item) => {
      if (
        query[item] !== null
        && query[item] !== ''
        && query[item] !== undefined
      ) {
        from[item] = query[item]
      }
    })
  }
  return from
}

interface SummaryMethodProps<T = any> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

function getSummaries(param: SummaryMethodProps) {
  const { columns, data } = param
  const sums: any[] = []
  columns.forEach((column, index) => {
    if (index === 1 || column.property === 'profit_loss') {
      const pageTotalT = toFixedNumber(
        data.reduce((prev, curr) => {
          const amount = Number(curr.amount) || 0
          const bonus = Number(curr.bonus) || 0
          const show_scale = Number(curr.show_scale) || 1
          const exchange = Number(curr.exchange_rate) || 1
          return prev + (bonus - amount) * exchange * show_scale
        }, 0),
      )
      sums[index] = `${
        index === 1 ? i18n.t('other.this_page') : ''
      }${pageTotalT}`
    }
    if (['amount_cny', 'bonus_cny'].includes(column.property)) {
      const values = data.map((item) => {
        return {
          exchange_rate: Number(item.exchange_rate) || 1,
          value: Number(item[column.property.replace('_cny', '')]),
          show_scale: Number(item.show_scale) || 1,
        }
      })
      const pageTotal = toFixedNumber(
        values.reduce((prev, curr) => {
          const value = Number(curr.value)
          if (!Number.isNaN(value)) {
            return prev + value * curr.exchange_rate * curr.show_scale
          }
          else {
            return prev
          }
        }, 0),
      )
      sums[index] = pageTotal
    }
  })
  return sums
}

const {
  isNot,
  winLossOption,
  acceptStatusOption,
  handicapType,
  equalOption,
  bettingOddsOption,
} = dictionary()
const { getMoneyType, getRiskLabel, getProxy } = dynamicParam()
const betTypes: any = ref([
  { label: i18n.t('table.normal_bet_type'), value: 0 },
  { label: i18n.t('table.parlay_bet_type'), value: 1 },
])

const { gameList } = getGameListHook(false, false)

const selectionArr = ref<any[]>([])
const moneyOption: any = ref([])
const terminalOption: any = ref([
  { label: 'pc', value: 1 },
  { label: 'wap', value: 2 },
  { label: 'app', value: 3 },
])
const riskLabelOption: any = ref([])
const proxyOption: any = ref([])
const playOption: any = ref([])

function handleSelectionChange(selection: any[]) {
  selectionArr.value = selection
}

function toReview(rowArr: any[]) {
  let queryData: any = null
  if (rowArr.length === 0) {
    queryData = getQueryDatas(
      Object.assign({}, crudQuery, { page: null, limit: null, count: null }),
    )
  }
  proxy.mittBus.emit('voidBetOperateBus', { rowArr, queryData })
}

function toBatchOperate() {
  toReview(selectionArr.value)
}
const getPlayById = () => {
  getGamePlayTypeApi({ game_type_id: crudQuery.game_type_id, round: 0 }).then(
    (res: any) => {
      if (res && res.code === 1) {
        playOption.value = res.data
      }
      else {
        playOption.value = []
      }
    },
  )
}

const router = useRouter()

function toPbl() {
  const routePage = router.resolve({
    name: 'ProgressBetList',
  })
  window.open(routePage.href, '_blank')
}

function cellStyle({ row }: any) {
  if (row.parlay_id) {
    return {
      backgroundColor: '#4C4D4F',
    }
  }
  else {
    return {}
  }
}

const dialogVisible = ref(false)

function showTotal() {
  Api.getSumApi(crudQuery).then((res: any) => {
    if (res.code === 1) {
      crudResData.value = res.data
      dialogVisible.value = true
    }
  })
  refresh()
}

function totalClose() {
  crudResData.value = {}
  dialogVisible.value = false
}

function loadTree(row: any, treeNode: unknown, resolve: (date: any[]) => void) {
  Api.getParlayList({ id: row.id })
    .then((res: any) => {
      if (+res.code === 1) {
        resolve(
          res.data.map((data: any) => {
            return Object.assign({}, data, { parlay_id: data.id })
          }),
        )
      }
      else {
        resolve([])
      }
    })
    .catch(() => {
      resolve([])
    })
}

onMounted(() => {
  getMoneyType().then((res: any) => {
    moneyOption.value = res
  })
  getRiskLabel().then((res: any) => {
    riskLabelOption.value = res
  })
  getProxy().then((res: any) => {
    proxyOption.value = res
  })
})
</script>

<template>
  <PageMain :title="$t('router.bet-list')" :has-tool="false" :has-footer="true">
    <template #other>
      <VoidBetOperate @refresh="refresh" />
      <el-dialog
        v-model="dialogVisible"
        :before-close="totalClose"
        width="1200px"
      >
        <el-table
          v-if="statisticsDtail?.length > 0"
          :data="statisticsDtail"
          stripe
          style="width: 1200px"
          height="100%"
          border
          resizable
        >
          <el-table-column
            prop="currency_id"
            :label="$t('table.currency_name' /**币种 */)"
            min-width="180"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.currency_id">{{
                getLabel(scope.row.currency_id, moneyOption, "id", "name")
              }}</span>
              <span v-else>{{ $t("other.total") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="profit"
            :label="$t('table.total_funds' /**总资金变动 */)"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="amount"
            :label="$t('table.total_bet_amount' /**总投注金额 */)"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="bonus"
            :label="$t('table.total_bounds' /**总奖金 */)"
            min-width="180"
            align="center"
          />
        </el-table>
      </el-dialog>
    </template>
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('other.game' /**游戏 */)">
          <el-select
            v-model="crudQuery.game_type_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
            @change="getPlayById"
          >
            <el-option
              v-for="audit in gameList"
              :key="audit.id"
              :label="audit.game_name"
              :value="audit.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.play_name' /**玩法名称 */)">
          <el-select
            v-model="crudQuery.play_type_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="play in playOption"
              :key="play.id"
              :label="play.play_name"
              :value="play.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.game_id' /**盘口ID */)">
          <el-input
            v-model="crudQuery.game_id"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.play_Id' /**玩法ID */)">
          <el-input
            v-model="crudQuery.play_id"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="`${$t('table.betting' /**投注项ID */)} ID`">
          <el-input
            v-model="crudQuery.point_id"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.bet_type' /**注单类型 */)">
          <el-select
            v-model="crudQuery.is_parlay"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="bet in betTypes"
              :key="bet.value"
              :label="bet.label"
              :value="bet.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.agent_name' /**所属代理 */)">
          <el-select
            v-model="crudQuery.proxy_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="pro in proxyOption"
              :key="pro.id"
              :label="pro.proxy_name"
              :value="pro.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_has_trade_user' /**是否有操盘手认领 */)">
          <el-select
            v-model="crudQuery.is_has_trade_user"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="bet in isNot"
              :key="bet.value"
              :label="bet.label"
              :value="bet.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.trader' /**操盘手 */)">
          <el-select
            v-model="crudQuery.trade_user"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="bet in adminList"
              :key="bet.admin_id"
              :label="bet.username"
              :value="bet.admin_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.money_type' /**货币类型 */)">
          <el-select
            v-model="crudQuery.currency_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="bet in moneyOption"
              :key="bet.id"
              :label="bet.name"
              :value="bet.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.terminal_type' /**投注设备 */)">
          <el-select
            v-model="crudQuery.device"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="bet in terminalOption"
              :key="bet.value"
              :label="bet.label"
              :value="bet.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_finish' /**是否结算 */)">
          <el-select
            v-model="crudQuery.is_getprize"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="bet in isNot"
              :key="bet.value"
              :label="bet.label"
              :value="bet.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.win_loss' /**输赢 */)">
          <el-select
            v-model="crudQuery.prize_status"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="bet in winLossOption"
              :key="bet.value"
              :label="bet.label"
              :value="bet.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_cancel' /**是否取消 */)">
          <el-select
            v-model="crudQuery.is_cancel"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="bet in isNot"
              :key="bet.value"
              :label="bet.label"
              :value="bet.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.bet_accept_status' /**注单接收状态 */)">
          <el-select
            v-model="crudQuery.receive_status"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in acceptStatusOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.betting_type' /**盘口类型 */)">
          <el-select
            v-model="crudQuery.category_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in handicapType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.order_number' /**订单号 */)">
          <el-input
            v-model="crudQuery.project"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.bet_betting_time' /**投注时间 */)">
          <dateTimePickerQuery
            start-key="start_time"
            end-key="end_time"
            :prop-time="[crudQuery.start_time, crudQuery.end_time]"
            @set-time="crudSetQueryKey"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="crudQuery.odds"
            :placeholder="$t('other.pls_input')"
            style="width: 360px"
            clearable
          >
            <template #prepend>
              <el-select
                v-model="crudQuery.odds_type"
                style="width: 120px; margin: 0"
                :placeholder="$t('lib.all')"
                popper-class="user-select"
                clearable
              >
                <el-option
                  v-for="item in bettingOddsOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-model="crudQuery.term"
                style="width: 80px; margin: 0"
                :placeholder="$t('lib.all')"
                popper-class="user-select"
                clearable
              >
                <el-option
                  v-for="item in equalOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item :label="$t('table.comp_name' /**所属公司 */)">
          <el-select
            v-model="crudQuery.company_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            filterable
            clearable
          >
            <el-option
              v-for="company in companyList"
              :key="company.id"
              :label="company.company_name"
              :value="company.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.bet_username' /**用户名 */)">
          <el-input
            v-model="crudQuery.username"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.risk_label' /**风控标签 */)">
          <el-select
            v-model="crudQuery.risk_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            filterable
            clearable
          >
            <el-option
              v-for="item in riskLabelOption"
              :key="item.tag_id"
              :label="item.tag_name"
              :value="item.tag_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.update_time1' /**更新时间 */)">
          <dateTimePickerQuery
            start-key="update_start_time"
            end-key="update_end_time"
            :prop-time="[
              crudQuery.update_start_time,
              crudQuery.update_end_time,
            ]"
            @set-time="crudSetQueryKey"
          />
        </el-form-item>
        <el-form-item :label="$t('table.bet_ip' /**投注IP */)">
          <el-input
            v-model="crudQuery.ip_address"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.is_refund' /**是否反结算 */)">
          <el-select
            v-model="crudQuery.is_reverse"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="bet in isNot"
              :key="bet.value"
              :label="bet.label"
              :value="bet.value"
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
        <el-form-item>
          <el-button
            v-only="toolPermission.export"
            type="success"
            :icon="Download"
            :loading="queryLoading"
            @click="toQuery({ export: 1 })"
          >
            {{ $t("crud.export") }}
          </el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #pageBody>
      <el-table
        ref="tableRef"
        :key="tableKey"
        v-loading="queryLoading"
        :data="crudData"
        stripe
        row-key="order_id"
        style="width: 100%"
        height="100%"
        border
        resizable
        :load="loadTree"
        :header-cell-style="filterHeaderColumn"
        :tree-props="{ children: 'parlay_info', hasChildren: 'is_parlay' }"
        :cell-style="cellStyle"
        :summary-method="getSummaries"
        show-summary
        lazy
        :expand-row-keys="[]"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="
            (row:any) =>
              +row.is_cancel === 0
              && +row.is_getprize === 0
              && +row.receive_status === 0
              && !row.parlay_id
          "
        />
        <el-table-column
          v-if="getColumnShow('order_id')"
          prop="order_id"
          :label="$t('table.order_number' /**订单号 */)"
          min-width="180"
          align="center"
        >
          <template #default="scope">
            <span v-html="scope.row.order_id" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('username')"
          prop="username"
          :label="$t('table.bet_username' /**用户名 */)"
          min-width="120"
          align="center"
        />
        <!-- <el-table-column
          v-if="getColumnShow('id')"
          prop="id"
          :label="$t('table.user_id' /**用户ID */)"
          min-width="120"
          align="center"
        /> -->
        <el-table-column
          v-if="getColumnShow('company_name')"
          prop="company_name"
          :label="$t('table.comp_name' /**所属公司 */)"
          min-width="120"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('game_start_time')"
          prop="game_start_time"
          :label="$t('table.game_start_time' /**开赛时间 */)"
          min-width="180"
          align="center"
        >
          <template #default="scope">
            <span v-if="+scope.row.game_start_time">{{
              parseTime(scope.row.game_start_time)
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="getColumnShow('game_name')"
          prop="game_name"
          :label="$t('table.game_type' /**所属游戏 */)"
          min-width="100"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('game_id')"
          prop="game_id"
          :label="$t('table.game_id' /**盘口ID */)"
          min-width="80"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('create_time')"
          prop="create_time"
          :label="$t('table.bet_betting_time' /**投注时间 */)"
          min-width="180"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.create_time">{{
              parseTime(scope.row.create_time)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('update_time')"
          prop="update_time"
          :label="$t('table.update_time1' /**更新时间 */)"
          min-width="180"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.update_time">{{
              parseTime(scope.row.update_time)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('event_name')"
          prop="event_name"
          :label="$t('table.event_name' /**所属赛事 */)"
          min-width="180"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('game_start_time')"
          :label="$t('table.team_name' /**队伍名称 */)"
          min-width="180"
          align="center"
        >
          <template #default="scope">
            {{ scope.row.team_name_1 }} VS {{ scope.row.team_name_2 }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('play_id')"
          prop="play_id"
          :label="$t('table.play_Id' /**玩法ID */)"
          min-width="100"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('play_name')"
          prop="play_name"
          :label="$t('table.play_name' /**投注内容 */)"
          min-width="160"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('winner')"
          prop="winner"
          :label="`${$t('table.betting')} ID`"
          min-width="120"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('desc')"
          prop="desc"
          :label="$t('table.bet_betting_content' /**备注 */)"
          min-width="180"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('currency_id')"
          prop="currency_id"
          :label="$t('table.money_type' /**货币类型 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            {{ getLabel(scope.row.currency_id, moneyOption, "id", "name") }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('userip')"
          prop="userip"
          :label="$t('table.bet_ip' /**投注IP */)"
          min-width="180"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('client_type')"
          prop="client_type"
          :label="$t('table.terminal_type' /**投注设备 */)"
          min-width="90"
          align="center"
        >
          <template #default="scope">
            {{ getLabel(scope.row.client_type, terminalOption) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('amount')"
          prop="amount"
          :label="$t('table.bet_amount' /**投注金额 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            {{ toFixedNumber(scope.row.amount * scope.row.show_scale) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.cny_amount' /**换算人名币 */)"
          min-width="130"
          prop="amount_cny"
          align="center"
        >
          <template #default="scope">
            <span
              v-html="
                toFixedNumber(
                  scope.row.amount
                    * scope.row.exchange_rate
                    * scope.row.show_scale,
                )
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.bonus' /**奖金 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            {{ toFixedNumber(scope.row.bonus * scope.row.show_scale) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.bonus_cny' /**换算人名币奖金 */)"
          min-width="130"
          prop="bonus_cny"
          align="center"
        >
          <template #default="scope">
            <span
              v-html="
                toFixedNumber(
                  scope.row.bonus
                    * scope.row.exchange_rate
                    * scope.row.show_scale,
                )
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.profit_loss' /**盈亏 */)"
          prop="profit_loss"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            {{
              toFixedNumber(
                (scope.row.bonus - scope.row.amount)
                  * scope.row.exchange_rate
                  * scope.row.show_scale,
              )
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('exchange_rate')"
          prop="exchange_rate"
          :label="$t('table.rate' /**汇率 */)"
          min-width="80"
          align="center"
        >
          <template #default="scope">
            {{ toFixedNumber(scope.row.exchange_rate, 4) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('odds')"
          prop="odds"
          :label="$t('table.bet_odds' /**投注赔率 */)"
          min-width="90"
          align="center"
        />
        <!-- <el-table-column
          v-if="getColumnShow('prize_status')"
          prop="prize_status"
          :label="$t('table.win_loss' /**输赢 */)"
          min-width="90"
          align="center"
        >
          <template #default="scope">
            {{
              getLabel(scope.row.prize_status, winLossOption)
                || $t("lib.no_finish")
            }}
          </template>
        </el-table-column> -->
        <el-table-column
          v-if="getColumnShow('receive_status')"
          prop="receive_status"
          :label="$t('table.bet_status' /**注单状态 */)"
          min-width="90"
          align="center"
        >
          <template #default="scope">
            {{ getBetListStatus(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('is_reverse')"
          prop="is_reverse"
          :label="$t('table.is_refund' /**是否反结算 */)"
          min-width="100"
          align="center"
        >
          <template #default="scope">
            {{ getLabel(scope.row.is_reverse, isNot) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('risk_tag_name')"
          prop="risk_tag_name"
          :label="$t('table.risk_label' /**风控标签 */)"
          min-width="90"
          align="center"
        >
          <template #default="scope">
            {{ getLabel(scope.row.is_reverse, riskLabelOption) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('category_id')"
          prop="category_id"
          :label="$t('table.betting_type' /**盘口类型 */)"
          min-width="90"
          align="center"
        >
          <template #default="scope">
            {{ getLabel(scope.row.category_id, handicapType) }}
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          :label="$t('table.operate')"
          min-width="120"
          fixed="right"
          align="center"
        >
          <template #default="scope">
            <el-button
              v-if="
                +scope.row.is_cancel === 0
                  && +scope.row.is_getprize === 0
                  && +scope.row.receive_status === 0
                  && crudFindRole.only(otherPermission.invalid1)
              "
              type="primary"
              size="small"
              @click="toReview([scope.row])"
            >
              {{ $t("lib.abort_apply") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template #pageFooter>
      <el-pagination
        v-model:current-page="crudPage.page"
        v-model:page-size="crudPage.limit"
        :page-sizes="[10, 50, 100, 500]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="crudPage.count"
        @size-change="refresh"
        @current-change="refresh"
      />
      <span>
        <el-dropdown popper-class="batch-operation" @command="toBatchOperate">
          <el-button type="primary">
            {{ $t("crud.batch_operation" /**批量操作 */) }}
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-if="crudFindRole.only(otherPermission.invalid1)"
                command="status1"
                :disabled="selectionArr.length === 0"
              >
                {{ $t("lib.abort_apply") }}
              </el-dropdown-item>
              <el-dropdown-item
                v-if="crudFindRole.only(otherPermission.invalid2)"
                command="status2"
              >
                {{ $t("lib.abort_apply_query") }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button type="success" style="margin-left: 20px" @click="showTotal">
          {{ $t("table.show_total" /**显示总计 */) }}
        </el-button>
        <el-button
          type="warning"
          :icon="Sort"
          style="margin-left: 20px"
          @click="toPbl"
        >
          {{ $t("router.progress-bet-list") }}
        </el-button>
      </span>
    </template>
  </PageMain>
</template>

<style lang="scss" scoped>
.row-line {
  display: flex;
  height: 63px;
  line-height: 63px;
  border-bottom: 1px solid #363637;
}
.number0 {
  text-align: center;
  min-width: 735px;
  max-width: 750px;
  border-right: 1px solid #363637;
}
.number1 {
  text-align: center;
  min-width: 1590px;
  border-right: 1px solid #363637;
}
.number2 {
  text-align: center;
  min-width: 130px;
  border-right: 1px solid #363637;
}
.number3 {
  text-align: center;
  min-width: 80px;
  border-right: 1px solid #363637;
}
:deep(.el-input-group__prepend) {
  padding: 0;
}
</style>
