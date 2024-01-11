<route lang="yaml">
name: BillWallet
meta:
  title: 账单钱包列表
  constant: false
  layout: true
</route>

<script lang="ts" setup name="BillWallet">
import { RefreshRight, Search } from '@element-plus/icons-vue'
import { otherPermission } from './hooks/permission'
import WalletLogList from './components/WalletLogList.vue'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/financial-manage/bill-wallet'
import { i18n } from '@/i18n'
import { dictionary } from '@/hooks/lib'
import getProxyListHook from '@/hooks/getProxyListHook'
import getCompanyList from '@/hooks/getCompanyList'
import { parseTime } from '@/utils/formatTime'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('crud.modify_amount'),
  defaultQuery: {
    type: null,
    status: null,
    proxy_id: null,
    company_name: null,
  },
  crudOptShow: {
    formSize: '800px',
  },
  defaultForm: {
    id: null,
    operate_type: 0,
    money: null,
    note: null,
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
  toEdit,
  addEditLoading,
  proxyForm,
  dialogVisible,
  crudStatus,
  resetCrudStatus,
  submitHandle,
  crudOptShow,
  crudDefaultFormRef,
} = CRUD(defaultCrudOptions)

const { proxy }: any = getCurrentInstance()

const { proxyList } = getProxyListHook()
const { companyList } = getCompanyList()
const { isNot, walletTypeOptions, orderTypeOptions, getLabel } = dictionary()

function toShowLog(row: any) {
  proxy.mittBus.emit('getLogListBus', {
    id: +row.id,
    title: `_${getLabel(+row.type, walletTypeOptions.value)}_${
      +row.type === 0 ? row.company_name : row.proxy_name
    }`,
  })
}
</script>

<template>
  <PageMain
    :title="$t('router.bill-wallet')"
    :has-add="false"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery">
        <el-form-item :label="$t('table.wallet_type')">
          <el-select
            v-model="crudQuery.type"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="pro in walletTypeOptions"
              :key="pro.value"
              :label="pro.label"
              :value="pro.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_status_deal')">
          <el-select
            v-model="crudQuery.status"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="pro in isNot"
              :key="pro.value"
              :label="pro.label"
              :value="pro.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.proxy_name')">
          <el-select
            v-model="crudQuery.proxy_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            filterable
            clearable
          >
            <el-option
              v-for="pro in proxyList"
              :key="pro.id"
              :label="pro.proxy_name"
              :value="pro.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.comp_name')">
          <el-select
            v-model="crudQuery.company_name"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            filterable
            clearable
          >
            <el-option
              v-for="pro in companyList"
              :key="pro.id"
              :label="pro.company_name"
              :value="pro.company_name"
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
          prop="proxy_name"
          :label="$t('table.proxy_name')"
          width="140"
          align="center"
        />
        <el-table-column
          prop="company_name"
          :label="$t('table.company_name')"
          min-width="140"
          align="center"
        />
        <el-table-column
          prop="type_name"
          :label="$t('table.wallet_type')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="status_name"
          :label="$t('table.is_status_deal')"
          min-width="120"
          align="center"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.status_name">
              {{
                scope.row.status_name
              }}
            </el-tag>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          :label="$t('other.amount')"
          min-width="140"
          align="center"
        />
        <el-table-column
          prop="update_admin_name"
          :label="$t('table.update_people')"
          min-width="100"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.update_admin_name">{{
              scope.row.update_admin_name
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="update_time"
          :label="$t('table.update_time1')"
          min-width="160"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.update_time">{{
              parseTime(scope.row.update_time)
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operate')"
          min-width="120"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <span>
              <el-dropdown
                placement="bottom-end"
                :hide-on-click="false"
                trigger="click"
              >
                <el-button type="warning" link>
                  {{ $t("table.operate") }}
                </el-button>
                <template #dropdown>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.change"
                      type="primary"
                      size="small"
                      @click="toEdit(scope.row)"
                    >
                      {{ $t("table.cash_adjust") }}
                    </el-button>
                    <el-button
                      type="primary"
                      size="small"
                      @click="toShowLog(scope.row)"
                    >
                      {{ $t("table.show_log") }}
                    </el-button>
                  </el-dropdown-item>
                </template>
              </el-dropdown>
            </span>
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
    <template #other>
      <WalletLogList />
      <el-dialog
        v-model="dialogVisible"
        :title="crudStatus.title"
        :before-close="resetCrudStatus"
        :width="crudOptShow.formSize"
      >
        <el-form
          ref="crudDefaultFormRef"
          :model="proxyForm"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item
            :label="$t('other.amount')"
          >
            <el-input
              v-model.number="proxyForm.amount"
              placeholder="Please input"
              style="width: 550px"
              disabled
            />
          </el-form-item>
          <el-form-item
            :key="proxyForm.operate_type"
            :label="$t('crud.modify_amount')"
            prop="money"
            :rules="[
              {
                required: true,
                message: $t('other.amount') + $t('table.not_empty'),
              },
              {
                min: 0.01,
                message: `${$t('other.amount')} is illegal`,
                trigger: ['change', 'blur'],
              },
            ]"
          >
            <el-input
              v-model.number="proxyForm.money"
              placeholder="Please input"
              type="number"
              style="width: 550px"
            >
              <template #prepend>
                <el-select
                  v-model="proxyForm.operate_type"
                  style="width: 160px"
                  popper-class="user-select"
                >
                  <el-option
                    v-for="order in orderTypeOptions"
                    :key="order.value"
                    :label="order.label"
                    :value="order.value"
                  />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.remark')"
            prop="note"
            :rules="[
              {
                required: true,
                message: $t('table.remark') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.note"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              style="width: 550px"
              :placeholder="$t('table.remark')"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button :disabled="addEditLoading" @click="resetCrudStatus">{{
              $t("crud.cancel")
            }}</el-button>
            <el-button
              type="primary"
              :loading="addEditLoading"
              @click="submitHandle"
            >
              {{ $t("crud.sure") }}
            </el-button>
          </span>
        </template>
      </el-dialog>
    </template>
  </PageMain>
</template>
