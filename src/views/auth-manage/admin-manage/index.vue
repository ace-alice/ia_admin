<!-- suppress JSUnresolvedVariable -->
<!-- suppress JSUnresolvedVariable -->
<route lang="yaml">
name: adminManage
meta:
  title: 操作员管理
  constant: false
  layout: true
</route>

<script lang="ts" setup>
import { HelpFilled, Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { isNot, roleStatus } from './hooks/form-options'
import RoleListHook from './hooks/RoleListHook'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/auth-manage/admin-config'
import { verifyPassword } from '@/utils/toolsValidate'
const i18n = useI18n()

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.t('table.operate_user'),
  crudOptShow: {
    add: true,
    formSize: '80%',
  },
  defaultQuery: {
    is_disable: -1,
    username: '',
    nickname: '',
    phone: null,
    email: null,
  },
  crudMethod: { ...Api },
  defaultForm: {
    admin_id: null,
    role_ids: [],
    username: '',
    nickname: '',
    password: '',
    phone: '',
    email: '',
    avatar_id: '',
    remark: '',
    sort: 1,
    is_disable: 0,
    is_super: 0,
    is_delete: 0,
    login_num: 0,
    login_time: null,
  },
  formKey: 'admin_id',
  crudTag: 'admin:config:',
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
  submitSuccessNotify,
  addEditLoading,
  crudHook,
} = CRUD(defaultCrudOptions)

const { roleList, getRoleList, setRoleName } = RoleListHook()
onMounted(() => {
  getRoleList()
})

const passwordRule = (rule: any, value: any, callback: any) => {
  const tag = crudStatus.add

  if (!value && !tag) {
    return callback()
  }
  if (!verifyPassword(value)) {
    callback(
      new Error(
        '密码必须以字母开头，长度在6~16之间，只能包含字母、数字和下划线',
      ),
    )
  }
  else {
    return callback()
  }
}

function editPassword(row: any) {
  ElMessageBox.prompt('Please input password', i18n.t('table.init_password'), {
    confirmButtonText: i18n.t('crud.submit'),
    cancelButtonText: i18n.t('user.logOutCancel'),
    inputType: 'password',
    inputPattern: /^[a-zA-Z]\w{5,15}$/,
    inputErrorMessage: 'Invalid Password',
  })
    .then(({ value }: any) => {
      Api.initPwd({
        ids: [row.admin_id],
        password: value,
      }).then((res: any) => {
        if (res.code === 1) {
          submitSuccessNotify()
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}
</script>

<template>
  <PageMain :title="$t('router.admin-manage')" :has-tool="true" :has-footer="true">
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.username')" prop="username">
          <el-input
            v-model="crudQuery.username"
            :placeholder="$t('table.username')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.nickname')" prop="nickname">
          <el-input
            v-model="crudQuery.nickname"
            :placeholder="$t('table.nickname')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.phone')" prop="phone">
          <el-input
            v-model="crudQuery.phone"
            :placeholder="$t('table.phone')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.email')" prop="email">
          <el-input
            v-model="crudQuery.email"
            :placeholder="$t('table.email')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.is_disable')" prop="is_disable">
          <el-select
            v-model="crudQuery.is_disable"
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in roleStatus"
              :key="item.data"
              :label="item.label"
              :value="item.data"
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
        row-key="admin_id"
        style="width: 100%; height: 100%"
        border
        resizable
        table-layout="fixed"
      >
        <el-table-column
          prop="username"
          :label="$t('table.operator_name')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="phone"
          :label="$t('table.phone')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="email"
          :label="$t('table.email')"
          min-width="150"
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
              :key="scope.row.username"
              :init-value="scope.row.is_disable"
              :options="roleStatus"
              :default-param="{
                ids: [scope.row.admin_id],
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
          prop="is_super"
          :label="$t('table.is_super')"
          min-width="120"
          align="center"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="Math.random()"
              :init-value="scope.row.is_super"
              :options="isNot"
              :default-param="{
                ids: [scope.row.admin_id],
                is_disable: scope.row.is_super,
              }"
              param-key="is_super"
              :change-fun="changeStatus"
              emit-fun-name="isSuperAdmin"
              :permission="tablePermission.is_super"
            />
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
                      @click="toDel({ ids: [scope.row.admin_id] })"
                    >
                      {{ $t("crud.delete") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.password"
                      type="warning"
                      size="small"
                      :icon="HelpFilled"
                      @click="editPassword(scope.row)"
                    >
                      {{ $t("table.init_password") }}
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
          inline
        >
          <el-form-item
            :label="$t('table.operator_name')"
            prop="username"
            :rules="[
              {
                required: true,
                message: $t('table.operator_name') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.username"
              :placeholder="$t('table.operator_name')"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.nickname')"
            prop="nickname"
            :rules="[
              {
                required: true,
                message: $t('table.nickname') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.nickname"
              :placeholder="$t('table.nickname')"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.admin_role')"
            prop="role_ids"
            :rules="[
              {
                required: true,
                message: $t('table.admin_role') + $t('table.not_empty'),
              },
            ]"
          >
            <el-select
              v-model="proxyForm.role_ids"
              :placeholder="$t('table.admin_role')"
              style="width: 200px"
              multiple
            >
              <el-option
                v-for="role in roleList"
                :key="role.role_id"
                :label="role.role_name"
                :value="String(role.role_id)"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.sort')" prop="sort">
            <el-input-number
              v-model="proxyForm.sort"
              :step="1"
              :min="0"
              step-strictly
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item
            v-if="crudStatus.add === 1"
            :label="$t('table.password')"
            prop="password"
            :rules="[
              {
                validator: passwordRule,
                message:
                  '以字母开头，长度在6~16之间，只能包含字母、数字和下划线',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="proxyForm.password"
              type="password"
              show-password
              :placeholder="$t('table.password')"
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
    </template>
  </PageMain>
</template>

<style lang="scss" scoped></style>
