<route lang="yaml">
name: RiskParameter
meta:
  title: 风控参数
  constant: false
  layout: true
</route>

<script lang="ts" setup name="RiskParameter">
import { ElMessage, type FormInstance } from 'element-plus'
import { otherPermission } from './hooks/permission'
import PageMain from '@/components/PageMain/index.vue'
import {
  editApi,
  editStatusApi,
  getListApi,
} from '@/api/risk-manage/risk-parameter'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'
import { parseTime } from '@/utils/formatTime'
import useUserStore from '@/store/modules/user'
const roles = useUserStore().roles
const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()
const proxyForm = reactive({
  id: null, // id
  params_value: null, // 参数
})
const crudDefaultFormRef = ref<FormInstance>()
const queryLoading = ref(false)
const crudData = ref([])
const dialogVisible = ref(false)
function toEdit(param: any) {
  Object.assign(proxyForm, {
    id: param.id, // //单注最低投注
    params_value: param.params_value || '', // 参数
  })
  dialogVisible.value = true
}
function resetCrudStatus() {
  dialogVisible.value = false
  crudDefaultFormRef.value && crudDefaultFormRef.value.clearValidate()
  Object.assign(proxyForm, {
    id: null, // id
    params_value: null, // 参数
  })
}

function submitHandle() {
  crudDefaultFormRef.value
    && crudDefaultFormRef.value.validate((valid) => {
      if (valid) {
        editApi(proxyForm).then((res: any) => {
          if (+res.code === 1) {
            resetCrudStatus()
            getParamFun()
          }
        })
      }
      else {
        return false
      }
    })
}
function getParamFun() {
  queryLoading.value = true
  getListApi()
    .then((res: any) => {
      if (+res.code === 1) {
        crudData.value = res.data
      }
    })
    .finally(() => {
      queryLoading.value = false
    })
}

function beforeChange(row: any) {
  return () => {
    row.loading = true
    return new Promise<boolean>((resolve, reject) => {
      editStatusApi({ id: row.id, status: +row.params_status === 1 ? 2 : 1 })
        .then((res: any) => {
          if (+res.code === 1) {
            resolve(true)
          }
          else {
            ElMessage.error(res.message || res.msg)
            reject(new Error(res.message || res.msg))
          }
        })
        .catch((err: any) => reject(err))
        .finally(() => {
          row.loading = false
        })
    })
  }
}
onMounted(() => {
  getParamFun()
})
</script>

<template>
  <PageMain
    :title="$t('router.risk-parameter')"
    :has-tool="true"
    :has-search="false"
    :has-footer="true"
  >
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
          v-if="getColumnShow('tag_name')"
          prop="tag_name"
          :label="$t('table.risk_type' /**参数名称 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('params_name')"
          prop="params_name"
          :label="$t('table.params_name' /**参数值 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('params_value')"
          prop="params_value"
          :label="$t('table.params_value' /**参数值 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('params_status')"
          prop="params_status"
          :label="$t('table.status' /**参数值 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.params_status"
              :active-text="$t('lib.on')"
              :inactive-text="$t('lib.off')"
              :loading="scope.row.loading"
              :active-value="1"
              :inactive-value="2"
              inline-prompt
              :before-change="beforeChange(scope.row)"
              :disabled="!roles.includes(otherPermission.status)"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('update_time')"
          prop="update_time"
          :label="$t('table.update_time1' /**操作时间 */)"
          min-width="160"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.params_time">{{
              parseTime(scope.row.params_time)
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          label="table.operate"
          min-width="130"
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
    <template #other>
      <el-dialog
        v-model="dialogVisible"
        :title="$t(`table.params_value`)"
        :before-close="resetCrudStatus"
        width="500px"
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
            :label="$t(`table.params_value`)"
            prop="params_value"
            :rules="[
              {
                required: true,
                trigger: 'blur',
                message: $t('table.params_value') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input v-model="proxyForm.params_value" style="width: 220px" />
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
