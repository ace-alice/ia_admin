<script setup lang="ts">
import { onMounted, ref } from 'vue'
import nApi from '@/api/handicap-manage/normal-handicap-settle'
import cApi from '@/api/handicap-manage/champion-handicap-settle'
const props = defineProps({
  gameInfo: {
    type: Object,
    default: () => {},
  },
  itemKey: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['close'])
const router = useRouter()
const tableData: any = ref([])
const row: any = ref({})
const getSubData = (key: string) => {
  if (['early_game_projects'].includes(key)) {
    return false
  }
  const status = ['pending_abort', 'champion_pending_abort'].includes(key)
    ? 4
    : ['champion_pending_set_winner', 'pending_set_winner'].includes(
        key,
      )
        ? 1
        : 2
  // 普通结算
  if (
    ['pending_abort', 'pending_set_winner', 'pending_confirm'].includes(key)
  ) {
    nApi
      .list({
        game_id: props.gameInfo.game_id,
        settle_status: status,
      })
      .then((res: any) => {
        if (res && +res.code === 1) {
          tableData.value = res.data.data
        }
      })
  }
  // 冠军盘结算
  else if (
    [
      'champion_pending_abort',
      'champion_pending_set_winner',
      'champion_pending_confirm',
    ].includes(key)
  ) {
    cApi
      .list({
        game_id: props.gameInfo.game_id,
        settle_status: status,
      })
      .then((res: any) => {
        if (res && +res.code === 1) {
          tableData.value = res.data.data
        }
      })
  }
}
const handleClick = (row: any) => {
  emit('close')
  if (
    ['pending_abort', 'pending_set_winner', 'pending_confirm'].includes(
      props.itemKey,
    )
  ) {
    const routePage = router.resolve({
      name: 'normaHandicapSettle',
      query: {
        game_id: props.gameInfo.game_id,
        game_name: row.play_name,
        // match: row.match_stage,
        vs_info: row.team_info,
      },
    })
    window.open(routePage.href, '_blank')
  }
  else {
    const routePage = router.resolve({
      name: 'championHandicapSettle',
      query: {
        game_id: props.gameInfo.game_id,
        game_name: row.team_name,
        event_name: props.gameInfo.name,
      },
    })
    window.open(routePage.href, '_blank')
  }
}
onMounted(() => {
  getSubData(props.itemKey)
})
</script>

<template>
  <el-table :data="tableData" style="width: 100%" @row-click="handleClick">
    <el-table-column label="ID" prop="id" />
    <el-table-column
      v-if="
        ['pending_abort', 'pending_set_winner', 'pending_confirm'].includes(
          props.itemKey,
        )
      "
      :label="$t('table.play_name')"
      prop="play_name"
    />

    <el-table-column
      v-if="
        [
          'champion_pending_abort',
          'champion_pending_set_winner',
          'champion_pending_confirm',
        ].includes(props.itemKey)
      "
      :label="$t('table.team_name')"
      prop="team_name"
    />
  </el-table>
</template>

<style scoped lang="scss"></style>
