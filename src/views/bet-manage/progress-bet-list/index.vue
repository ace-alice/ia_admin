<route lang="yaml">
name: ProgressBetList
meta:
  title: 实时注单列表
  constant: false
  layout: true
</route>

<script setup lang="ts" name="ProgressBetList">
import { dynamicParam } from '@/hooks/dynamicParamHook'
import getGameListHook from '@/hooks/getGameListHook'
import { dictionary } from '@/hooks/lib'
import visibleColumn from '@/hooks/visibleColumn'
import { getBetListStatus, getLabel, toFixedNumber } from '@/utils'
import { parseTime } from '@/utils/formatTime'
import { getLocal } from '@/utils/storage'

const suffix = +(getLocal('lang') || 1) === 1 ? '_cn' : '_en'

const route = useRoute()

const { gameList, eventList, gameChange } = getGameListHook(true, false)

const crudQuery = reactive<any>({
  game_type_id: null,
  game_id: route.query?.game_id ? +route.query?.game_id : '',
  play_id: null,
  winner: null,
  category_id: null,
  event_id: null,
})

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()
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
const crudData = ref<any[]>([])

const filterCrudData = computed(() => {
  const gameId = String(crudQuery.game_id || '').split(',').filter(id => !!id)
  return crudData.value.filter((row: any) => {
    if (row.is_parlay) {
      if (!row.parlay_info || !Array.isArray(row.parlay_info)) {
        return false
      }
      else {
        return row.parlay_info.some((rows: any) => {
          return (
            (gameId.length === 0 || gameId.includes(String(rows.game_id)))
            && (!+crudQuery.play_id || +rows.play_id === +crudQuery.play_id)
            && (!+crudQuery.winner || +rows.winner === +crudQuery.winner)
            && (!+crudQuery.game_type_id || +rows.game_type_id === +crudQuery.game_type_id)
            && (!+crudQuery.event_id || +rows.event_id === +crudQuery.event_id)
            && (!+crudQuery.category_id || +rows.category_id === +crudQuery.category_id)
          )
        })
      }
    }
    else {
      return (
        (gameId.length === 0 || gameId.includes(String(row.game_id)))
        && (!+crudQuery.play_id || +row.play_id === +crudQuery.play_id)
        && (!+crudQuery.winner || +row.winner === +crudQuery.winner)
        && (!+crudQuery.game_type_id || +row.game_type_id === +crudQuery.game_type_id)
        && (!+crudQuery.event_id || +row.event_id === +crudQuery.event_id)
        && (!+crudQuery.category_id || +row.category_id === +crudQuery.category_id)
      )
    }
  }).filter((_, index: number) => index < 30)
})

const moneyOption: any = ref([])
const terminalOption: any = ref([
  { label: 'pc', value: 1 },
  { label: 'wap', value: 2 },
  { label: 'app', value: 3 },
])
const riskLabelOption: any = ref([])

const { isNot, handicapType } = dictionary()

const { getMoneyType, getRiskLabel } = dynamicParam()

const { proxy }: any = getCurrentInstance()

onMounted(() => {
  getMoneyType().then((res: any) => {
    moneyOption.value = res
  })
  getRiskLabel().then((res: any) => {
    riskLabelOption.value = res
  })
  proxy.mittBus.on('progressBetListBus', (content: any) => {
    const gameId = String(route.query?.game_id || '').split(',').filter(id => !!id)
    if (gameId.length === 0) {
      crudData.value.unshift(content)
      return
    }
    if (!content.is_parlay && !gameId.includes(String(content.game_id))) {
      return
    }
    if (content.is_parlay) {
      const hasGame = content.parlay_info.some((rows: any) => {
        return gameId.includes(String(rows.game_id))
      })
      if (!hasGame) {
        return
      }
    }
    crudData.value.unshift(content)
  })
})
onUnmounted(() => {
  proxy.mittBus.off('progressBetListBus')
})
</script>

<template>
  <PageMain
    :title="$t('router.progress-bet-list')"
    :has-tool="false"
    :has-footer="false"
  >
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
            @change="gameChange"
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
        <el-form-item :label="$t('table.game_id' /**盘口ID */)">
          <el-input
            v-model="crudQuery.game_id"
            :placeholder="$t('table.user_ids_pl')"
            style="width: 300px"
            clearable
            :disabled="!!route.query?.game_id"
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
            v-model="crudQuery.winner"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
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
          <FilterColumnControl :column-info="columnInfo" />
        </el-form-item>
      </el-form>
    </template>
    <template #pageBody>
      <el-table
        ref="tableRef"
        :data="filterCrudData"
        stripe
        row-key="order_id"
        style="width: 100%"
        height="100%"
        border
        resizable
        :header-cell-style="filterHeaderColumn"
        :tree-props="{ children: 'parlay_info' }"
        :cell-style="cellStyle"
        default-expand-all
      >
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
          v-if="getColumnShow('company_name')"
          prop="company_name"
          :label="$t('table.comp_name' /**所属公司 */)"
          min-width="120"
          align="center"
        /> -->
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
          :prop="`game_name${suffix}`"
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
          :prop="`event_name${suffix}`"
          :label="$t('table.event_name' /**所属赛事 */)"
          min-width="180"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('team_name')"
          :label="$t('table.team_name' /**队伍名称 */)"
          min-width="180"
          align="center"
        >
          <template #default="scope">
            {{ scope.row[`team_name_1${suffix}`] }} VS {{ scope.row[`team_name_2${suffix}`] }}
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
          :prop="`desc${suffix}`"
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
        <!-- <el-table-column
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
        </el-table-column> -->
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
        <!-- <el-table-column
          v-if="getColumnShow('is_reverse')"
          prop="is_reverse"
          :label="$t('table.is_refund' /**是否反结算 */)"
          min-width="100"
          align="center"
        >
          <template #default="scope">
            {{ getLabel(scope.row.is_reverse, isNot) }}
          </template>
        </el-table-column> -->
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
      </el-table>
    </template>
  </PageMain>
</template>
