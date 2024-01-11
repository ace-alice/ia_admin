<route lang="yaml">
name: userGroup
meta:
  title: 用户组
  constant: false
  layout: true
  </route>

<script lang="ts" setup name="userGroup">
import { Plus, RefreshRight, Search } from '@element-plus/icons-vue'
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
import Api from '@/api/user-manage/user-group'
import PromiseSwitch from '@/components/PromiseSwitch/index.vue'
import { dictionary } from '@/hooks/lib'
import { getLabel } from '@/utils'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.user-group'),
  crudOptShow: {
    add: true,
    formSize: '800px',
  },
  defaultQuery: {
    name: null,
  },
  crudMethod: { ...Api },
  defaultForm: {
    id: null,
    name: '',
    remark: '',
    status: 0,
    limit_type: null,
    limit_money: null,
    create_user: null,
    create_user_name: '',
    create_time: null,
  },
  crudTag: 'user:group:',
}

const { isNot, userLimitTypeOptions } = dictionary()

function getLimitMoney(limitType: number, limitMoney: string) {
  const limitMoneyTemp = Number(limitMoney) || 0
  if (limitType === 1) {
    return `${limitMoneyTemp}%`
  }
  else {
    return limitMoneyTemp
  }
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
  crudHook,
  reQuery,
} = CRUD(defaultCrudOptions)

crudHook.beforeToCU = (form: any) => {
  form.limit_money = +form.limit_money || 0
  return true
}
</script>

<template>
  <PageMain :title="$t('router.user-group')" :has-tool="true" :has-footer="true">
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.user_group_name')" prop="name">
          <el-input
            v-model="crudQuery.name"
            :placeholder="$t('table.user_group_name')"
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
            {{ $t('crud.search') }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="RefreshRight"
            :loading="queryLoading"
            @click="reQuery"
          >
            {{ $t('crud.reset') }}
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
        {{ $t('crud.add') }}
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
      >
        <el-table-column
          prop="id"
          :label="$t('table.id')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="name"
          :label="$t('table.user_group_name')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="limit_type"
          :label="$t('table.limit_type')"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <div>
              {{ getLabel(+scope.row.limit_type, userLimitTypeOptions) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="limit_money"
          :label="$t('table.limit_money')"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <div>
              {{ getLimitMoney(+scope.row.limit_type, scope.row.limit_money) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_user_name"
          :label="$t('table.create_name')"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <el-tooltip
              :content="`<strong>${parseTime(scope.row.create_time)}</strong>`"
              placement="top-start"
              raw-content
            >
              <span>{{ scope.row.create_user_name }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.is_disable')"
          width="150"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.id"
              :init-value="scope.row.status"
              :options="isNot"
              :default-param="{
                id: scope.row.id,
                status: scope.row.status,
              }"
              param-key="status"
              :change-fun="changeStatus"
              emit-fun-name="isDisable"
              :permission="tablePermission.is_disable"
            />
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('table.operate')"
          width="120"
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
                  {{ $t('table.operateControl') }}
                </el-button>
                <template #dropdown>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.edit"
                      type="primary"
                      size="small"
                      @click="toEdit(scope.row)"
                    >
                      {{ $t('crud.edit') }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.del"
                      type="danger"
                      size="small"
                      @click="toDel({ id: scope.row.id })"
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
            :label="$t('table.user_group_name')"
            prop="name"
            :rules="[
              {
                required: true,
                message: $t('table.user_group_name') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.name"
              :placeholder="$t('table.user_group_name')"
              style="width: 60%"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.limit_type')"
            prop="limit_type"
            :rules="[
              {
                required: true,
                message: $t('table.limit_type') + $t('table.not_empty'),
              },
            ]"
          >
            <el-select
              v-model="proxyForm.limit_type"
              style="width: 60%"
              popper-class="user-select"
              :placeholder="$t('table.limit_type')"
              clearable
              filterable
              @change="proxyForm.limit_money = null"
            >
              <el-option
                v-for="item in userLimitTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.limit_money')"
            prop="limit_money"
            :rules="[
              {
                required: true,
                message: $t('table.limit_money') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.limit_money"
              type="number"
              :placeholder="$t('table.limit_money')"
              style="width: 60%"
              clearable
            >
              <template v-if="+proxyForm.limit_type === 1" #append>
                %
              </template>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('table.remark')" prop="remark">
            <el-input
              v-model="proxyForm.remark"
              :placeholder="$t('table.remark')"
              :rows="4"
              type="textarea"
              style="width: 60%"
              clearable
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="resetCrudStatus">
              {{ $t('crud.cancel') }}
            </el-button>
            <el-button type="primary" @click="submitHandle">
              {{ $t('crud.sure') }}
            </el-button>
          </span>
        </template>
      </el-dialog>
    </template>
  </PageMain>
</template>

  <style lang="scss" scoped>
  .el-dialog__body{
    .el-form-item{
      width: 100%;
    }
  }
  </style>
