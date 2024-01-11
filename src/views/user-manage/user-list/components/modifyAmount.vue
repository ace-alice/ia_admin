<script setup lang="ts" name="modifyAmount">
import type { FormInstance } from 'element-plus'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import Api from '@/api/user-manage/user-list'

const { proxy }: any = getCurrentInstance()

const i18n = useI18n()

const dialogVisible = ref(false)

const defaultForm: any = {
  username: null,
  user_id: null,
  type: null,
  amount: null,
  bet_no: null,
}

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive(Object.assign({}, defaultForm))
const option1: any = ref([
  {
    label: i18n.t('other.increase_balance'),
    value: 1,
  },
  {
    label: i18n.t('other.reduce_balance'),
    value: 2,
  },
  {
    label: i18n.t('other.increase_frozen_amount'),
    value: 3,
  },
  {
    label: i18n.t('other.decrease_frozen_amount'),
    value: 4,
  },
])

function handleClose() {
  Object.assign(ruleForm, defaultForm)
  dialogVisible.value = false
}

function submitForm() {
  ruleFormRef.value
    && ruleFormRef.value.validate((valid) => {
      if (valid) {
        Api.manualAmount({
          user_id: ruleForm.user_id,
          type: ruleForm.type,
          amount: ruleForm.amount,
          bet_no: ruleForm.bet_no,
        }).then((res: any) => {
          if (res && res.code === 1) {
            ElNotification.success(res.msg)
            handleClose()
          }
        })
      }
    })
}

onMounted(() => {
  proxy.mittBus.on('modify_amount', (row: any) => {
    ruleForm.user_id = row.user_id
    ruleForm.username = row.username
    dialogVisible.value = true
  })
})
onUnmounted(() => {
  proxy.mittBus.off('modify_amount')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('crud.modify_amount')"
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
        :label="$t('table.bet_username' /**用户名 */)"
        prop="username"
      >
        <el-input
          v-model="ruleForm.username"
          disabled
          :placeholder="$t('other.pls_input')"
          style="width: 200px"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="$t('other.adjust_type')"
        prop="type"
        :rules="[
          {
            required: true,
            message: $t('other.adjust_type') + $t('table.not_empty'),
          },
        ]"
      >
        <el-select
          v-model="ruleForm.type"
          :placeholder="$t('other.adjust_type')"
          style="width: 200px"
        >
          <el-option
            v-for="role in option1"
            :key="role.value"
            :label="role.label"
            :value="role.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('table.cash_adjust' /**调整金额 */)"
        prop="amount"
        :rules="[
          {
            required: true,
            message: $t('table.cash_adjust') + $t('table.not_empty'),
          },
        ]"
      >
        <el-input
          v-model="ruleForm.amount"
          :placeholder="$t('other.pls_input')"
          style="width: 200px"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="$t('table.bet_note_number' /**注单号 */)"
        prop="bet_no"
        :rules="[
          {
            required: true,
            message: $t('table.bet_note_number') + $t('table.not_empty'),
          },
        ]"
      >
        <el-input
          v-model="ruleForm.bet_no"
          :placeholder="$t('other.pls_input')"
          style="width: 200px"
          clearable
        />
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
