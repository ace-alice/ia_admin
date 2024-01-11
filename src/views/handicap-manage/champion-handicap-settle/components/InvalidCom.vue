<script setup lang="ts" name="InvalidCom">
import { ElMessageBox, ElNotification } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { abortApplyApi } from '@/api/handicap-manage/champion-handicap-settle'
import { getDictByGroupApi } from '@/api/auth-manage/create-dict'
// import { dictionary } from '@/hooks/lib'

const emit = defineEmits(['refresh'])

const dialogVisible = ref(false)

const i18n = useI18n()

const ruleForm: any = reactive({
  ids: '',
  is_champion: 1,
  reason: null,
  confirm_result: null,
})

function openInvalid(rowArr: any) {
  const temp: any[] = []
  rowArr.forEach((row: any) => {
    temp.push(row.id)
  })
  ruleForm.ids = temp.join(',')
  dialogVisible.value = !dialogVisible.value
}

function handleClose() {
  Object.assign(ruleForm, {
    ids: '',
    is_champion: 1,
    reason: null,
    confirm_result: null,
  })
  dialogVisible.value = false
}

// const { invalidReasonOptions } = dictionary()

const ruleFormRef = ref<FormInstance>()

const { proxy }: any = getCurrentInstance()

function submit() {
  abortApplyApi(ruleForm.ids, ruleForm.reason).then((res: any) => {
    if (+res.code === 1) {
      ElNotification.success(res.msg || res.message)
      handleClose()
      emit('refresh')
    }
  })
}

const invalidReasonOptions = ref<any[]>([])

onMounted(() => {
  proxy.mittBus.on('openChampionInvalidBus', (rowArr: any[]) => {
    openInvalid(rowArr)
  })
  getDictByGroupApi('abort_reasons').then((res: any) => {
    invalidReasonOptions.value = res.data
  })
})
onUnmounted(() => {
  proxy.mittBus.off('openChampionInvalidBus')
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
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item
        :label="$t('table.invalid-reason')"
        prop="reason"
        :rules="[
          {
            required: true,
            message: `${$t('table.invalid-reason')}${$t('table.not_empty')}`,
          },
        ]"
      >
        <el-select
          v-model="ruleForm.reason"
          style="width: 300px"
          :placeholder="$t('table.reason')"
        >
          <el-option
            v-for="reason in invalidReasonOptions"
            :key="reason.value"
            :label="reason.content"
            :value="reason.value"
          />
        </el-select>
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
