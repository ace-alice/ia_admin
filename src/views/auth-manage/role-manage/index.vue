<!-- suppress JSUnresolvedVariable -->
<route lang="yaml">
name: roleManage
meta:
  title: 角色管理
  constant: false
  layout: true
</route>

<script lang="ts" setup>
import {
  Check,
  DocumentCopy,
  Open,
  Plus,
  Search,
} from '@element-plus/icons-vue'
import { roleStatus } from './hooks/form-options'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import { i18n } from '@/i18n'
import { menuRoleDrawerHandle } from '@/views/auth-manage/role-manage/hooks/menuRoleDrawerHandle'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/auth-manage/role-config'
import { parseTime } from '@/utils/formatTime'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('table.admin_role'),
  crudOptShow: {
    add: true,
    dragAble: false,
    formSize: '80%',
  },
  defaultQuery: {
    role_name: '',
    is_disable: -1,
  },
  crudMethod: { ...Api },
  defaultForm: {
    admin_menu_ids: null,
    admin_role_id: null,
    create_time: null,
    is_disable: 0,
    role_desc: null,
    role_name: '',
    role_sort: 1,
    update_time: null,
  },
  formKey: 'role_id',
  crudTag: 'role:config:',
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

const { proxy }: any = getCurrentInstance()

const defaultProps = reactive({ children: 'children', label: 'menu_name' })

// 分配权限
const {
  saveMenu,
  filterNode,
  menuRoleInfo,
  menuRoleDrawerClose,
  toOpenMenuRoleDrawer,
} = menuRoleDrawerHandle(proxy)
</script>

<template>
  <PageMain :title="$t('router.role-manage')" :has-tool="true" :has-footer="true">
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.role_name')">
          <el-input v-model="crudQuery.role_name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item :label="$t('table.is_disable')">
          <el-select
            v-model="crudQuery.is_disable"
            placeholder="角色状态"
            @change="toQuery"
          >
            <el-option
              v-for="status in roleStatus"
              :key="status.data"
              :label="status.label"
              :value="status.data"
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
        v-loading="queryLoading"
        :data="crudData"
        stripe
        row-key="role_id"
        style="width: 100%; height: 100%"
        border
        resizable
        table-layout="fixed"
      >
        <el-table-column
          prop="role_name"
          :label="$t('table.role_name')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="is_disable"
          :label="$t('table.is_disable')"
          min-width="120"
          align="center"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="Math.random()"
              :init-value="scope.row.is_disable"
              :options="roleStatus"
              :default-param="{
                ids: [scope.row.role_id],
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
          prop="create_time"
          :label="$t('table.create_time')"
          min-width="160"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.create_time">{{ parseTime(scope.row.create_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="update_time"
          :label="$t('table.update_time')"
          min-width="160"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.update_time">{{ parseTime(scope.row.update_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operate')"
          min-width="120"
          align="center"
          fixed="right"
        >
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
                      @click="toDel({ ids: [scope.row.role_id] })"
                    >
                      {{ $t("crud.delete") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.changeMenu"
                      type="info"
                      size="small"
                      @click="toOpenMenuRoleDrawer(scope.row)"
                    >
                      {{ $t("table.menu_assign") }}
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
          label-width="120px"
          class="demo-ruleForm"
          status-icon
          inline
        >
          <el-form-item
            :label="$t('table.role_name')"
            prop="role_name"
            :rules="[
              {
                required: true,
                message: $t('table.role_name') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.role_name"
              :placeholder="$t('table.role_name')"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.role_desc')" prop="role_desc">
            <el-input
              v-model="proxyForm.role_desc"
              :placeholder="$t('table.role_desc')"
              :rows="2"
              type="textarea"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.sort')" prop="role_sort">
            <el-input-number
              v-model="proxyForm.role_sort"
              :step="1"
              :min="0"
              step-strictly
              style="width: 200px"
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
      <el-drawer
        v-model="menuRoleInfo.show"
        :title="$t('table.menu_assign')"
        :size="375"
        direction="rtl"
        :before-close="menuRoleDrawerClose"
      >
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <el-button
                type="primary"
                :loading="menuRoleInfo.saveLoading"
                @click="saveMenu"
              >
                <el-icon><Check /></el-icon> {{ $t("crud.save") }}
              </el-button>
            </div>
          </template>
          <el-tree
            ref="menu"
            v-loading="menuRoleInfo.treeLoading"
            :data="menuRoleInfo.menuTree"
            :props="defaultProps"
            show-checkbox
            accordion
            :expand-on-click-node="false"
            :auto-expand-parent="false"
            check-on-click-node
            node-key="menu_id"
            :filter-node-method="filterNode"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <el-icon v-show="+data.is_btn === 0" style="margin-right: 12px">
                  <DocumentCopy />
                </el-icon>
                <el-icon v-show="+data.is_btn === 1" style="margin-right: 12px">
                  <Open />
                </el-icon>
                <span class="tree-node-label">{{ node.label }}</span>
              </div>
            </template>
          </el-tree>
        </el-card>
      </el-drawer>
    </template>
  </PageMain>
</template>

<style lang="scss" scoped></style>
