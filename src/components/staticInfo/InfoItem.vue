<script setup lang="ts" name="InfoItem">
import subItem from './subItem.vue'
import { parseTime } from '@/utils/formatTime'
import { pendingInfo } from '@/api/handicap-manage/champoin-list'
const props = defineProps({
  itemKey: {
    type: String,
    default: '',
  },
  getInfoKey: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits(['closeDialog'])
const router = useRouter()
const listInfo: any = ref([])
const gameInfo: any = ref(0)
function getList() {
  pendingInfo({ info_key: props.itemKey }).then((res: any) => {
    if (+res.code === 1) {
      listInfo.value = res.data
    }
  })
}

const expandRowKeys = ref([])
const handleExpand = (row: any, rows: any) => {
  const isExpend = rows.some((r: any) => r.id === row.id)
  if (!isExpend) {
    return
  }
  gameInfo.value = row
  expandRowKeys.value = rows.map((r: any) => r.game_id)
}
const close = () => {
  emit('closeDialog')
}

const toTradePage = (row: any) => {
  // 操盘投注
  if (['early_game_projects'].includes(props.itemKey)) {
    return
  }
  close()
  if (['champion_stop_game'].includes(props.itemKey)) {
    const routePage = router.resolve({
      name: 'championList',
      query: {
        game_id: row.game_id,
        match: 0,
      },
    })
    window.open(routePage.href, '_blank')
  }
  else {
    const routePage = router.resolve({
      name: 'fixLiveMonitor',
      query: {
        game_id: row.game_id,
        c_match: +row.match || 1,
      },
    })
    window.open(routePage.href, '_blank')
  }
}
const handleClick = (row: any) => {
  close()
  if (
    ['pending_abort', 'pending_set_winner', 'pending_confirm'].includes(
      props.itemKey,
    )
  ) {
    const routePage = router.resolve({
      name: 'normaHandicapSettle',
      query: {
        game_id: row.game_id,
        game_name: row.play_name,
        match: row.match_stage,
        vs_info: row.name,
      },
    })
    window.open(routePage.href, '_blank')
  }
  else {
    const routePage = router.resolve({
      name: 'championHandicapSettle',
      query: {
        game_id: row.game_id,
        game_name: row.team_name,
        event_name: row.name,
      },
    })
    window.open(routePage.href, '_blank')
  }
}
watch(
  () => props.getInfoKey,
  () => {
    getList()
  },
)
onMounted(() => {
  getList()
})
</script>

<template>
  <el-table
    v-if="
      [
        'early_game_projects',
        'early_stop_game',
        'early_game_profit',
        'champion_stop_game',
      ].includes(itemKey)
    "
    :data="listInfo"
    style="width: 100%"
    height="500px"
    @row-click="toTradePage"
  >
    <el-table-column
      v-if="itemKey === 'early_game_profit'"
      prop="time"
      :label="$t('table.warn_time')"
      min-width="180"
      align="center"
    >
      <template #default="scope">
        <span v-if="scope.row.time">{{ parseTime(scope.row.time) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="game_id"
      :label="$t('table.game_id')"
      min-width="80"
      align="center"
    />
    <el-table-column
      v-if="itemKey !== 'early_game_profit'"
      prop="name"
      :label="$t('table.game_info')"
      min-width="180"
      align="center"
    />
    <el-table-column
      v-if="itemKey === 'early_game_profit'"
      prop="game_info"
      :label="$t('table.game_info')"
      min-width="160"
      align="center"
    />
    <el-table-column
      v-if="itemKey === 'early_game_profit'"
      prop="match_name"
      :label="$t('table.round_name')"
      min-width="100"
      align="center"
    />
    <el-table-column
      v-if="itemKey === 'early_game_profit'"
      prop="play_name"
      :label="$t('table.play_name')"
      min-width="140"
      align="center"
    />
    <el-table-column
      v-if="itemKey === 'early_game_profit'"
      prop="bet_amount"
      :label="$t('table.bet_amount')"
      min-width="120"
      align="center"
    />
    <el-table-column
      v-if="itemKey === 'early_game_profit'"
      prop="profit"
      :label="$t('other.early_game_profit')"
      min-width="120"
      align="center"
    />
    <el-table-column
      v-if="itemKey !== 'early_game_profit'"
      prop="count"
      label="count"
      min-width="180"
      align="center"
    />
  </el-table>
  <el-table
    v-else
    :data="listInfo"
    style="width: 100%"
    height="500px"
    row-key="game_id"
    :expand-row-keys="expandRowKeys"
    @expand-change="handleExpand"
    @row-click="handleClick"
  >
    <el-table-column type="expand">
      <sub-item :game-info="gameInfo" :item-key="itemKey" @close="close" />
    </el-table-column>
    <el-table-column
      prop="game_id"
      :label="$t('table.game_id')"
      min-width="100"
      align="center"
    />
    <el-table-column
      v-if="!['champion_pending_confirm', 'champion_pending_abort'].includes(itemKey)"
      prop="event_name"
      :label="$t('table.event_name')"
      min-width="120"
      align="center"
    />
    <el-table-column
      prop="name"
      :label="$t('table.game_info')"
      min-width="180"
      align="center"
    />
    <el-table-column
      prop="count"
      label="count"
      min-width="100"
      align="center"
    />
  </el-table>
</template>
