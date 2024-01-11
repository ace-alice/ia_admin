<route lang="yaml">
name: ChargeSettlementReportAgent
meta:
  title: 收费结算报表(代理)
  constant: false
  layout: true
</route>

<script lang="ts" setup name="ChargeSettlementReportAgent">
import { Download, RefreshRight, Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/financial-manage/charge-settlement-report-agent'
import { i18n } from '@/i18n'
import getProxyListHook from '@/hooks/getProxyListHook'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.charge-settlement-report-agent'),
  defaultQuery: {
    proxy_id: null,
    month_time: dayjs().subtract(1, 'month').startOf('month').unix(),
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
} = CRUD(defaultCrudOptions)

const { proxyList } = getProxyListHook()

const router = useRouter()

function toSeeCompDetail(row: any) {
  router.push({
    name: 'ChargeSettlementReportCompany',
    query: {
      month_time: crudQuery.month_time,
      proxy_id: row.proxy_id,
    },
  })
}
</script>

<template>
  <PageMain
    :title="$t('router.charge-settlement-report-agent')"
    :has-add="false"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery">
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
        <el-form-item :label="$t('table.month_time')">
          <el-date-picker
            v-model="crudQuery.month_time"
            type="month"
            :placeholder="$t('table.month_time')"
            value-format="X"
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
      >
        <el-table-column
          prop="proxy_name"
          :label="$t('table.agent_name')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="date"
          :label="$t('table.month_time')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="receipt_type_desc"
          :label="$t('table.receipt_type_desc')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="total_win_lose"
          :label="$t('table.profit_amount')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="receipt_amount"
          :label="$t('table.receipt_amount')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="total_receipt_amount"
          :label="$t('table.total_receipt_amount')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="return_receipt_amount"
          :label="$t('table.return_receipt_amount')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="proxy_receipt_config"
          :label="$t('table.current_month_setting')"
          min-width="240"
          align="left"
        >
          <template #default="scope">
            <div
              v-if="
                scope.row.proxy_receipt_config
                  && Array.isArray(JSON.parse(scope.row.proxy_receipt_config))
              "
            >
              <div
                v-for="(config, index) in JSON.parse(
                  scope.row.proxy_receipt_config,
                )"
                :key="index"
              >
                <span>{{
                  `${$t("other.no")}${index + 1}${$t("other.level")}`
                }}</span>: <span>{{ config.amount }}</span> , <span>{{ $t("table.point_level") }}</span>: <span>{{ config.points }}</span>
              </div>
            </div>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="money_amount"
          :label="$t('table.money_amount')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="money_bonus"
          :label="$t('table.money_bonus')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="money_win_lose"
          :label="$t('table.money_win_lose')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="other_money_amount"
          :label="$t('table.other_money_amount')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="other_money_bonus"
          :label="$t('table.other_money_bonus')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="other_money_win_lose"
          :label="$t('table.other_money_win_lose')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="virtual_amount"
          :label="$t('table.virtual_amount')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="virtual_bonus"
          :label="$t('table.virtual_bonus')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="virtual_win_lose"
          :label="$t('table.virtual_win_lose')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="operate"
          :label="$t('table.operate')"
          min-width="140"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              type="warning"
              link
              @click="toSeeCompDetail(scope.row)"
            >
              {{ $t("table.see_comp_detail") }}
            </el-button>
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
