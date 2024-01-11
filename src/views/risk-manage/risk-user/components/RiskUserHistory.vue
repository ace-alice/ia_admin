<script setup lang="ts" name="RiskUserHistory">
import { getCurrentInstance, onMounted } from 'vue'
import { getHistory } from '@/api/risk-manage/risk-user'
import { parseTime } from '@/utils/formatTime'

const { proxy }: any = getCurrentInstance()

const dialogVisible = ref(false)

const historyList = ref<any[]>([])

function beforeHandle() {
  historyList.value = []
  dialogVisible.value = false
}

onMounted(() => {
  proxy.mittBus.on('getRiskUserHistoryBus', (parmas: { uid: string }) => {
    getHistory(parmas).then((res: any) => {
      if (+res.code === 1) {
        historyList.value = res.data
        dialogVisible.value = true
      }
    })
  })
})
onUnmounted(() => {
  proxy.mittBus.off('getRiskUserHistoryBus')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('table.risk_history')"
    :before-close="beforeHandle"
    width="1200px"
    destroy-on-close
  >
    <el-table
      :data="historyList"
      style="width: 1200px;"
      max-height="70vh"
      border
    >
      <el-table-column
        prop="username"
        :label="$t('table.username')"
        min-width="120"
        align="center"
      />
      <el-table-column
        prop="tag_name"
        :label="$t('table.risk_label')"
        min-width="120"
        align="center"
      />
      <el-table-column
        :label="$t('table.update_time1')"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          <div v-if="scope.row.update_time">
            {{ parseTime(scope.row.update_time) }}
          </div>
          <div v-else>
            --
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="game_name"
        :label="$t('table.trigger_object')"
        min-width="120"
        align="center"
      >
        <template #default="scope">
          <div v-if="scope.row.game_name">
            {{ scope.row.game_name }}
          </div>
          <div v-else>
            {{ $t('table.all_game') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="update_name"
        :label="$t('table.update_people')"
        min-width="120"
        align="center"
      />
      <el-table-column
        prop="notes"
        :label="$t('table.remark')"
        min-width="120"
        align="center"
      />
    </el-table>
  </el-dialog>
</template>
