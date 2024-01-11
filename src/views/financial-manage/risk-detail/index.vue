<route lang="yaml">
name: RiskDetail
meta:
  title: 风控赛事详情
  constant: false
  layout: true
</route>

<script lang="ts" setup name="RiskDetail">
import { RefreshRight, Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/financial-manage/risk-detail'
import { i18n } from '@/i18n'
import getProxyListHook from '@/hooks/getProxyListHook'
import { dictionary } from '@/hooks/lib'
import getCompanyList from '@/hooks/getCompanyList'
import { getLabel, toFixedNumber } from '@/utils'
import getCurrencyTypeHook from '@/hooks/getCurrencyTypeHook'
import getGameListHook from '@/hooks/getGameListHook'

const route = useRoute()

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.risk-detail'),
  defaultQuery: {
    bonus_start_time:
      +(route.query?.bonus_start_time || 0)
      || dayjs().subtract(29, 'day').startOf('day').unix(),
    bonus_end_time: +(route.query?.bonus_end_time || 0) || dayjs().endOf('day').unix(),
    category_id: +(route.query?.category_id || 0) || null,
    currency_id: +(route.query?.currency_id || 0) || null,
    is_champion: +(route.query?.is_champion || 0) || 0,
    proxy_id: +(route.query?.proxy_id || 0) || null,
    company_id: +(route.query?.company_id || 0) || null,
    event_id: route.query?.event_id || null,
  },
  crudMethod: { ...Api },
}

const { gameList } = getGameListHook(false, false)

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  reQuery,
  setTheQuery,
  crudHook,
  crudResData,
  crudSetQueryKey,
} = CRUD(defaultCrudOptions)

const { proxyList } = getProxyListHook()

const { companyList } = getCompanyList()

const { handicapType, isNot } = dictionary()

const { t } = useI18n()

const { currencyList } = getCurrencyTypeHook()

const eventName = ref('')

crudHook.afterRefresh = () => {
  const sumPage: any = {
    event_id: '',
    money_amount: 0,
    money_win_lose: 0,
  }
  eventName.value = crudResData.event_info?.event_name || ''
  if (crudData.value.length === 0) {
    return
  }
  crudData.value.forEach((data: any) => {
    sumPage.money_amount += +data.money_amount || 0
    sumPage.money_win_lose += +data.money_win_lose || 0
    sumPage.game_type_id = `${t('table.page_total_funds')}:`
  })
  ;(crudData.value as any).push(sumPage)
  if (crudResData.statistics) {
    (crudData.value as any).push({
      game_type_id: `${t('table.total_funds')}:`,
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
</script>

<template>
  <PageMain
    :title="`${$t('router.risk-detail')} -- ${eventName}`"
    :has-add="false"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
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
          prop="game_type_id"
          :label="$t('table.game_name')"
          min-width="120"
          align="center"
        >
          <template #default="scope">
            <span v-if="+scope.row.game_type_id">{{
              getLabel(scope.row.game_type_id, gameList, "id", "game_name")
            }}</span>
            <span v-else>{{ scope.row.game_type_id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="game_id"
          :label="$t('table.game_id')"
          min-width="160"
          align="center"
        />
        <el-table-column
          prop="vs_info"
          :label="$t('table.team_vs')"
          min-width="220"
          align="center"
        />
        <el-table-column
          prop="project_sum"
          :label="$t('table.project_sum')"
          min-width="160"
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
