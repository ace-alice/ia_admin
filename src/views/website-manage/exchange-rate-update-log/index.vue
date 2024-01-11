<route lang="yaml">
name: ExchangeRateUpdateLog
meta:
  title: 汇率变更日志
  constant: false
  layout: true
</route>

<script lang="ts" setup name="ExchangeRateUpdateLog">
import { RefreshRight, Search } from '@element-plus/icons-vue'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/website-manage/exchange-rate-update-log'
import { i18n } from '@/i18n'
import getCurrencyTypeHook from '@/hooks/getCurrencyTypeHook'
import { parseTime } from '@/utils/formatTime'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.exchange-rate-update-log'),
  crudOptShow: {
    add: true,
    formSize: '50%',
  },
  defaultQuery: {
    currency_id: null,
  },
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'currency:list:',
}

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  reQuery,
} = CRUD(defaultCrudOptions)

const { currencyList } = getCurrencyTypeHook()
</script>

<template>
  <PageMain
    :title="$t('router.exchange-rate-update-log')"
    :has-tool="true"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.currency_name')">
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
        ref="tableRef"
        v-loading="queryLoading"
        :data="crudData"
        stripe
        style="width: 100%"
        height="100%"
        border
        resizable
      >
        <el-table-column
          prop="id"
          :label="$t('table.number')"
          min-width="80"
          align="center"
        />
        <el-table-column
          prop="currency_type_name"
          :label="$t('table.currency_name')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="exchange_rate"
          :label="$t('table.exchange_rate')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="start_time"
          :label="$t('table.start_time')"
          min-width="190"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.start_time">{{
              parseTime(scope.row.start_time)
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="end_time"
          :label="$t('table.end_time')"
          min-width="190"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.end_time">{{
              parseTime(scope.row.end_time)
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_username"
          :label="$t('table.create_name')"
          min-width="130"
          align="center"
        />
        <el-table-column
          prop="update_username"
          :label="$t('table.action_name')"
          min-width="130"
          align="center"
        />
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
