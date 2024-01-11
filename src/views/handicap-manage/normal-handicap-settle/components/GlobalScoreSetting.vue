<script name="GlobalScoreSetting" setup lang="ts">
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { otherPermission } from '../hooks/permission'
import {
  getGameInfo,
  setTeamScore,
} from '@/api/handicap-manage/fix-live-list'

const emits = defineEmits(['getStartTime'])
const route = useRoute()
const i18n = useI18n()
const dialogVisible = ref(false)
const gameInfo = ref<any>({})
const getGameInfoHandle = () => {
  getGameInfo({
    game_id: route.query.game_id,
  }).then((res: any) => {
    gameInfo.value = res.data
    emits('getStartTime', +res.data.game_start_time)
  })
}

function openScoreSet() {
  getGameInfoHandle()
  dialogVisible.value = true
}
function closeHandle() {
  dialogVisible.value = false
}

const setScore = (score1: number, score2: number) => {
  setTeamScore({
    game_id: route.query.game_id,
    score_one: score1,
    score_two: score2,
  }).then((res: any) => {
    if (+res.code === 1) {
      ElNotification.success(i18n.t('other.set_score_success'))
      closeHandle()
    }
  })
}
onMounted(() => {
  getGameInfoHandle()
})
</script>

<template>
  <!-- v-only="otherPermission.globalScoreSet" -->
  <el-button
    v-only="otherPermission.globalScoreSet"
    type="primary"
    @click="openScoreSet"
  >
    {{ $t("table.setScore") }}
  </el-button>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('table.setScore')"
    width="400px"
    :before-close="closeHandle"
  >
    <el-form :model="gameInfo" label-width="120px">
      <el-form-item :label="gameInfo.team_name_1">
        <el-input-number v-model="gameInfo.score_1" :step="1" step-strictly />
      </el-form-item>
      <el-form-item :label="gameInfo.team_name_2">
        <el-input-number v-model="gameInfo.score_2" :step="1" step-strictly />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeHandle">
          {{ $t("crud.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="setScore(gameInfo.score_1, gameInfo.score_2)"
        >
          {{ $t("crud.sure") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
