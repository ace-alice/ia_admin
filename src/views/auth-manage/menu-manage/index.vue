<!-- suppress JSUnresolvedVariable -->
<route lang="yaml">
name: menuManage
meta:
  title: 菜单管理
  constant: false
  layout: true
</route>

<script lang="ts" setup>
import { Plus, Search } from '@element-plus/icons-vue'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import { i18n } from '@/i18n'
import visibleColumn from '@/hooks/visibleColumn'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/auth-manage/menu-manage'
import { dictionary } from '@/hooks/lib'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('table.menu'),
  crudOptShow: {
    add: true,
    formSize: '80%',
  },
  defaultQuery: {
    is_un_auth: -1,
    menu_name: '',
    menu_url: '',
    page_url: '',
    is_disable: -1,
    is_un_login: -1,
    is_btn: -1,
    is_cache: -1,
    is_log: -1,
  },
  crudMethod: { ...Api },
  defaultForm: {
    menu_id: null,
    menu_pid: null,
    menu_name: null,
    menu_url: null,
    page_url: null,
    menu_sort: 1,
    is_btn: 0,
    is_un_auth: 0,
    is_un_login: 0,
    is_disable: 0,
    is_log: 0,
  },
  formKey: 'menu_id',
  crudTag: 'menu:config:',
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
  toDel,
  addEditLoading,
} = CRUD(defaultCrudOptions)

const { isNeedOptions, getLabel, isDisableOptions } = dictionary()

const crudDataIsMenu = computed(() => {
  return crudData.value.filter((menu: any) => {
    return !+menu.is_btn
  })
})

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()
</script>

