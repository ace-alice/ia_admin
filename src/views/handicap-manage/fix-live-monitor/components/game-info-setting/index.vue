<script setup lang="ts" name="game-info-setting">
import { VideoPause, VideoPlay } from '@element-plus/icons-vue'
import gameInfoHook from '../../hooks/gameInfoHook'
import {
  toolPermission,
} from '../../hooks/permission'
import { autoRefreshOptionsDefault } from '@/components/Crud/lib/defaultSetting'
const emit = defineEmits(['change'])

const {
  dialogVisible,
  open,
  setScore,
  startLive,
  rejectOrder,
  handicapTime,
  closeHandle,
  gameInfo,
} = gameInfoHook()

watch(() => gameInfo.value, () => {
  emit('change', gameInfo.value)
}, { deep: true })

const category_id = computed(() => gameInfo.value.category_id)

const { proxy }: any = getCurrentInstance()

onMounted(() => {
  proxy.mittBus.on('gameInfoSettingBus', (data: any) => {
    switch (data.type) {
      case 'message_trader_edit_reject_time__push':
        Object.assign(gameInfo.value, { reject_time: +data.data.time })
        break
      case 'message_type_game_play_edit':
        Object.assign(gameInfo.value, { game_start_time: +data.data.game_start_time })
        break
      case 'message_type_team_score_set':
        Object.assign(gameInfo.value, { score_1: +data.data.score_1, score_2: +data.data.score_2 })
        break
      case 'message_type_handicap_edit':
        window.location.reload()
        break
    }
  })
})

onUnmounted(() => {
  proxy.mittBus.off('gameInfoSettingBus')
})
</script>

<template>
  <div class="game-info-setting">
    <div class="start-roll">
      <span style="margin-right: 10px">{{ gameInfo.event_name }}</span>
      <el-icon v-if="gameInfo.category_id === 3" size="24" class="notAllow">
        <VideoPause />
      </el-icon>
      <el-icon v-else size="24" @click="startLive">
        <VideoPlay v-only="toolPermission.startRoll" />
      </el-icon>
    </div>
    <div>{{ gameInfo.team_name_1 }} VS {{ gameInfo.team_name_2 }}</div>
    <div>{{ gameInfo.id }}</div>
    <div v-only="toolPermission.setStartTime" class="start-time">
      <el-date-picker
        v-model="gameInfo.game_start_time"
        type="datetime"
        style="width: 200px"
        :placeholder="$t('table.game_start_time')"
        value-format="X"
        @change="handicapTime"
      />
    </div>
    <div v-if="+category_id === 3" class="reject">
      <span style="margin-right: 10px">{{ $t('table.reject') }}</span>
      <el-select
        v-model="gameInfo.reject_time"
        v-only="toolPermission.turnReject"
        style="width: 120px"
        @change="rejectOrder(gameInfo.reject_time)"
      >
        <el-option
          v-for="item in autoRefreshOptionsDefault"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div>
      <el-button v-only="toolPermission.setScore" type="primary" @click="open">
        {{ $t('table.setScore') }}
      </el-button>
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="$t('table.setScore')"
      width="400px"
      :before-close="closeHandle"
    >
      <el-form :model="gameInfo" label-width="120px">
        <el-form-item :label="gameInfo.team_name_1">
          <el-input-number
            v-model="gameInfo.score_1"
            :step="1"
            step-strictly
          />
        </el-form-item>
        <el-form-item :label="gameInfo.team_name_2">
          <el-input-number
            v-model="gameInfo.score_2"
            :step="1"
            step-strictly
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeHandle">
            {{ $t('crud.cancel') }}
          </el-button>
          <el-button type="primary" @click="setScore(gameInfo.score_1, gameInfo.score_2)">
            {{ $t('crud.sure') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.game-info-setting {
  display: flex;
  align-items: center;
  & > div {
    margin: 0 20px;
  }
  .start-roll{
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .notAllow{
    cursor: not-allowed !important;
  }

}
</style>
