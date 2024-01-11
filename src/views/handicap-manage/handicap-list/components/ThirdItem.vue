<script setup lang="ts" name="ThirdItem">
import type { Ref } from 'vue'
import { CircleClose, Stamp } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import {
  getAntMatchApi,
  thirdBindListApi,
  thirdBindRemoveApi,
  thirdBindSaveApi,
} from '@/api/handicap-manage/handicap-list'

const props = defineProps({
  title: {
    type: String,
    default: 'title',
  },
  gameId: {
    type: String,
    default: '',
  },
  bindType: {
    type: Number,
    default: 0,
  },
})

const bindInfoDefault = {
  team_info: '',
  third_event_id: '',
  third_game_id: '',
}

const currentBindInfo = reactive(Object.assign({}, bindInfoDefault))

const formData: any = reactive({
  third_game_id: null,
  third_event_id: null,
  bind_type: props.bindType,
  team_info: null,
  matchTime: '',
})

const formLive = reactive<any>({
  animation: -1,
  url: '',
})

const ruleFormRef = ref<FormInstance>()

interface EventType {
  id: number
  event_name: string
  team_vs: string
  start_time: string
  [key: string]: any
}

const gameList: Ref<any[]> = ref([])

const eventList: Ref<EventType[]> = ref([])

const submitLoad = ref(false)

function changeThirdEvent(eventId: any) {
  formLive.url = null
  formLive.animation = null
  const eventInfo = eventList.value.find((event) => {
    return +eventId === +event.id
  })
  if (eventInfo) {
    formData.team_info = `${eventInfo.event_name || eventInfo.series.abbr}    ${
      eventInfo.team_vs
    }    ${eventInfo.start_time}`
  }
  if (eventInfo && +props.bindType === 1) {
    formLive.animation = eventInfo.has_push
    const weightList = (eventInfo.live_urls || [])
      .filter((event: any) => {
        return !event.is_deleted && (event.url || event.url2)
      })
      .sort((a: any, b: any) => {
        return a.weight - b.weight
      })
    if (weightList.length > 0) {
      formLive.url = weightList[0].url || weightList[0].url2
    }
  }
}

function thirdBindInfo() {
  submitLoad.value = true
  thirdBindListApi(props.gameId, props.bindType)
    .then((res: any) => {
      if (+res.code === 1) {
        gameList.value = res.data.game
        Object.assign(currentBindInfo, res.data.antInfo)
      }
    })
    .finally(() => {
      submitLoad.value = false
    })
}

function getTeamVs(teams: any) {
  if (teams.length === 2) {
    const team1 = teams[0].team_info?.name || teams[0].team?.name_cn
    const team2 = teams[1].team_info?.name || teams[1].team?.name_cn
    return `${team1} - VS - ${team2}`
  }
  return ''
}

function getAntMatch() {
  formLive.animation = -1
  formLive.url = ''
  formData.team_info = ''
  formData.third_event_id = null
  if (props.bindType && formData.third_game_id && formData.matchTime) {
    getAntMatchApi(
      formData.third_game_id,
      formData.matchTime,
      props.bindType,
    ).then((res: any) => {
      if (+res.code === 1) {
        eventList.value = []
        res.data.forEach((event: any) => {
          eventList.value.push(
            Object.assign({}, event, {
              id: +event.id,
              start_time: event.start_time,
              event_name: event.series?.name || 'eventName',
              team_vs: event.name || getTeamVs(event.teams),
            }),
          )
        })
      }
    })
  }
}

