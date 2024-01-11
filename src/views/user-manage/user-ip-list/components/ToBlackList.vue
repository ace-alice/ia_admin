<script setup lang="ts" name="ToBlackList">
import type { TransferDirection, TransferKey } from 'element-plus'
import { addBlackApi, getIpListApi } from '@/api/user-manage/user-ip-list'
const emit = defineEmits(['close'])
const { proxy }: any = getCurrentInstance()
const dialogVisible = ref(false)
const currentId = ref<number>(0)
const data = ref<any[]>([])
const blackData = ref<any[]>([])

const rightCheck = ref<TransferKey[]>([])

const leftCheck = ref<TransferKey[]>([])

function getIpList() {
  getIpListApi(currentId.value).then((res: any) => {
    if (+res.code === 1) {
      data.value = res.data
      blackData.value = res.data.filter((ipInfo: any) => {
        return +ipInfo.is_black
      }).map((ipIn: any) => ipIn.id)
      dialogVisible.value = true
    }
  })
}

function close() {
  emit('close')
  dialogVisible.value = false
  currentId.value = 0
  data.value = []
  leftCheck.value = []
  rightCheck.value = []
  blackData.value = []
}

function leftCheckChange(leftKey: TransferKey[]) {
  leftCheck.value = leftKey
}

function rightCheckChange(rightKey: TransferKey[]) {
  rightCheck.value = rightKey
}

function addOrMove(is_black: 0 | 1, ids: string) {
  addBlackApi(is_black, ids).finally(() => {
    leftCheck.value = []
    rightCheck.value = []
    getIpList()
  })
}

function transferChange(moveData: TransferKey[], direction: TransferDirection) {
  if (direction === 'left') {
    addOrMove(0, rightCheck.value.join(''))
  }
  else {
    addOrMove(1, leftCheck.value.join(','))
  }
}

onMounted(() => {
  proxy.mittBus.on('ToBlackBus', (user_id: number | string) => {
    currentId.value = +user_id
    getIpList()
  })
})

onUnmounted(() => {
  proxy.mittBus.off('ToBlackBus')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title=""
    width="800px"
    center
    :before-close="close"
  >
    <el-transfer
      v-model="blackData"
      :data="data"
      :button-texts="['Cancel', 'Add']"
      :titles="['Betting ip', 'Black ip']"
      :props="{
        key: 'id',
        label: 'ip',
      }"
      @left-check-change="leftCheckChange"
      @right-check-change="rightCheckChange"
      @change="transferChange"
    />
  </el-dialog>
</template>
