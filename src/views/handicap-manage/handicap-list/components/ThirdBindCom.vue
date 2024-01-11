<script lang="ts" setup name="ThirdBindCom">
import { useI18n } from 'vue-i18n'
import ThirdItem from './ThirdItem.vue'
import { parseTime } from '@/utils/formatTime'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  gameId: {
    type: String,
    default: '',
  },
  matchInfo: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['change'])

const dialogVisible = ref(props.show)
const i18n = useI18n()

const thirdList = [
  {
    title: i18n.t('crud.live_stream'),
    code: 'live',
    data: 1,
    show: () => true,
  },
  // { title: i18n.t('crud.sport_score'), code: 'score', data: 2 },
  {
    title: i18n.t('crud.esport_odds'),
    code: 'e_odd',
    data: 3,
    show: () => true,
  },
  // { title: i18n.t('crud.sport_odds'), code: 's_live', data: 4 },
  {
    title: i18n.t('crud.before_game_info'),
    code: 's_live',
    data: 5,
    show: () => [1, 2, 3, 16].includes(+props.matchInfo.game_type_id),
  },
]

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
      dialogVisible.value = true
    }
  },
)
</script>

<template>
  <span>
    <el-dialog
      v-model="dialogVisible"
      :title="$t('crud.thirdBind')"
      width="1200px"
      destroy-on-close
    >
      <div class="match-info">
        <span>{{ parseTime(matchInfo.game_start_time) }}</span>
        <span>{{ matchInfo.game_name }}</span>
        <span>{{ matchInfo.event_name }}</span>
        <span>{{ matchInfo.team_id_1_name }} VS
          {{ matchInfo.team_id_2_name }}</span>
        <span>BO{{ matchInfo.matches }}</span>
      </div>
      <template v-for="third in thirdList" :key="third.data">
        <ThirdItem
          v-if="third.show()"
          :title="third.title"
          :game-id="gameId"
          :bind-type="third.data"
        />
      </template>
    </el-dialog>
  </span>
</template>

<style lang="scss" scoped>
.match-info {
  font-size: 18px;
  color: rgb(245, 196, 19);

  span + span {
    margin-left: 24px;
  }
}
</style>
