<route lang="yaml">
name: globalParameter
meta:
  title: 全局参数
  constant: false
  layout: true
</route>

<script lang="ts" setup name="globalParameter">
import type { FormInstance } from 'element-plus'
import { otherPermission } from './hooks/permission'
import PageMain from '@/components/PageMain/index.vue'
import { editApi, getListApi } from '@/api/risk-manage/global-parameter'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'
import { parseTime } from '@/utils/formatTime'
const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()
const proxyForm = reactive({
  keys: null, // //单注最低投注
  params: null, // 参数
})
const crudDefaultFormRef = ref<FormInstance>()
const queryLoading = ref(false)
const crudData = ref([])
const dialogVisible = ref(false)
function toEdit(param: any) {
  Object.assign(proxyForm, {
    keys: param.keys, // //单注最低投注
    params: +param.params || 0, // 参数
  })
  dialogVisible.value = true
}
function resetCrudStatus() {
  dialogVisible.value = false
  crudDefaultFormRef.value && crudDefaultFormRef.value.clearValidate()
  Object.assign(proxyForm, {
    keys: null, // //单注最低投注
    params: null, // 参数
  })
}
const checkParams = (rule: any, value: any, callback: any) => {
  if (!value || value < 0) {
    return callback(new Error('Please input valid value'))
  }
  else {
    if (proxyForm.keys === 'min_return_rate') {
      const rate: any = crudData.value.find(
        (data: any) => data.keys === 'max_return_rate',
      )
      if (!rate || +value >= +rate.params || +value >= 100) {
        return callback(new Error('Please input valid value'))
      }
      else {
        callback()
      }
    }
    else if (proxyForm.keys === 'max_return_rate') {
      const rate: any = crudData.value.find(
        (data: any) => data.keys === 'min_return_rate',
      )
      if (!rate || +value <= +rate.params || +value > 100) {
        return callback(new Error('Please input valid value'))
      }
      else {
        callback()
      }
    }
    else {
      callback()
    }
  }
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

const sortKey = ['min_return_rate', 'max_return_rate', 'single_min_bet', 'parlay_min_bet', 'single_day_points', 'parlay_day_points']
function getParamFun() {
  queryLoading.value = true
  getListApi()
    .then((res: any) => {
      if (+res.code === 1) {
        crudData.value = res.data.sort((a: any, b: any) => {
          const aS = sortKey.findIndex(s => s === a.keys)
          const bS = sortKey.findIndex(s => s === b.keys)
          return aS - bS
        })
      }
    })
    .finally(() => {
      queryLoading.value = false
    })
}
function getNextIcon(key: string) {
  if (['min_return_rate', 'max_return_rate'].includes(key)) {
    return '%'
  }
  else {
    return '¥'
  }
}
onMounted(() => {
  getParamFun()
})
</script>

<template>
  <PageMain :title="$t('router.global-parameter')" :has-tool="true" :has-search="false" :has-footer="true">
    <template #pageBody>
      <el-table
        ref="tableRef" v-loading="queryLoading" :data="crudData" stripe style="width: 100%" height="100%" border
        resizable :header-cell-style="filterHeaderColumn"
      >
        <el-table-column
          v-if="getColumnShow('keys')" prop="keys" :label="$t('table.param_keys' /**参数名称 */)"
          min-width="130" align="center"
        >
          <template #default="scope">
            <span>{{ $t(`table.${scope.row.keys}`) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('params')" prop="params" :label="$t('table.params_value' /**参数值 */)"
          min-width="130" align="center"
        >
          <template #default="scope">
            <span>{{ scope.row.params }}</span>
            <span style="margin-left: 6px">{{
              getNextIcon(scope.row.keys)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('update_time')" prop="update_time"
          :label="$t('table.operator_time' /**操作时间 */)" min-width="130" align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.update_time">{{
              parseTime(scope.row.update_time)
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('admin_name')" prop="admin_name" :label="$t('table.operator' /**操作人 */)"
          min-width="130" align="center"
        />
        <el-table-column label="table.operate" min-width="130" align="center" fixed="right">
          <template #header>
            <FilterColumnControl :column-info="columnInfo" />
          </template>
          <template #default="scope">
            <span v-some="Object.values(otherPermission)">
              <el-dropdown placement="bottom-end" :hide-on-click="false" trigger="click">
                <el-button type="warning" link>
                  {{ $t("table.operateControl") }}
                </el-button>
                <template #dropdown>
                  <el-dropdown-item>
                    <el-button v-only="otherPermission.edit" type="primary" size="small" @click="toEdit(scope.row)">
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
      <el-dialog v-model="dialogVisible" title="" :before-close="resetCrudStatus" width="500px" destroy-on-close>
        <el-form ref="crudDefaultFormRef" :model="proxyForm" label-width="160px" class="demo-ruleForm" inline>
          <el-form-item
            :label="$t(`table.${proxyForm.keys}`)" prop="params"
            :rules="[{ validator: checkParams, trigger: 'blur' }]"
          >
            <el-input v-model="proxyForm.params" type="number" style="width: 220px">
              <template #append>
                {{ getNextIcon(proxyForm.keys as any) }}
              </template>
            </el-input>
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
