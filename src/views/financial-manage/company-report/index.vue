<route lang="yaml">
name: companyReport
meta:
  title: 代理/公司报表
  constant: false
  layout: true
</route>

<script lang="ts" setup name="companyReport">
import { Download, RefreshRight, Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/financial-manage/company-report'
import { i18n } from '@/i18n'
import getGameListHook from '@/hooks/getGameListHook'
import getCompanyList from '@/hooks/getCompanyList'
import getCurrencyTypeHook from '@/hooks/getCurrencyTypeHook'
import getProxyListHook from '@/hooks/getProxyListHook'
import { dictionary } from '@/hooks/lib'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.company-report'),
  defaultQuery: {
    game_type_id: null,
    currency_id: null,
    category_id: null,
    update_time_start: null,
    update_time_end: null,
    create_time_start: dayjs().subtract(1, 'day').startOf('day').unix(),
    create_time_end: dayjs().endOf('day').unix(),
    finish_time_start: null,
    finish_time_end: null,
    proxy_id: null,
    company_id: null,
    is_parlay: null,
  },
  crudMethod: { ...Api },
}

const {
  crudQuery,
  crudData,
  crudResData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  crudSetQueryKey,
  reQuery,
  setTheQuery,
} = CRUD(defaultCrudOptions)

const { gameList } = getGameListHook(false, false)

const { companyList } = getCompanyList()

const { currencyList } = getCurrencyTypeHook()

const { proxyList } = getProxyListHook()

const { opiton1, categoryOption, getLabel } = dictionary()

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
</script>

<template>
  <PageMain
    :title="$t('router.company-report')"
    :has-add="false"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery">
        <el-form-item
          :label="$t('table.game_type_id' /**账变类型 */)"
          prop="game_type_id"
        >
          <el-select
            v-model="crudQuery.game_type_id"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in gameList"
              :key="item.id"
              :label="item.game_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.three_company')" prop="company_id">
          <el-select
            v-model="crudQuery.company_id"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.company_name"
              :value="item.id"
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
        <el-form-item :label="$t('table.betting_type')">
          <el-select
            v-model="crudQuery.category_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="pro in categoryOption"
              :key="pro.value"
              :label="pro.label"
              :value="pro.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_parlay')">
          <el-select
            v-model="crudQuery.is_parlay"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <!-- <el-option
              :label="$t('lib.all')"
              :value="-1"
            /> -->
            <el-option
              v-for="pro in opiton1"
              :key="pro.value"
              :label="pro.label"
              :value="pro.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.bet_betting_time')">
          <dateTimePickerQuery
            start-key="create_time_start"
            end-key="create_time_end"
            :prop-time="[
              crudQuery.create_time_start,
              crudQuery.create_time_end,
            ]"
            @set-time="crudSetQueryKey"
          />
        </el-form-item>
        <el-form-item :label="$t('table.update_time1')">
          <dateTimePickerQuery
            start-key="update_time_start"
            end-key="update_time_end"
            :prop-time="[
              crudQuery.update_time_start,
              crudQuery.update_time_end,
            ]"
            @set-time="crudSetQueryKey"
          />
        </el-form-item>
        <el-form-item :label="$t('table.bet_settlement_time')">
          <dateTimePickerQuery
            start-key="finish_time_start"
            end-key="finish_time_end"
            :prop-time="[
              crudQuery.finish_time_start,
              crudQuery.finish_time_end,
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
        style="width: 100%"
        height="100%"
        border
        resizable
        @sort-change="sortChange"
      >
        <el-table-column
          prop="company_name"
          :label="$t('table.comp_name')"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <span>{{
              getLabel(scope.row.company_id, companyList, "id", "company_name")
            }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="proxy_id"
          :label="$t('table.agent_name')"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <span>{{
              getLabel(scope.row.proxy_id, proxyList, "id", "proxy_name")
            }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="proxy_name"
          :label="$t('table.agent_name')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="active_user_number"
          :label="$t('table.active_user_number')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="currency_name"
          :label="$t('table.money_type' /**货币类型 */)"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <span>{{
              getLabel(scope.row.currency_id, currencyList, "id", "name")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="bet_amount"
          :label="$t('table.bet_amount')"
          min-width="150"
          align="center"
          sortable
        />
        <el-table-column
          prop="valid_bet_amount"
          :label="$t('table.valid_bet_amount')"
          min-width="150"
          align="center"
          sortable
        />
        <el-table-column
          prop="win_amount"
          :label="$t('table.win_amount')"
          min-width="150"
          align="center"
          sortable
        />
        <el-table-column
          prop="valid_win_amount"
          :label="$t('table.valid_win_amount')"
          min-width="150"
          align="center"
          sortable
        />
        <el-table-column
          prop="profit_amount"
          :label="$t('table.profit_amount')"
          min-width="150"
          align="center"
          sortable
        />
      </el-table>
    </template>
    <template #pageFooter>
      <el-table
        v-loading="queryLoading"
        :data="crudResData.statistics || []"
        stripe
        style="width: 100%"
        border
      >
        <el-table-column
          prop="currency_name"
          :label="$t('table.currency_name')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="money_amount"
          :label="$t('table.bet_amount')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="money_bonus"
          :label="$t('table.win_amount')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="money_profit"
          :label="$t('table.profit_amount')"
          min-width="150"
          align="center"
        />
      </el-table>
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

<style lang="scss" scoped>
:deep(.has-footer) {
  flex-direction: column !important;
  align-items: flex-end;
  .el-table{
    margin-bottom: 12px;
  }
}
</style>
