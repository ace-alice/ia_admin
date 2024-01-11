<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { toolPermission } from '../../hooks/permission'
import Api from '@/api/handicap-manage/fix-live-list'
const props = defineProps({
  match: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits(['closeSuccess'])
const route = useRoute()
const getMatchList = () => {
  return new Promise((resolve) => {
    const params = {
      game_id: route.query?.game_id,
      match: props.match,
    }
    Api.getPlayMatch(params).then((res: any) => {
      if (res && res.code === 1) {
        resolve(res.data)
      }
      else {
        resolve([])
      }
    })
  })
}
interface Option {
  key: number
  label: string
  disabled: boolean
}
const matchList: any = ref([])
const rightValue = ref([])
const handleChange: any = (
  value: number | string,
  direction: 'left' | 'right',
  movedKeys: string[] | number[],
) => {
  const params = {
    game_id: route.query?.game_id,
    type: direction === 'right' ? 1 : 0,
    play_id: movedKeys,
    match: props.match,
  }
  if (params.type === 1) {
    emit('closeSuccess', params)
  }
  Api.setHandicapClose(params)
    .then((res: any) => {
      if (res && res.code === 1) {
        ElMessage({
          message: res.msg,
          type: 'success',
          duration: 3000,
        })
        if (params.type === 0) {
          emit('closeSuccess', { refresh: true })
        }
      }
      else {
        emit('closeSuccess', { refresh: true })
      }
    })
    .catch(() => {
      emit('closeSuccess', { refresh: true })
    })
}
const getValue1 = (arr: any) => {
  return arr.map((x: any) => {
    return {
      key: Number(x.id),
      label: x.play_name,
    }
  })
}
const getValue2 = (arr: any) => {
  return arr
    .filter((item: any) => +item.is_close === 1)
    .map((x: any) => {
      return Number(x.id)
    })
}
async function agenerateData() {
  const playList1: any = await getMatchList()
  matchList.value = getValue1(playList1)
  rightValue.value = getValue2(playList1)
}

const dialogVisible = ref(false)

function handleClose() {
  dialogVisible.value = false
}

function open() {
  agenerateData()
  dialogVisible.value = true
}
</script>

<template>
  <el-button
    v-only="toolPermission.close"
    type="primary"
    style="margin-right: 10px"
    @click="open"
  >
    {{ $t("table.closeHandicap") }}
  </el-button>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('table.closeSetting')"
    width="60%"
    :before-close="handleClose"
  >
    <div style="text-align: center">
      <el-transfer
        v-model="rightValue"
        style="text-align: left; display: inline-block"
        :titles="[`${$t('lib.not_close')}`, `${$t('lib.close_succ')}`]"
        :button-texts="[`${$t('lib.close_cancel')}`, `${$t('lib.close')}`]"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
        :data="matchList"
        @change="handleChange"
      >
        <template #default="{ option }">
          <span>{{ option.key }} - {{ option.label }}</span>
        </template>
      </el-transfer>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-transfer-panel) {
  min-width: 280px;
}
:deep(.el-transfer-panel__item) {
  height: auto !important;
  line-height: 0 !important;
  .el-checkbox__input {
    top: 0;
  }
  & + .el-transfer-panel__item {
    margin-top: 16px;
  }
}
:deep(.el-checkbox__label) {
  overflow: visible !important;
  white-space: pre-wrap !important;
  line-height: 16px !important;
}
</style>
