<script setup lang="ts" name="InvalidCom">
import { verifyInfoApi } from '@/api/bet-manage/bet-void-review'

const dialogVisible = ref(false)

const voidInfo = ref<any>({})

const voidId = ref('')

function openInvalid(void_id: string) {
  voidId.value = void_id
  verifyInfoApi({ id: voidId.value })
    .then((res: any) => {
      if (+res.code === 1) {
        voidInfo.value = res.data
      }
    })
    .finally(() => {
      dialogVisible.value = !dialogVisible.value
    })
}

function handleClose() {
  dialogVisible.value = false
  voidId.value = ''
  voidInfo.value = {}
}

const { proxy }: any = getCurrentInstance()

onMounted(() => {
  proxy.mittBus.on('seeVoidDetailsBus', (void_id: string) => {
    openInvalid(void_id)
  })
})
onUnmounted(() => {
  proxy.mittBus.off('seeVoidDetailsBus')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('crud.invalid')"
    width="500px"
    :before-close="handleClose"
    append-to-body
  >
    <el-descriptions :column="1" border>
      <el-descriptions-item :label="$t('table.void_num')" :width="120">
        {{ voidInfo.count }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.bet_note_number')">
        <template v-if="typeof voidInfo.project === 'string'">
          <el-tag
            v-for="item in voidInfo.project.split(',')"
            :key="item"
            type="warning"
            style="cursor: pointer;margin: 0 4px;"
          >
            <Clipboard :content="item">
              <template #label>
                {{ item }}
              </template>
            </Clipboard>
          </el-tag>
        </template>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<style scoped></style>
