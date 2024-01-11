<script lang="ts" setup name="seeDetail">
import type { Ref } from 'vue'
import { GobletSquare } from '@element-plus/icons-vue'
import { getGameDetailsApi } from '@/api/handicap-manage/handicap-list'
import { i18n } from '@/i18n'
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  gameId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['change'])

const dialogVisible = ref(props.show)

const matchInfo: Ref<any> = ref({
  bo: 0,
  team: [],
  match_data: [],
})

function getMatchInfo() {
  getGameDetailsApi(props.gameId).then((res: any) => {
    if (+res.code === 1) {
      matchInfo.value = res.data
    }
  })
}

function getTeamStatus(matchData: any[], bo: number, inx: number) {
  if (matchData.length < 1) {
    return false
  }
  else {
    const md = matchData.find((data: any) => {
      return +data.mactc === bo
    })
    if (md === -1) {
      return false
    }
    else {
      const tId = matchInfo.value.team[inx]?.id
      return +tId === +md.winner
    }
  }
}

const matchData = computed(() => {
  if (
    Array.isArray(matchInfo.value.team)
    && matchInfo.value.team.length > 1
    && matchInfo.value.bo
    && Array.isArray(matchInfo.value.match_data)
  ) {
    const temp: { round: string; team1: boolean; team2: boolean }[] = []
    for (let i = 0; i <= matchInfo.value.bo; i++) {
      temp.push({
        round:
          i === 0
            ? i18n.global.t('other.total_')
            : `${i18n.global.t('other.no')} ${i} ${i18n.global.t('other.b')}`,
        team1: getTeamStatus(matchInfo.value.match_data, i, 0),
        team2: getTeamStatus(matchInfo.value.match_data, i, 1),
      })
    }
    return temp
  }
  else {
    return []
  }
})

const team1 = computed(() => {
  return matchInfo.value.team[0]?.team_name || 'team1'
})

const team2 = computed(() => {
  return matchInfo.value.team[1]?.team_name || 'team1'
})

watch(
  () => dialogVisible.value,
  () => {
    emit('change', dialogVisible.value)
  },
)

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      getMatchInfo()
      dialogVisible.value = true
    }
  },
)
</script>

<template>
  <span>
    <el-dialog v-model="dialogVisible" title="比赛信息" width="50%" center>
      <el-table :data="matchData" style="width: 80%; margin: auto" border>
        <el-table-column prop="round" label="" align="center" />
        <el-table-column prop="team1" :label="team1" align="center">
          <template #default="scope">
            <el-icon v-if="scope.row.team1">
              <GobletSquare />
            </el-icon>
            <span v-else />
          </template>
        </el-table-column>
        <el-table-column prop="team2" :label="team2" align="center">
          <template #default="scope">
            <el-icon v-if="scope.row.team1">
              <GobletSquare />
            </el-icon>
            <span v-else />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </span>
</template>
