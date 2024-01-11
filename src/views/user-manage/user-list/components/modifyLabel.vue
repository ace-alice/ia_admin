<script setup lang="ts" name="modifyLabel">
import type { FormInstance } from 'element-plus'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import Api from '@/api/user-manage/user-list'

const emit = defineEmits(['refresh'])

const { proxy }: any = getCurrentInstance()

const i18n = useI18n()

const dialogVisible = ref(false)

const defaultForm: any = {
  user_id: null,
  risk_id: null,

}
const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive(Object.assign({}, defaultForm))

const option1: any = ref([])

function handleClose() {
  Object.assign(ruleForm, defaultForm)
  dialogVisible.value = false
}

function submitForm() {
  ruleFormRef.value
    && ruleFormRef.value.validate((valid) => {
      if (valid) {
        Api.editRisk({
          user_id: ruleForm.user_id,
          risk_id: ruleForm.risk_id,
        }).then((res: any) => {
          if (res && res.code === 1) {
            ElNotification.success(res.msg)
            handleClose()
            emit('refresh')
          }
        })
      }
    })
}
const getOption = () => {
  Api.getAllRiskLabel().then((res: any) => {
    if (res && res.code === 1) {
      option1.value = res.data
    }
  })
}
onMounted(() => {
  proxy.mittBus.on('modify_label', (row: any) => {
    ruleForm.user_id = row.user_id
    ruleForm.risk_id = row.risk_id
    dialogVisible.value = true
    getOption()
  })
})
onUnmounted(() => {
  proxy.mittBus.off('modify_label')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('crud.modify_label')"
    width="600px"
    :before-close="handleClose"
    destroy-on-close
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item
        :label="$t('table.risk_label' /**风控标签 */)"
        prop="risk_id"
      >
        <el-select
          v-model="ruleForm.risk_id"
          style="width: 200px"
          clearable
        >
          <el-option
            v-for="role in option1"
            :key="role.tag_id"
            :label="role.tag_name"
            :value="role.tag_id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">
          {{ $t("crud.cancel") }}
        </el-button>
        <el-button type="primary" @click="submitForm">
          {{ $t("crud.sure") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
