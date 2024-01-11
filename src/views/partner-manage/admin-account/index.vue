<route lang="yaml">
name: AdminAccount
meta:
  title: 管理员列表
  constant: false
  layout: true
</route>

<script lang="ts" setup name="AdminAccount">
import { Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import { ElOption, ElSelect } from 'element-plus'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import { parseTime } from '@/utils/formatTime'
import { i18n } from '@/i18n'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/partner-manage/admin-account'
import { dictionary } from '@/hooks/lib'
import PromiseSwitch from '@/components/PromiseSwitch/index.vue'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'
import getProxyListHook from '@/hooks/getProxyListHook'
import getCompanyList from '@/hooks/getCompanyList'
import { getLabel } from '@/utils'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.admin-account'),
  crudOptShow: {
    add: true,
    formSize: '1400px',
  },
  defaultQuery: {
    proxy_id: null,
    is_del: null,
    company_id: null,
    username: null,
  },
  crudMethod: { ...Api },
  defaultForm: {
    company_id: null,
    id: null,
    password: null,
    is_del: 0,
    user_id: null,
  },
  crudTag: 'company:manage',
}

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  changeStatus,
  crudStatus,
  toAdd,
  resetCrudStatus,
  dialogVisible,
  submitHandle,
  crudOptShow,
  crudDefaultFormRef,
  proxyForm,
  toEdit,
  reQuery,
  crudHook,
} = CRUD(defaultCrudOptions)

const { proxyList } = getProxyListHook()

const { companyList } = getCompanyList()

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()

const { isDisableOptions, isNot, companyTypeOptions, limitMoneyTypeOptions }
  = dictionary()
</script>

<template>
  <PageMain
    :title="$t('router.admin-account')"
    :has-tool="true"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.is_disable')" prop="is_disable">
          <ElSelect
            v-model="crudQuery.is_del"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
          >
            <ElOption
              v-for="item in isNot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item :label="$t('table.proxy_name' /**所属代理 */)">
          <ElSelect
            v-model="crudQuery.proxy_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <ElOption
              v-for="pro in proxyList"
              :key="pro.id"
              :label="pro.proxy_name"
              :value="pro.id"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item :label="$t('table.company_name')">
          <ElSelect
            v-model="crudQuery.company_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <ElOption
              v-for="company in companyList"
              :key="company.id"
              :label="company.company_name"
              :value="company.id"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item :label="$t('table.username')" prop="username">
          <el-input
            v-model="crudQuery.username"
            :placeholder="$t('table.username')"
            style="width: 200px"
            clearable
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
      <el-button
        v-only="toolPermission.add"
        type="primary"
        :icon="Plus"
        @click="toAdd"
      >
        {{ $t("crud.add") }}
      </el-button>
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
          v-if="getColumnShow('id')"
          prop="id"
          :label="$t('table.number')"
          min-width="60"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('company_name')"
          prop="company_name"
          :label="$t('table.company_name')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('proxy_name')"
          prop="proxy_name"
          :label="$t('table.proxy_name')"
          min-width="160"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('username')"
          prop="username"
          :label="$t('table.username')"
          min-width="160"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('is_admin')"
          prop="is_admin"
          :label="$t('table.is_admin')"
          min-width="120"
          align="center"
        >
          <template #default="scope">
            <el-tag :type="scope.row.is_admin ? 'success' : 'danger'">
              {{ getLabel(+scope.row.is_admin, isNot) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('last_login_time')"
          prop="last_login_time"
          :label="$t('table.last_login_time')"
          min-width="180"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.last_login_time">{{
              parseTime(scope.row.last_login_time)
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('last_login_ip')"
          prop="last_login_ip"
          :label="$t('table.last_login_ip')"
          min-width="160"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('create_username')"
          prop="create_username"
          :label="$t('table.create_name')"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('create_time')"
          prop="create_time"
          :label="$t('table.create_time')"
          min-width="190"
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
          v-if="getColumnShow('update_username')"
          prop="update_username"
          :label="$t('table.action_name')"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('update_time')"
          prop="update_time"
          :label="$t('table.update_time1')"
          min-width="190"
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
          v-if="getColumnShow('is_del')"
          prop="is_del"
          :label="$t('table.is_disable')"
          width="150"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.user_id"
              :init-value="scope.row.is_del"
              :options="isDisableOptions"
              :default-param="{
                user_id: scope.row.user_id,
                is_del: scope.row.is_del,
              }"
              param-key="is_del"
              :change-fun="changeStatus"
              emit-fun-name="isDisable"
              :permission="tablePermission.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operate')"
          width="120"
          align="center"
          fixed="right"
        >
          <template #header>
            <FilterColumnControl :column-info="columnInfo" />
          </template>
          <template #default="scope">
            <span v-some="Object.values(otherPermission)">
              <el-dropdown
                placement="bottom-end"
                :hide-on-click="false"
                trigger="click"
              >
                <el-button type="warning" link>
                  {{ $t("table.operateControl") }}
                </el-button>
                <template #dropdown>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.edit"
                      type="primary"
                      size="small"
                      @click="toEdit(scope.row)"
                    >
                      {{ $t("crud.edit") }}
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
      <el-dialog
        v-model="dialogVisible"
        :title="crudStatus.title"
        :before-close="resetCrudStatus"
        :width="crudOptShow.formSize"
        destroy-on-close
      >
        <el-form
          ref="crudDefaultFormRef"
          :model="proxyForm"
          label-width="160px"
          class="demo-ruleForm"
          inline
        >
          <el-form-item
            :label="$t('table.comp_name')"
            prop="company_id"
            :rules="[
              {
                required: true,
                message: $t('table.comp_name') + $t('table.not_empty'),
              },
            ]"
          >
            <ElSelect
              v-model="proxyForm.company_id"
              style="width: 220px"
              popper-class="user-select"
              :placeholder="$t('table.comp_name')"
              filterable
              clearable
            >
              <ElOption
                v-for="company in companyList"
                :key="company.id"
                :label="company.company_name"
                :value="company.id"
              />
            </ElSelect>
          </el-form-item>
          <el-form-item
            :label="$t('table.username')"
            prop="username"
            :rules="[
              {
                required: true,
                message: $t('table.username') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.username"
              :placeholder="$t('table.username')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.password')"
            prop="password"
            :rules="[
              {
                required: true,
                message: $t('table.password') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.password"
              :placeholder="$t('table.password')"
              style="width: 220px"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item :label="$t('table.is_disable')" prop="is_del">
            <ElSelect
              v-model="proxyForm.is_del"
              style="width: 220px"
              popper-class="user-select"
              :placeholder="$t('lib.is_disable')"
            >
              <ElOption
                v-for="item in isNot"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="resetCrudStatus">
              {{ $t("crud.cancel") }}
            </el-button>
            <el-button type="primary" @click="submitHandle">
              {{ $t("crud.sure") }}
            </el-button>
          </span>
        </template>
      </el-dialog>
    </template>
  </PageMain>
</template>
