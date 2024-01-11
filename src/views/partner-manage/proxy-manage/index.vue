<route lang="yaml">
name: ProxyManage
meta:
  title: 代理管理
  constant: false
  layout: true
</route>

<script lang="ts" setup name="ProxyManage">
import { Edit, Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import { ElInput, ElMessageBox, ElOption, ElSelect } from 'element-plus'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import AdminAccountCom from './components/AdminAccount.vue'
import { parseTime } from '@/utils/formatTime'
import { i18n } from '@/i18n'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/partner-manage/proxy-manage'
import { dictionary } from '@/hooks/lib'
import PromiseSwitch from '@/components/PromiseSwitch/index.vue'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'
import getProxyListHook from '@/hooks/getProxyListHook'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.proxy-manage'),
  crudOptShow: {
    add: true,
    formSize: '1400px',
  },
  defaultQuery: {
    proxy_id: null,
    is_del: null,
    proxy_code: null,
    proxy_account: null,
  },
  crudMethod: { ...Api },
  defaultForm: {
    id: null,
    config_arr_temp: [
      {
        amount: 0,
        points: null,
      },
      {
        amount: 5000000,
        points: null,
      },
      {
        amount: 10000000,
        points: null,
      },
    ],
    create_time: null,
    create_user: null,
    create_username: null,
    enable_name: null,
    is_del: 0,
    proxy_code: null,
    proxy_name: null,
    receipt_config: '',
    receipt_config_name: null,
    receipt_type: 0,
    update_time: null,
    update_user: null,
    update_username: null,
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

crudHook.beforeToEdit = (form: any) => {
  Object.assign(proxyForm, {
    config_arr_temp: JSON.parse(form.receipt_config),
  })
  return true
}

crudHook.beforeToAdd = () => {
  Object.assign(proxyForm, {
    config_arr_temp: [
      {
        amount: 0,
        points: null,
      },
      {
        amount: 5000000,
        points: null,
      },
      {
        amount: 10000000,
        points: null,
      },
    ],
  })
  return true
}

crudHook.beforeValidateCU = (form: any) => {
  form.config_arr = JSON.stringify(form.config_arr_temp)
  return true
}

const { proxyList } = getProxyListHook()

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()

const { isDisableOptions, isNot, receiptConfigOptions } = dictionary()

function editProxyName(row: any) {
  const isLoading = ref(false)
  const matchLevelForm = reactive<any>({
    id: null,
    proxy_code: '',
  })
  Object.assign(matchLevelForm, {
    id: +row.id,
    proxy_code: row.proxy_code,
  })
  ElMessageBox({
    title: `${i18n.global.t('crud.edit')}${i18n.global.t('table.proxy_code')}`,
    showCancelButton: true,
    beforeClose: (action, instance, done) => {
      if (action === 'cancel') {
        done()
      }
      if (action === 'confirm') {
        if (isLoading.value) {
          return
        }
        isLoading.value = true
        Api.edit(matchLevelForm)
          .then((res: any) => {
            if (+res.code === 1) {
              row.proxy_code = matchLevelForm.proxy_code
              done()
            }
          })
          .finally(() => {
            setTimeout(() => {
              isLoading.value = false
            }, 500)
          })
      }
    },
    // Should pass a function if VNode contains dynamic props
    message: () =>
      h(ElInput, {
        'modelValue': matchLevelForm.proxy_code,
        'onUpdate:modelValue': (val: string) => {
          matchLevelForm.proxy_code = val
        },
      }),
  })
}
</script>

<template>
  <PageMain
    :title="$t('router.proxy-manage')"
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
        <el-form-item :label="$t('table.proxy_code')" prop="proxy_code">
          <ElInput
            v-model="crudQuery.proxy_code"
            :placeholder="$t('table.proxy_code')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.proxy_account')" prop="proxy_account">
          <ElInput
            v-model="crudQuery.proxy_account"
            :placeholder="$t('table.proxy_account')"
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
          type="expand"
          width="60"
          align="center"
        >
          <template #default="scope">
            <AdminAccountCom :proxy-id="scope.row.id" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('id')"
          prop="id"
          :label="$t('table.number')"
          min-width="60"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('proxy_name')"
          prop="proxy_name"
          :label="$t('table.proxy_name')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('proxy_code')"
          prop="proxy_code"
          :label="$t('table.proxy_code')"
          min-width="100"
          align="center"
        >
          <template #default="scope">
            <span style="margin-right: 12px">{{ scope.row.proxy_code }}</span>
            <!-- <el-button
              size="small"
              type="primary"
              :icon="Edit"
              circle
              @click="editProxyName(scope.row)"
            /> -->
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('receipt_config_name')"
          prop="receipt_config_name"
          :label="$t('table.receipt_config_name')"
          min-width="100"
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
              :key="scope.row.id"
              :init-value="scope.row.is_del"
              :options="isDisableOptions"
              :default-param="{
                id: scope.row.id,
                del: scope.row.is_del,
              }"
              param-key="del"
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
            :label="$t('table.proxy_name')"
            prop="proxy_name"
            :rules="[
              {
                required: true,
                message: $t('table.proxy_name') + $t('table.not_empty'),
              },
            ]"
          >
            <ElInput
              v-model="proxyForm.proxy_name"
              :placeholder="$t('table.proxy_name')"
              style="width: 220px"
              clearable
            />
            <br>
            <div
              style="
                position: absolute;
                line-height: 16px;
                top: -36px;
                color: red;
              "
            >
              一经保存，不可修改
            </div>
          </el-form-item>
          <el-form-item
            :label="$t('table.proxy_code')"
            prop="proxy_code"
          >
            <ElInput
              v-model="proxyForm.proxy_code"
              :placeholder="$t('table.proxy_code')"
              style="width: 220px"
              clearable
            />
            <div
              style="
                position: absolute;
                line-height: 16px;
                top: -36px;
                color: red;
              "
            >
              字母跟数字组合，长度最大20
            </div>
          </el-form-item>
          <el-form-item
            :label="`${$t('table.receipt_config_name')}`"
            prop="receipt_type"
          >
            <el-radio-group
              v-model="proxyForm.receipt_type"
              style="width: 220px"
            >
              <el-radio-button
                v-for="item in receiptConfigOptions"
                :key="item.value"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('table.is_disable')" prop="is_del">
            <el-radio-group v-model="proxyForm.is_del" style="width: 220px">
              <el-radio-button
                v-for="item in isNot"
                :key="item.value"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-table
            :data="proxyForm.config_arr_temp"
            style="width: 100%; width: 1200px"
            border
          >
            <el-table-column
              :label="$t('table.config_level')"
              min-width="120"
              align="center"
            >
              <template #default="scope">
                <div>
                  {{ scope.$index + 1 }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              :label="$t('other.amount')"
              min-width="260"
              align="center"
            >
              <template #default="scope">
                <ElInput
                  v-model="scope.row.amount"
                  :placeholder="$t('other.amount')"
                  style="width: 220px"
                  type="number"
                  clearable
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              :label="$t('table.point_level')"
              min-width="260"
              align="center"
            >
              <template #default="scope">
                <ElInput
                  v-model="scope.row.points"
                  :placeholder="$t('table.point_level')"
                  style="width: 220px"
                  type="number"
                  clearable
                >
                  <template #append>
                    %
                  </template>
                </ElInput>
              </template>
            </el-table-column>
          </el-table>
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
