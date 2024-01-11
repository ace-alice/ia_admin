<script setup lang="ts" name="SettleCom">
import { ElNotification } from 'element-plus'
import type { FormInstance, TableColumnCtx } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { parseTime } from '@/utils/formatTime'
import {
  firstSettle,
  settleDetailApi,
  sureSettleApi,
} from '@/api/handicap-manage/champion-handicap-settle'
import { dictionary } from '@/hooks/lib'

const emit = defineEmits(['refresh'])

const i18n = useI18n()

interface OperateType {
  status: number
  current_operator: string
}

const operateStatus: OperateType = reactive({
  status: 0,
  current_operator: '',
})

const ruleFormRef = ref<FormInstance>()

const { invalidReasonOptions, getLabel, setWinnerOptions, setConfirmOptions }
  = dictionary()

interface SettlesType {
  img: string
  point_extra_id?: string | number
  champion_settles: Array<{
    point_extra_id: string | number
    win_loss: number
    team_name: string
    is_confirm?: 0 | 1
    rowInfo?: Array<{
      img?: string
      operator_name?: string
      operator_time?: string
      reason?: number
      before_status?: number
      type?: string
      operator_id?: number
      audit_result?: number
      win_lose?: number
    }>
  }>
}

const defaultForm: SettlesType = {
  img: '',
  champion_settles: [],
}

const formData: SettlesType = reactive(defaultForm)

const dialogTitle = computed(() => {
  const title = [0, 1].includes(+operateStatus.status)
    ? i18n.t('lib.set_winner')
    : +operateStatus.status === 2
        ? i18n.t('lib.confirm_winner')
        : [3, 5].includes(+operateStatus.status)
            ? i18n.t('lib.see_result')
            : +operateStatus.status === 4
                ? i18n.t('lib.abort_confirm')
                : i18n.t('lib.see_result')
  const disabled = !operateStatus.current_operator

  return { title, disabled }
})

function setTheForm(form: { [key: string]: any }) {
  formData.img = form.img
}

const dialogVisible = ref(false)

function openSettle(rowArr: any[]) {
  rowArr.forEach((row: any, index: number) => {
    if (index === 0) {
      operateStatus.status = +row.status
      operateStatus.current_operator = row.current_operator
    }
    formData.champion_settles.push({
      point_extra_id: row.id,
      team_name: row.team_name,
      win_loss: +row.win_loss || 2,
      is_confirm: 1,
      rowInfo: [],
    })
  })
  if ([2, 3, 5].includes(+operateStatus.status)) {
    if (formData.champion_settles.length > 0) {
      settleDetailApi(formData.champion_settles[0].point_extra_id).then(
        (res: any) => {
          if (+res.code === 1) {
            formData.champion_settles[0].rowInfo = res.data.filter(
              (data: any) => {
                return !!data.type
              },
            )
          }
        },
      )
    }
  }
  dialogVisible.value = !dialogVisible.value
}

function handleClose() {
  formData.img = ''
  formData.champion_settles = []
  dialogVisible.value = false
}

function submit() {
  ruleFormRef.value
    && ruleFormRef.value.validate((valid) => {
      if (valid) {
        if ([0, 1].includes(+operateStatus.status)) {
          const champion_settle = Object.assign(
            {},
            formData,
          ).champion_settles.map((settle) => {
            return {
              point_extra_id: settle.point_extra_id,
              win_loss: settle.win_loss,
            }
          })
          firstSettle(formData.img, champion_settle).then((res: any) => {
            if (+res.code === 1) {
              ElNotification.success(
                i18n.t('lib.set_winner') + i18n.t('lib.success'),
              )
              emit('refresh')
              handleClose()
            }
          })
        }
        if (+operateStatus.status === 2) {
          if (formData.champion_settles.length > 0) {
            sureSettleApi(
              formData.champion_settles[0].point_extra_id,
              formData.champion_settles[0].is_confirm || 0,
            ).then((res: any) => {
              if (+res.code === 1) {
                ElNotification.success(
                  i18n.t('lib.confirm_winner') + i18n.t('lib.success'),
                )
                emit('refresh')
                handleClose()
              }
            })
          }
        }
      }
    })
}

