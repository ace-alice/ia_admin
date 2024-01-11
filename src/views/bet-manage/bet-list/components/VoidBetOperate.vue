<script setup lang="ts" name="InvalidCom">
import { ElNotification } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { voidApi } from '@/api/bet-manage/bet-list'
import { getDictByGroupApi } from '@/api/auth-manage/create-dict'

const emit = defineEmits(['refresh'])

const dialogVisible = ref(false)

const betList = ref<any[]>([])

const ruleForm: any = reactive({
  id: '',
  reason: null,
  type: null,
  reason_type: 0,
  request_params: null,
})

function openInvalid(rowArr: any[], queryData: any) {
  betList.value = rowArr
  ruleForm.id = rowArr.map((row: any) => row.id || row.parlay_id).join(',')
  if (rowArr.length === 0) {
    ruleForm.type = 4
    ruleForm.request_params = JSON.stringify(queryData)
  }
  else if (rowArr.length === 1) {
    if (rowArr[0].parlay_id) {
      ruleForm.type = 2
    }
    else {
      ruleForm.type = 1
    }
  }
  else {
    ruleForm.type = 3
  }
  dialogVisible.value = !dialogVisible.value
}

function handleClose() {
  dialogVisible.value = false
  Object.assign(ruleForm, {
    id: '',
    reason: null,
    reason_type: 0,
    type: null,
    request_params: null,
  })
  betList.value = []
}

const ruleFormRef = ref<FormInstance>()

const { proxy }: any = getCurrentInstance()

function submit() {
  voidApi(ruleForm).then((res: any) => {
    if (+res.code === 1) {
      ElNotification.success(res.msg || res.message)
      handleClose()
      emit('refresh')
    }
  })
}

const invalidReasonOptions = ref<any[]>([])

onMounted(() => {
  proxy.mittBus.on(
    'voidBetOperateBus',
    ({ rowArr, queryData }: { rowArr: any[]; queryData: any }) => {
      openInvalid(rowArr, queryData)
    },
  )
  getDictByGroupApi('abort_reasons').then((res: any) => {
    invalidReasonOptions.value = res.data
  })
})
onUnmounted(() => {
  proxy.mittBus.off('voidBetOperateBus')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('crud.invalid')"
    width="680px"
    :before-close="handleClose"
    append-to-body
  >
    <el-table
      v-if="betList.length > 0"
      :data="betList"
      border
      style="width: 100%; margin-bottom: 12px"
      max-height="400"
    >
      <el-table-column
        prop="order_id"
        :label="$t('table.order_number')"
        align="center"
      >
        <template #default="scope">
          <Clipboard :content="scope.row.order_id">
            <template #label>
              {{ scope.row.order_id }}
            </template>
          </Clipboard>
        </template>
      </el-table-column>
      <el-table-column
        prop="username"
        :label="$t('table.username')"
        align="center"
      />
    </el-table>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item
        :label="$t('table.invalid-reason')"
        prop="reason_type"
        :rules="[
          {
            required: true,
            message: `${$t('table.invalid-reason')}${$t('table.not_empty')}`,
          },
        ]"
      >
        <el-select
          v-model="ruleForm.reason_type"
          style="width: 300px"
          :placeholder="$t('table.reason')"
          @change="ruleForm.reason = null"
        >
          <el-option
            v-for="reason in invalidReasonOptions"
            :key="reason.value"
            :label="reason.content"
            :value="reason.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="+ruleForm.reason_type === 0"
        :label="$t('table.invalid-reason')"
        prop="reason"
        :rules="[
          {
            required: true,
            message: `${$t('table.invalid-reason')}${$t('table.not_empty')}`,
          },
        ]"
      >
        <el-input
          v-model="ruleForm.reason"
          :placeholder="$t('table.invalid-reason')"
          style="width: 300px"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t("crud.cancel") }}</el-button>
        <el-button type="primary" @click="submit">
          {{ $t("crud.sure") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
