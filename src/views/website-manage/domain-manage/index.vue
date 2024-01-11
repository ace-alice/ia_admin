<route lang="yaml">
name: DomainManage
meta:
  title: 币种列表
  constant: false
  layout: true
    </route>

<script lang="ts" setup name="DomainManage">
import { Edit, Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/website-manage/domain-manage'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'
import { i18n } from '@/i18n'
import { dictionary } from '@/hooks/lib'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.domain-manage'),
  crudOptShow: {
    add: true,
    formSize: '50%',
  },
  defaultQuery: {
    domain: null,
    type: null,
    status: null,
  },
  crudMethod: { ...Api },
  defaultForm: {
    id: null,
    domain: null,
    status: 1,
    type: 0,
    note: null,
    create_time: null,
    create_user: null,
    update_time: null,
    update_user: null,
    type_name: null,
    enable_name: null,
    create_username: null,
    update_username: null,
  },
  crudTag: 'currency:list:',
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
} = CRUD(defaultCrudOptions)

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
      = visibleColumn()

const { companyTypeOptions, isDisableReseverOptions } = dictionary()
</script>

<template>
  <PageMain
    :title="$t('router.domain-manage')"
    :has-tool="true"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.domain')">
          <el-input
            v-model="crudQuery.domain"
            :placeholder="$t('table.domain')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
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
              v-for="currency in isDisableReseverOptions"
              :key="currency.value"
              :label="currency.label"
              :value="currency.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.type')">
          <el-select
            v-model="crudQuery.type"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="currency in companyTypeOptions"
              :key="currency.value"
              :label="currency.label"
              :value="currency.value"
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
          min-width="80"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('domain')"
          prop="domain"
          :label="$t('table.domain')"
          min-width="200"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('type')"
          prop="type_name"
          :label="$t('table.type')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('status')"
          prop="status"
          :label="$t('table.status')"
          width="240"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.id"
              :init-value="scope.row.status"
              :options="isDisableReseverOptions"
              :default-param="{
                id: scope.row.id,
                status: scope.row.status,
              }"
              param-key="status"
              :change-fun="changeStatus"
              emit-fun-name="updateStatus"
              :permission="tablePermission.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operate')"
          width="240"
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
      >
        <el-form
          ref="crudDefaultFormRef"
          :model="proxyForm"
          label-width="160px"
          class="demo-ruleForm"
          inline
        >
          <el-form-item
            :label="$t('table.domain')"
            prop="domain"
            :rules="[
              {
                required: true,
                message: $t('table.domain') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.domain"
              :placeholder="$t('table.domain')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.status')">
            <el-select
              v-model="proxyForm.status"
              style="width: 220px"
              :placeholder="$t('lib.all')"
              popper-class="user-select"
              filterable
            >
              <el-option
                v-for="currency in isDisableReseverOptions"
                :key="currency.value"
                :label="currency.label"
                :value="currency.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.type')">
            <el-select
              v-model="proxyForm.type"
              style="width: 220px"
              :placeholder="$t('lib.all')"
              popper-class="user-select"
              filterable
            >
              <el-option
                v-for="currency in companyTypeOptions"
                :key="currency.value"
                :label="currency.label"
                :value="currency.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.remark')"
            prop="note"
          >
            <el-input
              v-model="proxyForm.note"
              :placeholder="$t('table.remark')"
              style="width: 220px"
              :autosize="{ minRows: 2, maxRows: 6 }"
              type="textarea"
            />
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
