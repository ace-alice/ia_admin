<script setup lang="ts" name="userGroup">
import { ElNotification } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { addtoGroup, getAllUserGroup } from '@/api/user-manage/user-list'

const emit = defineEmits(['refresh'])

const dialogVisible = ref(false)

const betList = ref<any[]>([])
// 用户组
const userGroupOption = ref<any[]>([])
const getUserGroup = () => {
  getAllUserGroup().then((res: any) => {
    if (res && res.code === 1) {
      userGroupOption.value = res.data
    }
  })
}
const ruleForm: any = reactive({
  user_group_id: null,
})

function openInvalid(rowArr: any[]) {
  betList.value = rowArr
  dialogVisible.value = !dialogVisible.value
}

function handleClose() {
  dialogVisible.value = false
  Object.assign(ruleForm, {
    user_group_id: null,
  })
  betList.value = []
}

const ruleFormRef = ref<FormInstance>()

const { proxy }: any = getCurrentInstance()

function submit() {
  const userId: any = []
  betList.value.forEach((item: any) => {
    userId.push(item.user_id)
  })
  if (!userId.length) {
    return
  }
  addtoGroup({
    user_ids: userId.toString(),
    user_group_id: ruleForm.user_group_id,
  }).then((res: any) => {
    if (+res.code === 1) {
      ElNotification.success(res.msg || res.message)
      handleClose()
      emit('refresh')
    }
  })
}

onMounted(() => {
  proxy.mittBus.on('openUserGroup', ({ rowArr }: { rowArr: any[] }) => {
    openInvalid(rowArr)
  })
  getUserGroup()
})
onUnmounted(() => {
  proxy.mittBus.off('openUserGroup')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('lib.add_to_group')"
    width="680px"
    :before-close="handleClose"
    append-to-body
  >
    <el-table v-if="betList.length > 0" :data="betList" border style="width: 100%;margin-bottom: 12px;" max-height="400">
      <el-table-column prop="user_id" :label="$t('table.user_id')" align="center" />
      <el-table-column prop="username" :label="$t('table.username')" align="center" />
    </el-table>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item
        :label="$t('table.user_group' /**用户组 */)"
        prop="user_group_id"
        :rules="[
          {
            required: true,
            message: `${$t('table.user_group')}${$t('table.not_empty')}`,
          },
        ]"
      >
        <el-select
          v-model="ruleForm.user_group_id"
          style="width: 300px"
          popper-class="user-select"
          :placeholder="$t('lib.all')"
          clearable
        >
          <el-option
            v-for="item in userGroupOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
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
