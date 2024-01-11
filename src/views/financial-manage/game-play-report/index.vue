<route lang="yaml">
name: GamePlayReport
meta:
  title: 风控赛事报表
  constant: false
  layout: true
    </route>

<script lang="ts" setup name="GamePlayReport">
import { Download, RefreshRight, Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/financial-manage/game-play-report'
import { i18n } from '@/i18n'
import getProxyListHook from '@/hooks/getProxyListHook'
import getGameListHook from '@/hooks/getGameListHook'
import { dictionary } from '@/hooks/lib'
import getCompanyList from '@/hooks/getCompanyList'
import { toFixedNumber } from '@/utils'
import getCurrencyTypeHook from '@/hooks/getCurrencyTypeHook'
import { getGamePlayTypeApi } from '@/api/handicap-manage/handicap-list'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.game-play-report'),
  defaultQuery: {
    game_type_id: null,
    bonus_start_time: dayjs().subtract(1, 'day').startOf('day').unix(),
    bonus_end_time: dayjs().endOf('day').unix(),
    category_id: null,
    currency_id: null,
    is_champion: null,
    proxy_id: null,
    game_id: null,
    play_type_id: null,
    company_id: null,
    export: 0,
  },
  crudMethod: { ...Api },
}

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  reQuery,
  setTheQuery,
  crudSetQueryKey,
  crudHook,
  crudResData,
} = CRUD(defaultCrudOptions)

const { proxyList } = getProxyListHook()

const { companyList } = getCompanyList()

const { gameList } = getGameListHook(false, false)

const { handicapType, isNot } = dictionary()

const { t } = useI18n()

const { currencyList } = getCurrencyTypeHook()

crudHook.afterRefresh = () => {
  const sumPage: any = {
    play_name: '',
    money_amount: 0,
    money_win_lose: 0,
    money_bonus: 0,
  }
  if (crudData.value.length === 0) {
    return
  }
  crudData.value.forEach((data: any) => {
    sumPage.money_amount += +data.money_amount || 0
    sumPage.money_win_lose += +data.money_win_lose || 0
    sumPage.money_bonus += +data.money_bonus || 0
    sumPage.play_name = `${t('table.page_total_funds')}:`
  })
  ;(crudData.value as any).push(sumPage)
  if (crudResData.statistics) {
    (crudData.value as any).push({
      play_name: `${t('table.total_funds')}:`,
      money_amount: toFixedNumber(crudResData.statistics.total_money_amount),
      money_win_lose: toFixedNumber(crudResData.statistics.total_win_lose),
      money_bonus: toFixedNumber(crudResData.statistics.total_money_bonus),
    })
  }
}

const playOption: any = ref([])

const getPlayById = () => {
  if (!crudQuery.game_type_id) {
    playOption.value = []
    return
  }
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

function sortChange({ prop, order }: any) {
  if (!order) {
    setTheQuery({ field_sort: 0 })
    toQuery()
    return
  }
  if (prop === 'money_amount') {
    setTheQuery({ field_sort: order === 'ascending' ? 2 : 1 })
  }
  else if (prop === 'money_bonus') {
    setTheQuery({ field_sort: order === 'ascending' ? 4 : 3 })
  }
  else if (prop === 'money_win_lose') {
    setTheQuery({ field_sort: order === 'ascending' ? 6 : 5 })
  }
  toQuery()
}
</script>

<template>
  <PageMain
    :title="$t('router.game-play-report')"
    :has-add="false"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.game_id' /**盘口ID */)">
          <el-input
            v-model="crudQuery.game_id"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.game_type')">
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
              v-for="game in gameList"
              :key="game.id"
              :label="game.game_name"
              :value="game.id"
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
        <el-form-item :label="$t('table.currency_name')" prop="currency_id">
          <el-select
            v-model="crudQuery.currency_id"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in currencyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
        <el-form-item :label="$t('table.is_champion')">
          <el-select
            v-model="crudQuery.is_champion"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
          >
            <el-option
              v-for="item in isNot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
              v-for="pro in proxyList"
              :key="pro.id"
              :label="pro.proxy_name"
              :value="pro.id"
            />
          </el-select>
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
        <el-form-item :label="$t('table.bet_settlement_time')">
          <dateTimePickerQuery
            start-key="bonus_start_time"
            end-key="bonus_end_time"
            :prop-time="[
              crudQuery.bonus_start_time,
              crudQuery.bonus_end_time,
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
        v-loading="queryLoading"
        :data="crudData"
        stripe
        style="width: 100%"
        height="100%"
        border
        resizable
        @sort-change="sortChange"
      >
        <el-table-column
          prop="play_name"
          :label="$t('table.play_name')"
          min-width="160"
          align="center"
        />
        <el-table-column
          prop="game_type_name"
          :label="$t('table.game_name')"
          min-width="160"
          align="center"
        />
        <el-table-column
          prop="bet_info"
          :label="$t('table.bet_info')"
          min-width="220"
          align="center"
        />
        <el-table-column
          prop="money_amount"
          :label="$t('table.betting_amount')"
          min-width="160"
          align="center"
          sortable
        >
          <template #default="scope">
            {{ toFixedNumber(scope.row.money_amount) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="money_bonus"
          :label="$t('table.money_bonus')"
          min-width="160"
          align="center"
          sortable
        >
          <template #default="scope">
            {{ toFixedNumber(scope.row.money_bonus) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="money_win_lose"
          :label="$t('table.profit_amount')"
          min-width="160"
          align="center"
          sortable
        >
          <template #default="scope">
            {{ toFixedNumber(scope.row.money_win_lose) }}
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
  </PageMain>
</template>