<template>
  <PageMain :title="$t('router.menu-manage')" :has-tool="true" :has-footer="true">
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.menu_name')">
          <el-input
            v-model="crudQuery.menu_name"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.menu_url')">
          <el-input
            v-model="crudQuery.menu_url"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.page_url')">
          <el-input
            v-model="crudQuery.page_url"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.is_unauth')">
          <el-select
            v-model="crudQuery.is_un_auth"
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in isNeedOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_disable')">
          <el-select
            v-model="crudQuery.is_disable"
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in isDisableOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_unlogin')">
          <el-select
            v-model="crudQuery.is_un_login"
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in isNeedOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.button_id')">
          <el-select
            v-model="crudQuery.is_btn"
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in isNeedOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_cache')">
          <el-select
            v-model="crudQuery.is_cache"
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in isNeedOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_log')">
          <el-select
            v-model="crudQuery.is_log"
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in isNeedOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
        row-key="role_id"
        style="width: 100%; height: 100%"
        border
        resizable
        :header-cell-style="filterHeaderColumn"
        table-layout="fixed"
      >
        <el-table-column
          v-if="getColumnShow('menu_sort')"
          prop="menu_sort"
          :label="$t('table.sort')"
          min-width="120"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('menu_name')"
          prop="menu_name"
          :label="$t('table.menu_name')"
          min-width="160"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.is_btn">{{ scope.row.menu_name }}</span>
            <span v-else>{{ scope.row.menu_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('button_id')"
          prop="button_id"
          :label="$t('table.button_id')"
          min-width="80"
          align="center"
        >
          <template #default="scope">
            <el-tag :type="scope.row.is_btn ? 'warning' : 'info'" effect="dark">
              {{ scope.row.is_btn ? $t("table.auth") : $t("table.menu") }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('menu_url')"
          prop="menu_url"
          :label="$t('table.menu_url')"
          min-width="180"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('page_url')"
          prop="page_url"
          :label="`${$t('table.page_url')}(${$t('table.is_btn')})`"
          min-width="300"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('is_unauth')"
          prop="is_unauth"
          :label="$t('table.is_unauth')"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.menu_name"
              :init-value="scope.row.is_un_auth"
              :options="isNeedOptions"
              :default-param="{
                ids: [scope.row.menu_id],
                is_un_auth: scope.row.is_un_auth,
              }"
              param-key="is_un_auth"
              :change-fun="changeStatus"
              emit-fun-name="isUnAuth"
              :permission="tablePermission.is_un_auth"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('is_unlogin')"
          prop="is_unlogin"
          :label="$t('table.is_unlogin')"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.button_id"
              :init-value="scope.row.is_un_login"
              :options="isNeedOptions"
              :default-param="{
                ids: [scope.row.menu_id],
                is_un_login: scope.row.is_un_login,
              }"
              param-key="is_un_login"
              :change-fun="changeStatus"
              emit-fun-name="isUnLogin"
              :permission="tablePermission.is_un_login"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('is_cache')"
          prop="is_cache"
          :label="$t('table.is_cache')"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <el-tag type="warning" effect="plain">
              {{ getLabel(scope.row.is_cache, isNeedOptions) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('is_log')"
          prop="is_log"
          :label="$t('table.is_log')"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <el-tag type="warning" effect="plain">
              {{ getLabel(scope.row.is_log || 0, isNeedOptions) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('is_disable')"
          prop="is_disable"
          :label="$t('table.is_disable')"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="Math.random()"
              :init-value="scope.row.is_disable"
              :options="isNeedOptions"
              :default-param="{
                ids: [scope.row.menu_id],
                is_disable: scope.row.is_disable,
              }"
              param-key="is_disable"
              :change-fun="changeStatus"
              emit-fun-name="isDisable"
              :permission="tablePermission.is_disable"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operate')"
          min-width="120"
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
                  {{ $t("table.operate") }}
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
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.del"
                      type="danger"
                      size="small"
                      @click="toDel({ ids: [scope.row.menu_id] })"
                    >
                      {{ $t("crud.delete") }}
                    </el-button>
                  </el-dropdown-item>
                </template>
              </el-dropdown>
            </span>
          </template>
        </el-table-column>
      </el-table>
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
          label-width="120px"
          class="demo-ruleForm"
          inline
        >
          <el-form-item :label="$t('table.button_id')" prop="is_btn">
            <el-switch
              v-model="proxyForm.is_btn"
              style="width: 200px"
              inline-prompt
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="Y"
              inactive-text="N"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item :label="$t('table.menu_pid')" prop="menu_pid">
            <el-cascader
              v-model="proxyForm.menu_pid"
              style="width: 200px"
              clearable
              :props="{
                checkStrictly: false,
                value: 'menu_id',
                label: 'menu_name',
                emitPath: false,
              }"
              :options="crudDataIsMenu"
            >
              <template #default="{ node, data }">
                <span>{{ data.menu_name }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </template>
            </el-cascader>
          </el-form-item>
          <el-form-item
            :label="$t('table.menu_name')"
            prop="menu_name"
            :rules="[
              {
                required: true,
                message: $t('table.menu_name') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.menu_name"
              :placeholder="$t('table.menu_name')"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.menu_url')" prop="menu_url">
            <el-input
              v-model="proxyForm.menu_url"
              :placeholder="$t('table.menu_url')"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="
              proxyForm.is_btn ? $t('table.is_btn') : $t('table.page_url')
            "
            prop="page_url"
            :rules="[
              {
                required: true,
                message: $t('table.page_url') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.page_url"
              :placeholder="
                proxyForm.is_btn ? $t('table.is_btn') : $t('table.page_url')
              "
              style="width: 200px"
              clearable
            />
          </el-form-item>

          <el-form-item :label="$t('table.is_cache')" prop="is_cache">
            <el-switch
              v-model="proxyForm.is_cache"
              style="width: 200px"
              inline-prompt
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="Y"
              inactive-text="N"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item :label="$t('table.is_log')" prop="is_log">
            <el-switch
              v-model="proxyForm.is_log"
              style="width: 200px"
              inline-prompt
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="Y"
              inactive-text="N"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>

          <el-form-item :label="$t('table.sort')" prop="menu_sort">
            <el-input-number
              v-model="proxyForm.menu_sort"
              style="width: 200px"
              :step="1"
              :min="0"
              step-strictly
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

<style lang="scss" scoped></style>
