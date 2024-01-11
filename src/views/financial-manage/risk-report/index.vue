<route lang="yaml">
name: RiskReport
meta:
  title: 风控赛事报表
  constant: false
  layout: true
</route>

<script lang="ts" setup name="RiskReport">
import { Download, RefreshRight, Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/financial-manage/risk-report'
import { i18n } from '@/i18n'
import getProxyListHook from '@/hooks/getProxyListHook'
import getGameListHook from '@/hooks/getGameListHook'
import { dictionary } from '@/hooks/lib'
import getCompanyList from '@/hooks/getCompanyList'
import { toFixedNumber } from '@/utils'
import getCurrencyTypeHook from '@/hooks/getCurrencyTypeHook'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.risk-report'),
  defaultQuery: {
    game_type_id: null,
    bonus_start_time: dayjs().subtract(2, 'day').startOf('day').unix(),
    bonus_end_time: dayjs().endOf('day').unix(),
    category_id: null,
    currency_id: null,
    is_champion: null,
    proxy_id: null,
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
    event_id: '',
    money_amount: 0,
    money_win_lose: 0,
  }
  if (crudData.value.length === 0) {
    return
  }
  crudData.value.forEach((data: any) => {
    sumPage.money_amount += +data.money_amount || 0
    sumPage.money_win_lose += +data.money_win_lose || 0
    sumPage.event_id = `${t('table.page_total_funds')}:`
  })
  ;(crudData.value as any).push(sumPage)
  if (crudResData.statistics) {
    (crudData.value as any).push({
      event_id: `${t('table.total_funds')}:`,
      money_amount: toFixedNumber(crudResData.statistics.total_money_amount),
      money_win_lose: toFixedNumber(crudResData.statistics.total_win_lose),
    })
  }
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
  else if (prop === 'money_win_lose') {
    setTheQuery({ field_sort: order === 'ascending' ? 4 : 3 })
  }
  toQuery()
}

const router = useRouter()

function toDetail(row: { event_id: number }) {
  const tempQuery: any = { event_id: row.event_id }
  Object.keys(crudQuery).forEach((keyL: string) => {
    if (
      [
        'bonus_start_time',
        'bonus_end_time',
        'category_id',
        'currency_id',
        'is_champion',
        'proxy_id',
        'company_id',
      ].includes(keyL)
    ) {
      if (crudQuery[keyL]) {
        tempQuery[keyL] = crudQuery[keyL]
      }
    }
  })

  const routePage = router.resolve({
    name: 'RiskDetail',
    query: Object.assign({}, tempQuery),
  })
  window.open(routePage.href, '_blank')
}
</script>

<template>
  <PageMain
    :title="$t('router.risk-report')"
    :has-add="false"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.game_type')">
          <el-select
            v-model="crudQuery.game_type_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="game in gameList"
              :key="game.id"
              :label="game.game_name"
              :value="game.id"
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
            :prop-time="[crudQuery.bonus_start_time, crudQuery.bonus_end_time]"
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
          prop="event_id"
          :label="$t('table.event_id')"
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
          prop="event_name"
          :label="$t('table.eventName')"
          min-width="220"
          align="center"
        >
          <template #default="scope">
            <el-link type="primary" @click="toDetail(scope.row)">
              {{ scope.row.event_name }}
            </el-link>
          </template>
        </el-table-column>
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
