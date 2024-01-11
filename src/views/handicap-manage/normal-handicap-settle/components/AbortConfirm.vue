<script setup lang="ts" name="AbortConfirm">
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {
  abortConfirmApi,
  abortConfirmInfoApi,
} from '@/api/handicap-manage/normal-handicap-settle'
import { dictionary } from '@/hooks/lib'
import { getDictByGroupApi } from '@/api/auth-manage/create-dict'
import { parseTime } from '@/utils/formatTime'

const emit = defineEmits(['refresh'])

const { getLabel } = dictionary()

const dialogVisible = ref(false)

const i18n = useI18n()

const ruleForm: any = reactive({
  ids: '',
  rowInfo: [],
})

const route = useRoute()

function openInvalid(rowArr: any) {
  const temp: any[] = []
  rowArr.forEach((row: any) => {
    temp.push(row.id)
  })
  ruleForm.ids = temp.join(',')
  abortConfirmInfoApi(ruleForm.ids, route.query?.game_id as string).then(
    (res: any) => {
      if (+res.code === 1) {
        const rowTemp: any[] = []
        rowArr.forEach((row: any) => {
          const info = res.data[String(row.id)]
          if (info) {
            rowTemp.push(
              Object.assign({}, info, {
                game_name: route.query?.game_name || '',
                event_name: route.query?.event_name || '',
                team_name: row.play_name,
              }),
            )
          }
        })
        ruleForm.rowInfo = rowTemp
      }
    },
  )
  dialogVisible.value = !dialogVisible.value
}

function handleClose() {
  ruleForm.ids = ''
  ruleForm.rowInfo = []
  dialogVisible.value = false
}

const { proxy }: any = getCurrentInstance()

function submit(tag: 0 | 1) {
  abortConfirmApi(ruleForm.ids, tag).then((res: any) => {
    if (+res.code === 1) {
      ElNotification.success(res.msg || res.message)
      handleClose()
      emit('refresh')
    }
  })
}
const invalidReasonOptions = ref<any[]>([])
onMounted(() => {
  proxy.mittBus.on('openChampionAbortConfirmBus', (rowArr: any[]) => {
    openInvalid(rowArr)
  })
  getDictByGroupApi('abort_reasons').then((res: any) => {
    invalidReasonOptions.value = res.data
  })
})
onUnmounted(() => {
  proxy.mittBus.off('openChampionAbortConfirmBus')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('lib.abort_confirm')"
    width="1200px"
    :before-close="handleClose"
    append-to-body
  >
    <el-table :data="ruleForm.rowInfo" style="width: 100%" border>
      <el-table-column
        prop="team_name"
        :label="$t('table.play_name')"
        align="center"
      />
      <el-table-column
        prop="game_name"
        :label="$t('table.game_name')"
        align="center"
      />
      <el-table-column
        prop="event_name"
        :label="$t('table.game_event')"
        align="center"
      />
      <el-table-column
        prop="operator_name"
        :label="$t('table.apply_user')"
        align="center"
      />
      <el-table-column
        prop="operator_time"
        :label="$t('table.application_time')"
        align="center"
      >
        <template #default="scope">
          <span v-if="scope.row.operator_time">{{ parseTime(scope.row.operator_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        :label="$t('table.invalid-reason')"
        align="center"
      >
        <template #default="scope">
          <span v-if="scope.row.type === 'abort_apply'">{{
            getLabel(+scope.row.reason, invalidReasonOptions, 'value', 'content')
          }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t("crud.cancel") }}</el-button>
        <el-button type="danger" @click="submit(0)">
          {{ $t("lib.audit_reject") }}
        </el-button>
        <el-button type="success" @click="submit(1)">
          {{ $t("lib.audit_passed") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