function objectSpanMethod({
  column,
  rowIndex,
}: {
  row: any
  column: TableColumnCtx<any>
  rowIndex: number
  columnIndex: number
}) {
  if (column.property === 'image-upload') {
    const rowspan = formData.champion_settles.length
    const colspan = 1

    if (rowIndex === 0) {
      return {
        rowspan,
        colspan,
      }
    }
    else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}

const { proxy }: any = getCurrentInstance()

onMounted(() => {
  proxy.mittBus.on('openChampionSettleBus', (rowArr: any[]) => {
    openSettle(rowArr)
  })
})
onUnmounted(() => {
  proxy.mittBus.off('openChampionSettleBus')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle.title"
    width="1200px"
    :before-close="handleClose"
    append-to-body
    destroy-on-close
  >
    <el-form ref="ruleFormRef" :model="formData" label-width="120px">
      <el-table
        :data="formData.champion_settles"
        style="width: 100%"
        table-layout="auto"
        border
        default-expand-all
        :span-method="objectSpanMethod"
      >
        <el-table-column
          v-if="[2, 3, 5].includes(+operateStatus.status)"
          type="expand"
        >
          <template #default="props">
            <el-table :data="props.row.rowInfo" style="width: 100%">
              <el-table-column
                prop="date"
                :label="$t('table.operation_types')"
                width="180"
                align="center"
              >
                <template #default="scope">
                  <span v-if="scope.row.type">
                    {{ $t(`lib.${scope.row.type}`) }}
                  </span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="operator_name"
                :label="$t('table.operator')"
                align="center"
              />
              <el-table-column
                prop="operator_time"
                :label="$t('table.operator_time')"
                align="center"
              >
                <template #default="scope">
                  <span v-if="scope.row.operator_time">{{ parseTime(scope.row.operator_time) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="operator_id" :label="$t('table.result')" align="center">
                <template #default="scope">
                  <span v-if="scope.row.type === 'abort_apply'">
                    {{ $t('table.invalid-reason') }}: {{ getLabel(+scope.row.reason, invalidReasonOptions) }}
                  </span>
                  <span v-if="scope.row.type === 'abort_confirm'">
                    {{
                      +scope.row.audit_result
                        ? $t('lib.audit_passed')
                        : $t('lib.audit_reject')
                    }}
                  </span>
                  <span v-if="scope.row.type === 'resettle'">--</span>
                  <span v-if="scope.row.type === 'set_winner'">
                    {{ getLabel(+scope.row.win_lose, setWinnerOptions) }}
                  </span>
                  <span v-if="scope.row.type === 'confirm_winner'">
                    {{ getLabel(+scope.row.is_confirm, setConfirmOptions) }}
                  </span>
                  <span v-if="scope.row.type === 'reject'">--</span>
                </template>
              </el-table-column>
              <el-table-column prop="img" :label="$t('table.screenshot')" align="center">
                <template #default="scope">
                  <el-image
                    v-if="scope.row.img"
                    style="width: 60px; height: 60px"
                    :src="scope.row.img"
                    :zoom-rate="1.5"
                    :preview-src-list="[scope.row.img]"
                    :initial-index="0"
                    :preview-teleported="true"
                    fit="cover"
                  />
                  <span v-else>--</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="team_name"
          :label="$t('table.betting')"
        />
        <el-table-column
          v-if="[0, 1, 2].includes(+operateStatus.status)"
          align="center"
          :label="$t('table.select_match_results')"
        >
          <template #default="scope">
            <el-radio-group
              v-model="scope.row.win_loss"
              :disabled="+operateStatus.status === 2"
            >
              <el-radio
                v-for="op in setWinnerOptions"
                :key="op.value"
                :label="op.value"
              >
                {{ op.label }}
              </el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column
          v-if="[0, 1].includes(+operateStatus.status)"
          align="center"
          prop="image-upload"
          :label="$t('table.screenshot_result')"
        >
          <template #default>
            <NormalImageUpload
              form-label=""
              :data="formData.img"
              imgkey="img_id"
              img-url-key="img"
              @set-image="setTheForm"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="+operateStatus.status === 2"
          align="center"
          :label="$t('table.confirm_winner')"
        >
          <template #default="scope">
            <el-radio-group v-model="scope.row.is_confirm">
              <el-radio
                v-for="op in setConfirmOptions"
                :key="op.value"
                :label="op.value"
              >
                {{ op.label }}
              </el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t('crud.cancel') }}</el-button>
        <el-button type="primary" @click="submit">
          {{ $t('crud.sure') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style>
.el-image-viewer__wrapper{
  z-index: 9999 !important;
}
</style>
