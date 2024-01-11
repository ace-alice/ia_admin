<script lang="ts" setup>
import { ref } from 'vue'
import History1 from './components/history1.vue'
import History2 from './components/history2.vue'
import History3 from './components/history3.vue'

const route = useRoute()

const gameId = ref<any>(Number(route.query?.game_id))

const playId = ref<any>('')

const playName = ref('')

const teamOptions = ref<any[]>([])

const activeName = ref('history1')

const dialogVisible = ref(false)

const { proxy }: any = getCurrentInstance()

onMounted(() => {
  proxy.mittBus.on(
    'openHistoryBus',
    ({
      play_id,
      teams,
      play_name,
    }: {
      play_id: any
      teams: any[]
      play_name?: string
    }) => {
      playId.value = +play_id
      teamOptions.value = teams
      playName.value = play_name || ''
      dialogVisible.value = true
    },
  )
})

onUnmounted(() => {
  proxy.mittBus.off('openHistoryBus')
})
</script>

<template>
  <el-dialog v-model="dialogVisible" width="1400px" destroy-on-close>
    <template #header>
      {{ $t("router.operate-history") }}
      <span style="margin-left: 12px; color: rgb(249, 33, 33); font-size: 18px">{{
        playName
      }}</span>
    </template>
    <el-tabs v-model="activeName">
      <el-tab-pane
        :label="$t('other.odds_change_history')"
        name="history1"
        lazy
      >
        <History1 :teams="teamOptions" :game-id="gameId" :play-id="playId" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('other.record_modify_history')"
        name="history2"
        lazy
      >
        <History2 :game-id="gameId" :play-id="playId" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('other.pause_resume_history')"
        name="history3"
        lazy
      >
        <History3 :game-id="gameId" :play-id="playId" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.search-box){
  display: none;
}
</style>
