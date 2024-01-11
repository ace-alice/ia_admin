<route lang="yaml">
name: betList
meta:
  title: 注单列表
  constant: false
  layout: true
</route>

<script lang="ts" setup name="betList">
import { Download, RefreshRight, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/financial-manage/user-report'
import { getGamePlayTypeApi } from '@/api/handicap-manage/handicap-list'
import { dictionary } from '@/hooks/lib'
import { dynamicParam } from '@/hooks/dynamicParamHook'
import getGameListHook from '@/hooks/getGameListHook'
import getCompanyList from '@/hooks/getCompanyList'

const i18n = useI18n()

const { companyList } = getCompanyList()

const route = useRoute()

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.t('router.bet-list'),
  crudOptShow: {
    add: true,
    formSize: '800px',
  },
  defaultQuery: {
    game_type_id: null,
    create_start_time: dayjs().startOf('day').unix(),
    create_end_time: dayjs().endOf('day').unix(),
    event_id: null,
    currency_id: null,
    category_id: null,
    is_cancel: +(route.query?.is_cancel || 0),
    company_id: null,
    update_start_time: null,
    update_end_time: null,
    is_getprize: null,
    receive_status: null,
    is_parlay: null,
    client_type: null,
    proxy_id: null,
    play_type_id: null,
    odds_compare: 1,
    odds: null,
    username: null,
    bet_amount_compare: 1,
    bet_amount: null,
    profit_amount_compare: 1,
    profit_amount: null,
    export: 0,
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
  crudResData,
  setTheQuery,
} = CRUD(defaultCrudOptions)

const statisticsDtail = computed(() => {
  if (crudResData.statistics && Array.isArray(crudResData.statistics)) {
    return crudResData.statistics
  }
  else {
    return []
  }
})

const {
  isNot,
  acceptStatusOption,
  handicapType,
  bettingOddsOption,
} = dictionary()
const { getMoneyType, getProxy } = dynamicParam()
const betTypes: any = ref([
  { label: i18n.t('table.normal_bet_type'), value: 0 },
  { label: i18n.t('table.parlay_bet_type'), value: 1 },
])

const { gameList, eventList, gameChange } = getGameListHook(true, false)

const moneyOption: any = ref([])
const terminalOption: any = ref([
  { label: 'pc', value: 1 },
  { label: 'wap', value: 2 },
  { label: 'app', value: 3 },
])
const proxyOption: any = ref([])
const playOption: any = ref([])

const getPlayById = () => {
  setTheQuery({ event_id: null })
  gameChange(crudQuery.game_type_id)
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

const dialogVisible = ref(false)

function showTotal() {
  dialogVisible.value = true
}

function totalClose() {
  crudResData.value = {}
  dialogVisible.value = false
}

function sortChange({ prop, order }: any) {
  if (!order) {
    setTheQuery({ field_sort: 0 })
    toQuery()
    return
  }
  if (prop === 'bet_amount') {
    setTheQuery({ field_sort: order === 'ascending' ? 2 : 1 })
  }
  else if (prop === 'valid_bet_amount') {
    setTheQuery({ field_sort: order === 'ascending' ? 4 : 3 })
  }
  else if (prop === 'win_amount') {
    setTheQuery({ field_sort: order === 'ascending' ? 6 : 5 })
  }
  else if (prop === 'valid_win_amount') {
    setTheQuery({ field_sort: order === 'ascending' ? 8 : 7 })
  }
  else if (prop === 'profit_amount') {
    setTheQuery({ field_sort: order === 'ascending' ? 10 : 9 })
  }
  toQuery()
}

onMounted(() => {
  getMoneyType().then((res: any) => {
    moneyOption.value = res
  })
  getProxy().then((res: any) => {
    proxyOption.value = res
  })
})
</script>

<template>
  <PageMain :title="$t('router.user-report')" :has-tool="false" :has-footer="true">
    <template #other>
      <el-dialog
        v-model="dialogVisible"
        :before-close="totalClose"
        width="1200px"
      >
        <el-table
          :data="statisticsDtail"
          stripe
          style="width: 1200px"
          height="100%"
          border
          resizable
        >
          <el-table-column
            prop="currency_name"
            :label="$t('table.currency_name' /**币种 */)"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="total_profit_amount"
            :label="$t('table.total_funds' /**总资金变动 */)"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="total_valid_bet_amount"
            :label="$t('table.total_bet_amount' /**总投注金额 */)"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="total_valid_win_amount"
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
        <el-form-item :label="$t('table.game_event')">
          <el-select
            v-model="crudQuery.event_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="event in eventList"
              :key="event.id"
              :label="event.event_name"
              :value="event.id"
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
            v-model="crudQuery.client_type"
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
        <el-form-item>
          <el-input
            v-model="crudQuery.odds"
            :placeholder="$t('other.pls_input')"
            style="width: 320px"
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
                v-model="crudQuery.odds_compare"
                style="width: 80px; margin: 0"
                :placeholder="$t('lib.all')"
                popper-class="user-select"
                clearable
              >
                <el-option label="=" :value="1" />
                <el-option label=">" :value="2" />
                <el-option label="<" :value="3" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('table.betting_amount')">
          <el-input
            v-model="crudQuery.bet_amount"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          >
            <template #prepend>
              <el-select
                v-model="crudQuery.bet_amount_compare"
                style="width: 80px; margin: 0"
                :placeholder="$t('lib.all')"
                popper-class="user-select"
                clearable
              >
                <el-option label="=" :value="1" />
                <el-option label=">" :value="2" />
                <el-option label="<" :value="3" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('table.profit_amount')">
          <el-input
            v-model="crudQuery.profit_amount"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          >
            <template #prepend>
              <el-select
                v-model="crudQuery.profit_amount_compare"
                style="width: 80px; margin: 0"
                :placeholder="$t('lib.all')"
                popper-class="user-select"
                clearable
              >
                <el-option label="=" :value="1" />
                <el-option label=">" :value="2" />
                <el-option label="<" :value="3" />
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
        <el-form-item :label="$t('table.bet_betting_time' /**投注时间 */)">
          <dateTimePickerQuery
            start-key="create_start_time"
            end-key="create_end_time"
            :prop-time="[
              crudQuery.create_start_time,
              crudQuery.create_end_time,
            ]"
            @set-time="crudSetQueryKey"
          />
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
        v-loading="queryLoading"
        :data="crudData"
        stripe
        row-key="order_id"
        style="width: 100%"
        height="100%"
        border
        resizable
        @sort-change="sortChange"
      >
        <el-table-column
          prop="username"
          :label="$t('table.bet_username' /**用户名 */)"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="proxy_name"
          :label="$t('table.proxy_name' /**所属代理 */)"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="company_name"
          :label="$t('table.comp_name' /**所属公司 */)"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="bet_number"
          :label="$t('table.bet_number' /**投注局数 */)"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="bet_amount"
          :label="$t('table.bet_amount' /**投注金额 */)"
          min-width="130"
          align="center"
          sortable
        />
        <el-table-column
          prop="valid_bet_amount"
          :label="$t('table.valid_bet_amount' /**有效投注 */)"
          min-width="130"
          align="center"
          sortable
        />
        <el-table-column
          prop="win_amount"
          :label="$t('table.win_amount' /**派奖金额 */)"
          min-width="130"
          align="center"
          sortable
        />
        <el-table-column
          prop="valid_win_amount"
          :label="$t('table.valid_win_amount' /**有效派奖 */)"
          min-width="130"
          align="center"
          sortable
        />
        <el-table-column
          :label="$t('table.profit_amount' /**盈亏 */)"
          prop="profit_amount"
          min-width="130"
          align="center"
          sortable
        />
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
      <el-button type="success" style="margin-left: 20px" @click="showTotal">
        {{ $t("table.show_total" /**显示总计 */) }}
      </el-button>
    </template>
  </PageMain>
</template>

<style lang="scss" scoped>
:deep(.el-input-group__prepend) {
  padding: 0;
}
</style>
