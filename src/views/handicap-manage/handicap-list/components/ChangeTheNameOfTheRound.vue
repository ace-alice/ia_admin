<script setup lang="ts" name="ChangeTheNameOfTheRound">
import type { FormInstance } from 'element-plus'
import { ElNotification } from 'element-plus'
import {
  matchNameEditApi,
  matchNameListApi,
} from '@/api/handicap-manage/handicap-list'
import { getDictByGroupApi } from '@/api/auth-manage/create-dict'

const gameId = ref<number>(0)

const formData = ref<{ match: number; stage_id: number }[]>([])

const dialogVisible = ref(false)

const roundNameList = ref<{ [key: string]: any[] }>({})

function getRoundNameList() {
  formData.value.forEach((data) => {
    getDictByGroupApi(`round_name_${data.match}`).then((res: any) => {
      roundNameList.value[`roundList${data.match}`] = res.data
    })
  })
}

function getMatchNameList() {
  matchNameListApi({ game_id: gameId.value }).then((res: any) => {
    if (+res.code === 1) {
      formData.value = res.data.map((data: any) =>
        Object.assign(data, { stage_id: data.stage_id || null }),
      )
      dialogVisible.value = true
      getRoundNameList()
    }
  })
}

const ruleFormRef = ref<FormInstance>()

function handleClose() {
  dialogVisible.value = false
  gameId.value = 0
  formData.value = []
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields()
  }
}

function submit() {
  ruleFormRef.value
    && ruleFormRef.value.validate((valid) => {
      if (valid) {
        matchNameEditApi({
          game_id: gameId.value,
          matchInfo: JSON.stringify(formData.value),
        }).then((res: any) => {
          if (+res.code === 1) {
            ElNotification.success(res.message || res.msg)
            handleClose()
          }
        })
      }
    })
}

const { proxy }: any = getCurrentInstance()

onMounted(() => {
  proxy.mittBus.on('openChangeRoundNameBus', (row: any) => {
    gameId.value = Number(row.id)
    getMatchNameList()
  })
})
onUnmounted(() => {
  proxy.mittBus.off('openChangeRoundNameBus')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('table.ChangeTheNameOfTheRound')"
    width="500px"
    :before-close="handleClose"
  >
    <el-form ref="ruleFormRef" :model="formData" label-width="120px">
      <el-table :data="formData" style="width: 100%" border>
        <el-table-column :label="$t('table.bo')" min-width="180" align="center">
          <template #default="scope">
            {{ scope.row.match === 0 ? $t('other.total_') : `${$t('other.no')} ${scope.row.match} ${$t('other.b')}` }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.round_name')"
          min-width="240"
          align="center"
        >
          <template #default="scope">
            <el-form-item
              :prop="`${scope.$index}.stage_id`"
              :rules="[
                {
                  required: true,
                  trigger: 'change',
                  message: 'stage_id is required',
                },
              ]"
            >
              <el-select v-model="scope.row.stage_id" style="width: 100%">
                <el-option
                  v-for="item in roundNameList[`roundList${scope.row.match}`]
                    || []"
                  :key="item.id"
                  :label="item.content"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <span class="dialog-footer">
          <el-button @click="handleClose"> {{ $t("crud.cancel") }}</el-button>
          <el-button type="primary" @click="submit">
            {{ $t("crud.sure") }}
          </el-button>
        </span>
      </span>
    </template>
  </el-dialog>
</template>
