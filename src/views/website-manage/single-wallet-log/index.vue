<route lang="yaml">
name: SingleWalletLog
meta:
  title: 单一钱包记录
  constant: false
  layout: true
</route>

<script lang="ts" setup name="SingleWalletLog">
import { Edit, Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/website-manage/single-Wallet-log'
import { i18n } from '@/i18n'
import getAllOrderTypeHook from '@/hooks/getAllOrderTypeHook'
import getCompanyList from '@/hooks/getCompanyList'
import getCurrencyTypeHook from '@/hooks/getCurrencyTypeHook'
import { parseTime } from '@/utils/formatTime'
import { dictionary } from '@/hooks/lib'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.single-Wallet-log'),
  crudOptShow: {
    add: true,
    formSize: '50%',
  },
  defaultQuery: {
    status: null,
    type: null,
    company_id: null,
    currency_id: null,
    order_type: null,
    third_order_id: null,
    project_id: null,
    username: null,
    create_time_start: dayjs().subtract(2, 'day').startOf('date').unix(),
    create_time_end: dayjs().endOf('date').unix(),
  },
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'single:wallet:',
}

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  toAdd,
  reQuery,
  crudSetQueryKey,
} = CRUD(defaultCrudOptions)

const { allOrderTypeList } = getAllOrderTypeHook()

const { companyList } = getCompanyList()

const { currencyList } = getCurrencyTypeHook()

const { orderTypeOptions, orderStatusOptions, getLabel } = dictionary()

const router = useRouter()

function toProjectList(project_id: string) {
  const routePage = router.resolve({
    name: 'betList',
    query: {
      project: project_id,
    },
  })
  window.open(routePage.href, '_blank')
}

const open = (form: any) => {
  const { id, status } = form
  const statusTitle = [
    i18n.global.t('table.status_to_fail'),
    i18n.global.t('table.status_to_success'),
    i18n.global.t('table.requery_status'),
  ]
  const message
    = status === 3
      ? i18n.global.t('table.requery_to_message')
      : i18n.global.t('table.status_to_message')
  ElMessageBox.confirm(message, statusTitle[status], {
    confirmButtonText: i18n.global.t('crud.sure'),
    cancelButtonText: i18n.global.t('crud.cancel'),
    type: 'warning',
  }).then(() => {
    if (status === 3) {
      const params = {
        ids: [id],
      }
      Api.updateMoney(params).then((res: any) => {
        if (res && res.code === 1) {
          ElMessage.success(res.msg)
          refresh()
        }
      })
    }
    else {
      const params = {
        id,
        status,
      }
      Api.updateStatus(params).then((res: any) => {
        if (res && res.code === 1) {
          ElMessage.success(res.msg)
          refresh()
        }
      })
    }
  })
}
</script>

<template>
  <PageMain
    :title="$t('router.single-Wallet-log')"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.status')">
          <el-select
            v-model="crudQuery.status"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="company in orderStatusOptions"
              :key="company.value"
              :label="company.label"
              :value="company.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.order_type')">
          <el-select
            v-model="crudQuery.type"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="company in orderTypeOptions"
              :key="company.value"
              :label="company.label"
              :value="company.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.company_name')">
          <el-select
            v-model="crudQuery.company_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="company in companyList"
              :key="company.id"
              :label="company.company_name"
              :value="company.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.money_type')">
          <el-select
            v-model="crudQuery.currency_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="currency in currencyList"
              :key="currency.id"
              :label="currency.name"
              :value="currency.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.transaction_type')">
          <el-select
            v-model="crudQuery.order_type"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="currency in allOrderTypeList"
              :key="currency.id"
              :label="currency.label"
              :value="currency.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.order_number')" prop="order_number">
          <el-input
            v-model="crudQuery.third_order_id"
            :placeholder="$t('table.order_number')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.bet_note_number')"
          prop="bet_note_number"
        >
          <el-input
            v-model="crudQuery.project_id"
            :placeholder="$t('table.bet_note_number')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.username')" prop="username">
          <el-input
            v-model="crudQuery.username"
            :placeholder="$t('table.username')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.create_time')">
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
    <template #pageTool>
      <!-- v-only="toolPermission.add" -->
      <el-button type="primary" :icon="Plus" @click="toAdd">
        {{ $t("crud.add") }}
      </el-button>
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
          prop="third_order_id"
          :label="$t('table.order_number')"
          min-width="240"
          align="center"
        />
        <el-table-column
          prop="amount"
          :label="$t('other.amount')"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="currency_name"
          :label="$t('table.money_type')"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="type"
          :label="$t('table.order_type')"
          min-width="100"
          align="center"
        >
          <template #default="scope">
            {{ getLabel(+scope.row.type, orderTypeOptions) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="project_id"
          :label="$t('table.bet_note_number')"
          min-width="170"
          align="center"
        >
          <template #default="scope">
            <el-link
              v-if="scope.row.project_id"
              type="primary"
              @click="toProjectList(scope.row.project_id)"
            >
              {{ scope.row.project_id }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          :label="$t('table.desc')"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="error"
          :label="$t('table.desc_err')"
          min-width="200"
          align="center"
        >
          <template #default="scope">
            <div v-if="scope.row.error">
              {{ scope.row.error }}
            </div>
            <div v-else>
              --
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('table.status')"
          min-width="100"
          align="center"
        >
          <template #default="scope">
            <el-tag :type="+scope.row.status ? 'success' : 'danger'">
              {{ getLabel(+scope.row.status, orderStatusOptions) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          :label="$t('table.username')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="company_name"
          :label="$t('table.company_name')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="create_time"
          :label="$t('table.create_time')"
          min-width="180"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.create_time">{{
              parseTime(scope.row.create_time)
            }}</span>
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
            <span v-if="scope.row.update_time">{{
              parseTime(scope.row.update_time)
            }}</span>
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
            <span v-if="scope.row.update_username">{{
              scope.row.update_username
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operate')"
          width="120"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <!-- v-some="Object.values(otherPermission)" -->
            <span>
              <el-dropdown
                v-if="+scope.row.order_type !== 11"
                placement="bottom-end"
                :hide-on-click="false"
                trigger="click"
              >
                <el-button type="warning" link>
                  {{ $t("table.operateControl") }}
                </el-button>
                <template #dropdown>
                  <el-dropdown-item>
                    <!-- v-only="otherPermission.edit" -->
                    <el-button
                      v-if="!scope.row.status"
                      type="primary"
                      @click="open({ id: scope.row.id, status: 3 })"
                    >
                      {{ $t("table.requery_status") }}
                    </el-button>
                    <el-button
                      v-if="!scope.row.status"
                      type="success"
                      @click="open({ id: scope.row.id, status: 1 })"
                    >
                      {{ $t("table.status_to_success") }}
                    </el-button>
                    <el-button
                      v-if="scope.row.status"
                      type="danger"
                      @click="open({ id: scope.row.id, status: 0 })"
                    >
                      {{ $t("table.status_to_fail") }}
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
  </PageMain>
</template>
