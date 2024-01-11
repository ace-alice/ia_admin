<script setup lang="ts" name="AdminAccount">
import { defineProps, ref } from 'vue'
import { Edit, Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElNotification, type FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { otherPermission } from '../hooks/permission'
import { dictionary } from '@/hooks/lib'

import { parseTime } from '@/utils/formatTime'

import {
  addAcount,
  editAcount,
  editAcountStatus,
  getAccountListApi,
} from '@/api/partner-manage/proxy-manage'
import getProxyListHook from '@/hooks/getProxyListHook'

const props = defineProps({
  proxyId: {
    type: Number,
    default: 0,
  },
})

const { proxyList } = getProxyListHook()

const { t } = useI18n()

const defaultFrom = {
  create_time: null,
  create_user: null,
  create_username: null,
  enable_name: null,
  is_admin: 0,
  is_admin_name: null,
  is_del: 0,
  last_login_ip: null,
  last_login_time: null,
  password: null,
  proxy_id: +props.proxyId,
  update_time: null,
  update_user: null,
  update_username: null,
  user_id: null,
  username: null,
}

const { isDisableOptions, isNot, getLabel } = dictionary()

const tableData = ref([])

function getAccountList() {
  getAccountListApi({ id: props.proxyId }).then((res: any) => {
    if (+res.code === 1) {
      tableData.value = res.data
    }
    else {
      tableData.value = []
    }
  })
}

const crudDefaultFormRef = ref<FormInstance>()

const dialogVisible = ref(false)

const dialogTitle = ref('')

const apType = ref(0)

const proxyForm = reactive<any>(
  Object.assign({}, defaultFrom),
)

function resetCrudStatus() {
  dialogVisible.value = false
  dialogTitle.value = ''
  crudDefaultFormRef.value && crudDefaultFormRef.value.resetFields()
}

function toEdit(row: any) {
  Object.assign(proxyForm, row)
  apType.value = 1
  dialogVisible.value = true
  dialogTitle.value = t('table.edit_admin_account')
}

function toAdd() {
  Object.assign(proxyForm, defaultFrom)
  apType.value = 0
  dialogVisible.value = true
  dialogTitle.value = t('table.add_admin_account')
}

function submitHandle() {
  const theApi = apType.value ? editAcount : addAcount
  crudDefaultFormRef.value
          && crudDefaultFormRef.value.validate(async (valid: any) => {
            if (valid) {
              // 验证通过
              theApi(proxyForm)
                .then(async (res: any) => {
                  if (+res.code === 1) {
                    ElNotification({
                      title: apType.value ? t('crud.Editsuccessfully') : t('crud.Addsuccessfully'),
                      type: 'success',
                    })
                    resetCrudStatus()
                    getAccountList()
                  }
                })
            }
          })
}

const beforeChange = (row: any) => {
  return () => {
    row.loading = true
    return new Promise<boolean>((resolve) => {
      editAcountStatus({
        user_id: row.user_id,
        is_del: row.is_del ? 0 : 1,
      }).then((res: any) => {
        if (+res.code === 1) {
          return resolve(true)
        }
        else {
          ElMessage.warning(res.message || res.msg)
          return resolve(false)
        }
      }).catch((error) => {
        ElMessage.error(error)
        return resolve(false)
      }).finally(() => {
        row.loading = false
      })
    })
  }
}

onMounted(() => {
  getAccountList()
})
</script>

<template>
  <el-table
    :data="tableData"
    border
    style="width: calc(100% - 24px); margin-left: 12px"
  >
    <el-table-column
      prop="user_id"
      :label="$t('table.number')"
      min-width="80"
      align="center"
    />
    <el-table-column
      prop="username"
      :label="$t('table.proxy_account')"
      min-width="120"
      align="center"
    />
    <el-table-column
      prop="is_admin"
      :label="$t('table.is_admin')"
      min-width="120"
      align="center"
    >
      <template #default="scope">
        <el-tag :type="scope.row.is_del ? 'info' : 'warning'">
          {{ getLabel(scope.row.is_admin, isNot) }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="last_login_time"
      :label="$t('table.last_login_time')"
      min-width="140"
      align="center"
    >
      <template #default="scope">
        <div v-if="scope.row.last_login_time">
          {{ parseTime(scope.row.last_login_time) }}
        </div>
        <div v-else>
          --
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="last_login_ip"
      :label="$t('table.last_login_ip')"
      min-width="120"
      align="center"
    />
    <el-table-column
      prop="create_username"
      :label="$t('table.create_name')"
      min-width="100"
      align="center"
    />
    <el-table-column
      prop="create_time"
      :label="$t('table.create_time')"
      min-width="140"
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
      prop="update_username"
      :label="$t('table.action_name')"
      min-width="100"
      align="center"
    />
    <el-table-column
      prop="update_time"
      :label="$t('table.update_time1')"
      min-width="140"
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
      prop="status"
      :label="$t('table.status')"
      min-width="100"
      align="center"
      fixed="right"
    >
      <template #default="scope">
        <el-switch
          v-model="scope.row.is_del"
          :loading="scope.row.loading"
          :active-value="1"
          :inactive-value="0"
          :before-change="beforeChange(scope.row)"
          style="margin-right: 4px;"
        />
        <el-tag :type="scope.row.is_del ? 'danger' : 'warning'">
          {{ getLabel(scope.row.is_del, isDisableOptions) }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      :label="$t('table.operate')"
      min-width="130"
      align="center"
      fixed="right"
    >
      <template #header>
        <el-button type="primary" :icon="Plus" plain @click="toAdd">
          {{ $t('table.create_admin_account') }}
        </el-button>
      </template>
      <template #default="scope">
        <el-button
          v-only="otherPermission.edit"
          type="primary"
          size="small"
          @click="toEdit(scope.row)"
        >
          {{ $t("crud.edit") }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <Teleport to="body">
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :before-close="resetCrudStatus"
      width="560px"
      destroy-on-close
    >
      <ElForm
        ref="crudDefaultFormRef"
        :model="proxyForm"
        label-width="160px"
        class="demo-ruleForm"
        inline
      >
        <el-form-item
          :label="$t('table.proxy_name' /**所属代理 */)"
          prop="proxy_id"
          :rules="[
            {
              required: true,
              message: $t('table.proxy_name') + $t('table.not_empty'),
            },
          ]"
        >
          <el-select
            v-model="proxyForm.proxy_id"
            style="width: 260px"
            :placeholder="$t('table.proxy_name' /**所属代理 */)"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="pro in proxyList"
              :key="pro.id"
              :label="pro.proxy_name"
              :value="pro.id"
            />
          </el-select>
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
            :placeholder="$t('table.proxy_name')"
            style="width: 260px"
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
            style="width: 260px"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item
          :label="`${$t('table.is_admin')}`"
          prop="receipt_type"
        >
          <el-radio-group
            v-model="proxyForm.is_admin"
            style="width: 220px"
          >
            <el-radio-button
              v-for="item in isNot"
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
      </ElForm>
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
  </Teleport>
</template>