function thirdBindSave() {
  ruleFormRef.value
    && ruleFormRef.value.validate((valid) => {
      if (valid) {
        if (
          !props.gameId
          && props.bindType
          && formData.third_event_id
          && formData.third_game_id
        ) {
          return
        }
        submitLoad.value = true
        const form = Object.assign({}, formData, { game_id: props.gameId })
        if (+props.bindType === 1) {
          if (+formLive.animation === 1) {
            form.animation = 1
          }
          if (formLive.url) {
            form.url = formLive.url
          }
        }
        thirdBindSaveApi(form)
          .then((res: any) => {
            if (+res.code === 1) {
              Object.assign(currentBindInfo, {
                team_info: formData.team_info,
                third_event_id: formData.third_event_id,
                third_game_id: formData.third_game_id,
              })
            }
          })
          .finally(() => {
            submitLoad.value = false
          })
      }
    })
}

function thirdBindRemove() {
  if (!props.gameId && props.bindType && formData.third_event_id) {
    return
  }
  thirdBindRemoveApi(
    props.gameId,
    currentBindInfo.third_event_id,
    props.bindType,
  ).then((res: any) => {
    if (+res.code === 1) {
      Object.assign(currentBindInfo, bindInfoDefault)
    }
  })
}

onMounted(() => {
  setTimeout(() => {
    thirdBindInfo()
  }, (props.bindType - 1) * 500)
})
</script>

<template>
  <div v-loading="submitLoad" class="third-item">
    <div class="third-item-title">
      <div>{{ title }}</div>
      <div class="team-info">
        {{ currentBindInfo.team_info }}
      </div>
    </div>
    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="formData"
      label-width="220px"
    >
      <el-form-item
        :label="$t('table.game_time')"
        prop="matchTime"
        :rules="[{ required: true, message: 'required', trigger: 'change' }]"
      >
        <el-date-picker
          v-model="formData.matchTime"
          type="date"
          :placeholder="$t('table.game_time')"
          format="YYYY-MM-DD"
          value-format="X"
          style="width: 300px"
          @change="getAntMatch"
        />
      </el-form-item>
      <el-form-item
        :label="$t('table.third-party-games')"
        prop="third_game_id"
        :rules="[{ required: true, message: 'required', trigger: 'change' }]"
      >
        <el-select
          v-model="formData.third_game_id"
          :placeholder="$t('table.third-party-games')"
          @change="getAntMatch"
        >
          <el-option
            v-for="game in gameList"
            :key="game.id"
            :label="game.name"
            :value="game.id"
          />
        </el-select>
      </el-form-item>
      <br>
      <el-form-item
        :label="$t('table.third-party-events')"
        prop="third_event_id"
        :rules="[{ required: true, message: 'required', trigger: 'change' }]"
      >
        <el-select
          v-model="formData.third_event_id"
          :placeholder="$t('table.third-party-events')"
          style="width: 300px"
          filterable
          @change="changeThirdEvent"
        >
          <el-option
            v-for="event in eventList"
            :key="event.id"
            :label="event.team_vs"
            :value="event.id"
          >
            <div class="event-item">
              <span>{{ event.event_name }}</span>
              <span>{{ event.team_vs }}</span>
              <span>{{ event.start_time }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="third-footer">
      <el-button
        type="primary"
        :loading="submitLoad"
        :icon="Stamp"
        @click="thirdBindSave"
      >
        {{ $t("table.bind") }}
      </el-button>
      <el-button
        type="info"
        :loading="submitLoad"
        :icon="CircleClose"
        @click="thirdBindRemove"
      >
        {{ $t("table.bind_cancel") }}
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.third-item {
  padding: 20px 40px;

  & + .third-item {
    border-top: 1px solid #2a3746;
  }

  .third-item-title {
    font-size: 18px;
    font-weight: 600;
    padding-bottom: 20px;
  }

  .event-prefix {
    width: 200px;
    height: 100%;
    text-align: left;
  }

  .team-info {
    margin-top: 6px;
    white-space: pre-wrap;
    color: #50fa7b;
  }
}

.event-item {
  span + span {
    margin-left: 10px;
  }

  span:nth-child(1) {
    color: green;
  }

  span:nth-child(2) {
    color: yellow;
  }

  span:nth-child(3) {
    color: rebeccapurple;
  }
}
</style>
