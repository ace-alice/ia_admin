<route lang="yaml">
name: RiskParameter
meta:
  title: 风控参数
  constant: false
  layout: true
</route>

<script lang="ts" setup name="RiskParameter">
import { type FormInstance } from 'element-plus'
import { otherPermission } from './hooks/permission'
import PageMain from '@/components/PageMain/index.vue'
import { editApi, getListApi } from '@/api/risk-manage/limit-ratio'
import { parseTime } from '@/utils/formatTime'
const defaultForm = {
  admin_id: null,
  admin_username: null,
  compare_time: null,
  game_start_time: null,
  id: null,
  keys: null,
  limit_ratio: null,
  rate_return: null,
  stage_name: null,
  update_time: null,
}
const proxyForm = reactive(Object.assign({}, defaultForm))
const crudDefaultFormRef = ref<FormInstance>()
const queryLoading = ref(false)
const crudData = ref([])
const dialogVisible = ref(false)
function toEdit(param: any) {
  Object.assign(proxyForm, param)
  dialogVisible.value = true
}
function resetCrudStatus() {
  dialogVisible.value = false
  crudDefaultFormRef.value && crudDefaultFormRef.value.clearValidate()
  Object.assign(proxyForm, defaultForm)
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
      >
        <el-table-column
          prop="stage_name"
          :label="$t('table.stage_name' /**阶段名称 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          prop="game_start_time"
          :label="$t('table.game_start_time' /**开始时间 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          prop="limit_ratio"
          :label="$t('crud.limit_red_r' /**鲜红比例 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.limit_ratio">{{
              scope.row.limit_ratio
            }}%</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="rate_return"
          :label="$t('crud.return_rate' /**返还率缩减 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.rate_return">{{
              scope.row.rate_return
            }}%</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="admin_username"
          :label="$t('table.update_people' /**操作人 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          prop="update_time"
          :label="$t('table.update_time1' /**操作时间 */)"
          min-width="160"
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
          :label="$t('table.operate')"
          min-width="130"
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
        :title="proxyForm.stage_name || ''"
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
            :label="$t(`crud.limit_red_r`)"
            prop="limit_ratio"
            :rules="[
              {
                required: true,
                trigger: 'blur',
                message: $t('crud.limit_red_r') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input v-model="proxyForm.limit_ratio" style="width: 220px" />
          </el-form-item>
          <el-form-item
            :label="$t(`crud.return_rate`)"
            prop="rate_return"
            :rules="[
              {
                required: true,
                trigger: 'blur',
                message: $t('crud.return_rate') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input v-model="proxyForm.rate_return" style="width: 220px" />
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
