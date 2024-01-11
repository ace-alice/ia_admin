<script setup lang="ts">
import { assignOperatorsApi } from '@/api/handicap-manage/handicap-list'
import { getAdminByRole } from '@/api/auth-manage/admin-config'
import RoleListHook from '@/views/auth-manage/admin-manage/hooks/RoleListHook'

const emit = defineEmits(['change'])

const currentRow = ref<any>({})

const { proxy }: any = getCurrentInstance()

const dialogVisible = ref(false)

const currentRoleId = ref<any>(null)

const adminList = ref<any[]>([])

const { roleList, getRoleList } = RoleListHook()

function changeRoleId() {
  getAdminByRole(currentRoleId.value).then((res: any) => {
    if (+res.code === 1) {
      adminList.value = res.data
    }
  })
}

function handleClose() {
  dialogVisible.value = false
  currentRow.value = {}
}
function submit() {
  const form: any = { game_id: currentRow.value.id }
  if (currentRow.value.fix_operator.length > 0) {
    form.fix_operator = currentRow.value.fix_operator.join(',')
  }
  if (currentRow.value.live_operator.length > 0) {
    form.live_operator = currentRow.value.live_operator.join(',')
  }
  if (currentRow.value.settle_operator.length > 0) {
    form.settle_operator = currentRow.value.settle_operator.join(',')
  }
  assignOperatorsApi(form).then((res: any) => {
    if (+res.code === 1) {
      handleClose()
      emit('change')
    }
  })
}

onMounted(() => {
  proxy.mittBus.on('assignOperatorsBus', (row: any) => {
    currentRow.value = Object.assign({}, row, {
      fix_operator: row.fix_operator.split(',').filter((name: any) => name),
      live_operator: row.live_operator.split(',').filter((name: any) => name),
      settle_operator: row.settle_operator.split(',').filter((name: any) => name),
    })
    dialogVisible.value = true
  })
  getRoleList()
})

onUnmounted(() => {
  proxy.mittBus.off('assignOperatorsBus')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('table.to_claim')"
    width="560px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form label-position="right" label-width="100px" :model="currentRow">
      <el-form-item :label="$t('table.admin_role')">
        <el-select
          v-model="currentRoleId"
          placeholder="Select"
          style="width: 400px"
          @change="changeRoleId"
        >
          <el-option
            v-for="role in roleList"
            :key="role.role_id"
            :label="role.role_name"
            :value="String(role.role_id)"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.fix')">
        <el-select
          v-model="currentRow.fix_operator"
          placeholder="Select"
          style="width: 400px"
          multiple
        >
          <el-option
            v-for="role in adminList"
            :key="role.username"
            :label="role.username"
            :value="String(role.username)"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.live')">
        <el-select
          v-model="currentRow.live_operator"
          placeholder="Select"
          style="width: 400px"
          multiple
        >
          <el-option
            v-for="role in adminList"
            :key="role.username"
            :label="role.username"
            :value="String(role.username)"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.toFinish')">
        <el-select
          v-model="currentRow.settle_operator"
          placeholder="Select"
          style="width: 400px"
          multiple
        >
          <el-option
            v-for="role in adminList"
            :key="role.username"
            :label="role.username"
            :value="String(role.username)"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose"> {{ $t("crud.cancel") }}</el-button>
        <el-button type="primary" @click="submit">
          {{ $t("crud.sure") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
