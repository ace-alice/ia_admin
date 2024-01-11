<script setup lang="ts" name="UploadLogo">
import type { FormInstance } from 'element-plus'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {
  updateTeamLogoApi,
} from '@/api/match-data-manage/team-manage'

const emit = defineEmits(['refresh'])

const { proxy }: any = getCurrentInstance()

const i18n = useI18n()

const dialogVisible = ref(false)

const defaultForm: any = {
  id: null,
  logo_w: null,
}

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive(Object.assign({}, defaultForm))

function setTheForm(form: any) {
  ruleForm.logo_w = form.logo_w
}

function handleClose() {
  Object.assign(ruleForm, defaultForm)
  dialogVisible.value = false
}

function submitForm() {
  ruleFormRef.value && ruleFormRef.value.validate((valid) => {
    if (valid) {
      updateTeamLogoApi(ruleForm).then((res: any) => {
        if (+res.code === 1) {
          ElNotification.success(i18n.t('table.upload_logo') + i18n.t('lib.success'))
          emit('refresh')
          handleClose()
        }
      })
    }
  })
}

onMounted(() => {
  proxy.mittBus.on('uploadLogoBus', (row: any) => {
    ruleForm.id = row.id
    ruleForm.logo_w = row.logo_w
    dialogVisible.value = true
  })
})
onUnmounted(() => {
  proxy.mittBus.off('uploadLogoBus')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('table.upload_logo')"
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
      <NormalImageUpload
        form-label=""
        :data="ruleForm.logo_w"
        imgkey="logo"
        img-url-key="logo_w"
        @set-image="setTheForm"
      />
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitForm">
          {{ $t('crud.sure') }}
        </el-button>
        <el-button @click="handleClose">
          {{ $t('crud.cancel') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
