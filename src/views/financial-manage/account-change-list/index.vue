<route lang="yaml">
name: accountChangeList
meta:
  title: 账变列表
  constant: false
  layout: true
</route>

<script lang="ts" setup name="accountChangeList">
import { RefreshRight, Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { parseTime } from '@/utils/formatTime'
import { toFixedNumber } from '@/utils'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/financial-manage/account-change-list'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'
import { i18n } from '@/i18n'
import getCompanyList from '@/hooks/getCompanyList'
import getProxyListHook from '@/hooks/getProxyListHook'
const { companyList } = getCompanyList()

const { proxyList } = getProxyListHook()

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.account-change-list'),
  crudOptShow: {
    add: true,
    formSize: '50%',
  },
  defaultQuery: {
    order_type_id: null,
    create_time_start: dayjs().startOf('day').unix(),
    create_time_end: dayjs().endOf('day').unix(),
    username: null,
    order_number: null,
    currency_id: null,
    proxy_name: null,
    company_name: null,
    order_type_id_arr: [],
  },
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'account-change:list:',
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
  crudHook,
} = CRUD(defaultCrudOptions)

crudHook.beforeRefresh = () => {
  crudQuery.order_type_id = crudQuery.order_type_id_arr.join(',')
  return true
}

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()
const option1: any = ref([])
const option2: any = ref([])
// 账变类型
const getOption1 = () => {
  Api.getMoneyOrderType().then((res: any) => {
    if (res && res.code === 1) {
      option1.value = res.data
    }
  })
}
const getOption2 = () => {
  Api.getCurrencyType().then((res: any) => {
    if (res && res.code === 1) {
      option2.value = res.data
    }
  })
}
const initOption = () => {
  getOption1()
  getOption2()
}
const getNum = (columnName: string) => {
  const allData = crudData.value // 获取全部数据
  const allColumnData = allData.map(item => item[columnName]) // 提取该列数据
  const sumOfAllColumnData = allColumnData.reduce((prev: any, curr: any) => {
    const value = Number(curr)
    if (!isNaN(value)) {
      return Number(prev) + Number(curr)
    }
    else {
      return Number(prev)
    }
  }, 0) // 计算该列数据之和
  return sumOfAllColumnData
}
onMounted(() => {
  initOption()
})
</script>

<template>
  <PageMain
    :title="$t('router.account-change-list')"
    :has-add="false"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery">
        <el-form-item
          :label="$t('table.transaction_type' /**账变类型 */)"
          prop="order_type_id_arr"
        >
          <el-select
            v-model="crudQuery.order_type_id_arr"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
            multiple
            collapse-tags
          >
            <el-option
              v-for="item in option1"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('table.bet_username' /**用户名 */)"
          prop="username"
        >
          <el-input
            v-model="crudQuery.username"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.account_change_time')">
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
        <el-form-item
          :label="$t('table.order_number' /**订单号 */)"
          prop="order_number"
        >
          <el-input
            v-model="crudQuery.order_number"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.money_type' /**货币类型 */)"
          prop="currency_id"
        >
          <el-select
            v-model="crudQuery.currency_id"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in option2"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          :label="$t('table.agent_name' /**所属代理 */)"
          prop="proxy_name"
        >
          <el-input
            v-model="crudQuery.proxy_name"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
        </el-form-item> -->
        <el-form-item :label="$t('table.agent_name' /**所属代理 */)">
          <el-select
            v-model="crudQuery.proxy_name"
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
              :value="pro.proxy_name"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          :label="$t('table.comp_name' /**所属公司 */)"
          prop="company_name"
        >
          <el-input
            v-model="crudQuery.company_name"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
        </el-form-item> -->
        <el-form-item :label="$t('table.comp_name' /**所属公司 */)">
          <el-select
            v-model="crudQuery.company_name"
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
              :value="company.company_name"
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
        :header-cell-style="filterHeaderColumn"
      >
        <el-table-column
          v-if="getColumnShow('order_id')"
          prop="order_id"
          :label="$t('table.order_number' /**订单号 */)"
          min-width="100"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('company_name')"
          prop="company_name"
          :label="$t('table.comp_name' /**所属公司 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('create_time')"
          prop="create_time"
          :label="$t('table.account_change_time' /**账变时间 */)"
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
          v-if="getColumnShow('username')"
          prop="username"
          :label="$t('table.bet_username' /**用户名 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('proxy_name')"
          prop="proxy_name"
          :label="$t('table.agent_name' /**所属代理 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('money_order_name')"
          prop="money_order_name"
          :label="$t('table.transaction_type' /**账变类型 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('currency_name')"
          prop="currency_name"
          :label="$t('table.money_type' /**货币类型 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('in_amount')"
          prop="in_amount"
          :label="$t('table.income' /**收入 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('convert_in_amount')"
          prop="convert_in_amount"
          :label="$t('table.converted_income' /**换算收入 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('out_amount')"
          prop="out_amount"
          :label="$t('table.expenses' /**支出 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('convert_out_amount')"
          prop="convert_out_amount"
          :label="$t('table.converted_expenses' /**换算支出 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('availablebalance')"
          prop="availablebalance"
          :label="$t('table.balance' /**余额 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('ip')"
          prop="ip"
          :label="$t('table.transaction_ip' /**账变IP */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('other_id')"
          prop="other_id"
          :label="$t('table.third_order' /**三方订单号 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('project_id')"
          prop="project_id"
          :label="$t('lib.invalid_reason_9' /**其他 */)"
          min-width="160"
          align="center"
        >
          <template #header>
            <FilterColumnControl :column-info="columnInfo" />
          </template>
          <template #default="scope">
            {{ scope.row.project_id }}
          </template>
        </el-table-column>
        <template #append>
          <div class="row-line">
            <div class="number0">
              {{ $t("other.this_page")
              }}{{
                toFixedNumber(
                  getNum("convert_in_amount") + getNum("convert_out_amount"),
                )
              }}
            </div>
            <div class="number1" />
            <div class="number1" />
            <div class="number1" />
            <div class="number1">
              {{ `+${toFixedNumber(getNum("convert_in_amount"))}` }}
            </div>
            <div class="number1" />
            <div class="number1">
              {{ toFixedNumber(getNum("convert_out_amount")) }}
            </div>
          </div>
          <div class="row-line">
            <div class="number0">
              {{ $t("other.total")
              }}{{
                toFixedNumber(
                  Number(crudResData.statistics?.sum_convert_in_amount)
                    + Number(crudResData.statistics?.sum_convert_out_amount),
                )
              }}
            </div>
            <div class="number1" />
            <div class="number1" />
            <div class="number1" />
            <div v-if="crudResData" class="number1">
              {{ crudResData.statistics?.sum_convert_in_amount }}
            </div>
            <div class="number1" />
            <div v-if="crudResData" class="number1">
              {{ crudResData.statistics?.sum_convert_out_amount }}
            </div>
          </div>
        </template>
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

<style lang="scss" scoped>
.row-line {
  display: flex;
  height: 63px;
  line-height: 63px;
  border-bottom: 1px solid #363637;
}
.number0 {
  text-align: center;
  min-width: 750px;
  max-width: 750px;
  border-right: 1px solid #363637;
}
.number1 {
  text-align: center;
  min-width: 154px;
  border-right: 1px solid #363637;
}
</style>
