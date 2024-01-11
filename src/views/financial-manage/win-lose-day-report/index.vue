<route lang="yaml">
name: WinLoseDayReport
meta:
  title: 盈亏报表（日）
  constant: false
  layout: true
</route>

<script lang="ts" setup name="WinLoseDayReport">
import { RefreshRight, Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/financial-manage/win-lose-day-report'
import { i18n } from '@/i18n'
import getProxyListHook from '@/hooks/getProxyListHook'
import getCompanyList from '@/hooks/getCompanyList'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.win-lose-day-report'),
  defaultQuery: {
    proxy_id: null,
    company_id: null,
    start_time: dayjs().subtract(0, 'month').startOf('month').unix(),
    end_time: dayjs().endOf('day').unix(),
  },
  crudMethod: { ...Api },
}

const { companyList } = getCompanyList()

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  reQuery,
  crudSetQueryKey,
  crudResData,
} = CRUD(defaultCrudOptions)

const { proxyList } = getProxyListHook()
</script>

<template>
  <PageMain
    :title="$t('router.win-lose-day-report')"
    :has-add="false"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery">
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
        <el-form-item :label="$t('table.bet_betting_time' /**投注时间 */)">
          <dateTimePickerQuery
            start-key="start_time"
            end-key="end_time"
            :prop-time="[crudQuery.start_time, crudQuery.end_time]"
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
        <!-- <el-form-item>
          <el-button
            type="success"
            :icon="Download"
            :loading="queryLoading"
            @click="toQuery({ export: 1 })"
          >
            {{ $t("crud.export") }}
          </el-button>
        </el-form-item> -->
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
      >
        <el-table-column
          prop="date"
          :label="$t('table.bet_date')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="win_loss"
          :label="$t('table.profit_loss')"
          min-width="120"
          align="center"
        >
          <template #header>
            {{ $t("table.profit_loss") }}({{ $t("other.total") }}:{{
              crudResData.statistics?.total_win_loss || 0
            }})
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          :label="$t('table.betting_amount')"
          min-width="120"
          align="center"
        >
          <template #header>
            {{ $t("table.betting_amount") }}({{ $t("other.total") }}:{{
              crudResData.statistics?.total_amount || 0
            }})
          </template>
        </el-table-column>
        <el-table-column
          prop="actual_win_loss"
          :label="$t('table.actual_win_loss')"
          min-width="120"
          align="center"
        >
          <template #header>
            {{ $t("table.actual_win_loss") }}({{ $t("other.total") }}:{{
              crudResData.statistics?.total_actual_win_loss || 0
            }})
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
