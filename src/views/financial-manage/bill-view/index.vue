<route lang="yaml">
name: BillView
meta:
  title: 账单查看
  constant: false
  layout: true
      </route>

<script lang="ts" setup name="BillView">
import { RefreshRight, Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/financial-manage/bill-view'
import { i18n } from '@/i18n'
import { dictionary } from '@/hooks/lib'
import getCompanyList from '@/hooks/getCompanyList'
import getProxyListHook from '@/hooks/getProxyListHook'
import { parseTime } from '@/utils/formatTime'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.bill-view'),
  defaultQuery: {
    type: 0,
    proxy_id: null,
    status: -1,
    company_name: null,
    invoice_no: null,
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
  setTheQuery,
} = CRUD(defaultCrudOptions)

const { companyList } = getCompanyList()

const { proxyList } = getProxyListHook()

const { proxyOrComOption, getLabel, sendStatusOption } = dictionary()

function typeChange() {
  setTheQuery({ company_name: null, proxy_id: null })
}
</script>

<template>
  <PageMain
    :title="$t('router.bill-view')"
    :has-add="false"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery">
        <el-form-item :label="$t('table.bill_type')" prop="type">
          <el-select
            v-model="crudQuery.type"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
            @change="typeChange"
          >
            <el-option
              v-for="item in proxyOrComOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.three_company')" prop="company_name">
          <el-select
            v-model="crudQuery.company_name"
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
              :value="item.company_name"
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
        <el-form-item :label="$t('table.send_status' /**所属代理 */)">
          <el-select
            v-model="crudQuery.status"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="pro in sendStatusOption"
              :key="pro.value"
              :label="pro.label"
              :value="pro.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('table.invoice_no')"
          prop="invoice_no"
        >
          <el-input
            v-model="crudQuery.invoice_no"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
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
          prop="company_name"
          :label="$t('table.three_company')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="proxy_name"
          :label="$t('table.agent_name')"
          min-width="120"
          align="center"
        />

        <el-table-column
          prop="invoice_no"
          :label="$t('table.invoice_no')"
          min-width="200"
          align="center"
        />
        <el-table-column
          prop="date"
          :label="$t('table.month_time')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="send_status"
          :label="$t('table.send_status')"
          min-width="120"
          align="center"
        />
        <!-- <el-table-column
          prop="note"
          :label="$t('table.remark')"
          min-width="160"
          align="center"
        /> -->
        <el-table-column
          prop="create_time"
          :label="$t('table.create_time')"
          min-width="180"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.create_time">{{ parseTime(scope.row.create_time) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="update_time"
          :label="$t('table.update_time')"
          min-width="180"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.update_time">{{ parseTime(scope.row.update_time) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="update_username"
          :label="$t('table.task_last_operator')"
          min-width="120"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.update_username">{{ scope.row.update_username }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operate"
          :label="$t('table.operate')"
          min-width="120"
          align="center"
        >
          <template #default="scope">
            <a
              :href="scope.row.pdf_path"
              target="_blank"
            >
              {{ $t('table.see_pdf') }}
            </a>
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

