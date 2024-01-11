<script setup lang="ts" name="MatchResultSettings">
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElNotification } from 'element-plus'
import { otherPermission } from '../hooks/permission'
import {
  getAutoSettleParamsApi,
  setAutoSettleParamsApi,
} from '@/api/handicap-manage/normal-handicap-settle'

const emit = defineEmits(['refresh'])

const dialogVisible = ref(false)

const route = useRoute()

const teamArr = ref<any[]>([])

const match = inject('match', 0)

const formData = reactive<any>({
  team_name_1: null,
  team_name_2: null,
})

const scoreInfo = reactive<any>({
  game_id: +(route.query?.game_id || 0),
  score_one: null,
  score_two: null,
  action: 'first',
  is_settle: false,
  img: null,
  type: 1,
})

const timeInfo = reactive<any>({
  game_id: +(route.query?.game_id || 0),
  action: 'first',
  is_settle: false,
  time: null,
  img: null,
  type: 2,
})

const winTeamInfo = reactive<any>({
  game_id: +(route.query?.game_id || 0),
  action: 'first',
  is_settle: false,
  team_id: null,
  img: null,
  type: 3,
})

// 设置form参数
function setScoreInfoTheForm(from: any) {
  Object.assign(scoreInfo, from)
}

function setTimeInfoTheForm(from: any) {
  Object.assign(timeInfo, from)
}

function setResultInfoTheForm(from: any) {
  Object.assign(winTeamInfo, from)
}

const scoreFormRef = ref<FormInstance>()

const timeFormRef = ref<FormInstance>()

const winTeamFormRef = ref<FormInstance>()

const scoreLoading = ref(false)

const timeOptions = ref<any[]>(
  new Array(60).fill(0).map((_, index) => {
    return {
      label: String(index).padStart(2, '0'),
      value: index,
    }
  }),
)

const timeMOptions = ref<any[]>(new Array(240).fill(0).map((_, index) => index))

const submitScore = () => {
  scoreFormRef.value
    && scoreFormRef.value.validate((valid) => {
      if (valid) {
        scoreLoading.value = true
        setAutoSettleParamsApi(scoreInfo)
          .then((res: any) => {
            if (+res.code === 1) {
              ElNotification.success('设置成功')
              dialogVisible.value = false
              setTimeout(() => {
                emit('refresh')
              }, 6000)
            }
          })
          .finally(() => {
            scoreLoading.value = false
          })
      }
    })
}

const timeLoading = ref(false)

const matchTime = reactive<any>({
  m: null,
  s: null,
})

function matchTimeChange() {
  Object.assign(timeInfo, {
    time: (matchTime.m || 0) * 60 + (matchTime.s || 0),
  })
}

function submitTime() {
  timeFormRef.value
    && timeFormRef.value.validate((valid) => {
      if (valid) {
        timeLoading.value = true
        setAutoSettleParamsApi(timeInfo)
          .then((res: any) => {
            if (+res.code === 1) {
              ElNotification.success('设置成功')
              dialogVisible.value = false
              setTimeout(() => {
                emit('refresh')
              }, 6000)
            }
          })
          .finally(() => {
            timeLoading.value = false
          })
      }
    })
}

const resultLoading = ref(false)

function submitResult() {
  winTeamFormRef.value
    && winTeamFormRef.value.validate((valid) => {
      if (valid) {
        resultLoading.value = true
        setAutoSettleParamsApi(winTeamInfo)
          .then((res: any) => {
            if (+res.code === 1) {
              ElNotification.success('设置成功')
              dialogVisible.value = false
              setTimeout(() => {
                emit('refresh')
              }, 6000)
            }
          })
          .finally(() => {
            resultLoading.value = false
          })
      }
    })
}

function getFinshInfo() {
  getAutoSettleParamsApi({
    game_id: scoreInfo.game_id,
    match: scoreInfo.match,
    // action: scoreInfo.action,
  }).then((res: any) => {
    if (+res.code === 1) {
      teamArr.value = []
      teamArr.value.push({
        team_id: +res.data.team_id_1,
        team_name: res.data.team_name_1,
      })
      teamArr.value.push({
        team_id: +res.data.team_id_2,
        team_name: res.data.team_name_2,
      })
      Object.assign(formData, {
        team_name_1: res.data.team_name_1,
        team_name_2: res.data.team_name_2,
      })

      Object.assign(scoreInfo, {
        score_one: res.data[`${scoreInfo.action}_score_one`],
        score_two: res.data[`${scoreInfo.action}_score_two`],
        img: res.data[`${scoreInfo.action}_img`],
        is_settle: res.data.is_settle,
      })
      Object.assign(timeInfo, {
        time: res.data[`${timeInfo.action}_time`],
        img: res.data[`${timeInfo.action}_time_img`],
        is_settle: res.data.is_time_settle,
      })
      Object.assign(winTeamInfo, {
        team_id: +res.data[`${winTeamInfo.action}_result`] || null,
        img: res.data[`${winTeamInfo.action}_result_img`],
        is_settle: res.data.is_result_settle,
      })
      if (timeInfo.time) {
        Object.assign(matchTime, {
          m: Math.floor(timeInfo.time / 60),
          s: timeInfo.time % 60,
        })
      }
    }
  })
}

function openDialog(
  setSortQ: 'first' | 'second' | 'final',
  match_stage: number,
) {
  Object.assign(matchTime, {
    m: null,
    s: null,
  })
  scoreInfo.action = setSortQ
  scoreInfo.match = match_stage
  timeInfo.action = setSortQ
  timeInfo.match = match_stage
  winTeamInfo.action = setSortQ
  winTeamInfo.match = match_stage
  if (scoreFormRef.value) {
    scoreFormRef.value?.resetFields()
  }
  if (timeFormRef.value) {
    timeFormRef.value?.resetFields()
  }
  if (winTeamFormRef.value) {
    winTeamFormRef.value?.resetFields()
  }
  getFinshInfo()
  dialogVisible.value = true
}
</script>

<template>
  <el-button
    v-only="otherPermission.finishSetOne"
    type="success"
    plain
    style="margin-left: 12px"
    @click="openDialog('first', match)"
  >
    {{ $t("table.entering_results_first") }}
  </el-button>
  <el-button
    v-only="otherPermission.finishSetTwo"
    type="warning"
    plain
    @click="openDialog('second', match)"
  >
    {{ $t("table.enter_the_results_second") }}
  </el-button>
  <el-button
    v-only="otherPermission.finishSetThree"
    type="danger"
    plain
    @click="openDialog('final', match)"
  >
    {{ $t("table.enter_final_results") }}
  </el-button>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('table.match_result_info')"
    width="1000px"
    destroy-on-close
  >
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t("table.score") }}</span>
          <el-button
            type="primary"
            :loading="scoreLoading"
            :disabled="!!scoreInfo.is_settle"
            @click="submitScore"
          >
            {{ $t("crud.sure") }}
          </el-button>
        </div>
      </template>
      <el-form ref="scoreFormRef" :model="scoreInfo" inline label-width="120px">
        <el-form-item
          :label="formData.team_name_1"
          prop="score_one"
          :rules="[{ required: true, message: 'score_one is required' }]"
        >
          <el-input-number
            v-model="scoreInfo.score_one"
            :disabled="!!scoreInfo.is_settle"
            :min="0"
            step-strictly
            :step="1"
          />
        </el-form-item>
        <el-form-item
          :label="formData.team_name_2"
          prop="score_two"
          :rules="[{ required: true, message: 'score_two is required' }]"
        >
          <el-input-number
            v-model="scoreInfo.score_two"
            :min="0"
            :disabled="!!scoreInfo.is_settle"
            step-strictly
            :step="1"
          />
        </el-form-item>
        <NormalImageUpload
          form-label=""
          :data="scoreInfo.img"
          imgkey="img"
          img-url-key="img"
          @set-image="setScoreInfoTheForm"
        />
      </el-form>
    </el-card>
    <el-card v-if="+match" class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t("table.play_time") }}</span>
          <el-button
            type="primary"
            :loading="timeLoading"
            :disabled="!!timeInfo.is_settle"
            @click="submitTime"
          >
            {{ $t("crud.sure") }}
          </el-button>
        </div>
      </template>
      <el-form ref="timeFormRef" :model="timeInfo" inline label-width="120px">
        <el-form-item
          :label="$t('table.play_time')"
          prop="time"
          :rules="[{ required: true, message: 'time is required' }]"
        >
          <el-select
            v-model="matchTime.m"
            filterable
            placeholder="mm"
            style="width: 100px"
            clearable
            class="select-reverse"
            :disabled="!!timeInfo.is_settle"
            @change="matchTimeChange"
          >
            <el-option
              v-for="item in timeMOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <span style="margin: 0 4px">:</span>
          <el-select
            v-model="matchTime.s"
            filterable
            placeholder="ss"
            style="width: 100px"
            clearable
            :disabled="!!timeInfo.is_settle"
            @change="matchTimeChange"
          >
            <el-option
              v-for="item in timeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <NormalImageUpload
          form-label=""
          :data="timeInfo.img"
          imgkey="img"
          img-url-key="img"
          @set-image="setTimeInfoTheForm"
        />
      </el-form>
    </el-card>
    <el-card v-if="+match" class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t("lib.win_lose_1") }}</span>
          <el-button
            type="primary"
            :loading="resultLoading"
            :disabled="!!winTeamInfo.is_settle"
            @click="submitResult"
          >
            {{ $t("crud.sure") }}
          </el-button>
        </div>
      </template>
      <el-form
        ref="winTeamFormRef"
        :model="winTeamInfo"
        inline
        label-width="120px"
      >
        <el-form-item
          :label="$t('lib.win_lose_1')"
          prop="team_id"
          :rules="[{ required: true, message: 'result is required' }]"
        >
          <el-radio-group v-model="winTeamInfo.team_id">
            <el-radio
              v-for="team in teamArr"
              :key="team.team_id"
              :label="team.team_id"
            >
              {{ team.team_name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <NormalImageUpload
          form-label=""
          :data="winTeamInfo.img"
          imgkey="img"
          img-url-key="img"
          @set-image="setResultInfoTheForm"
        />
      </el-form>
    </el-card>
  </el-dialog>
</template>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box-card + .box-card {
  margin-top: 5px;
}
.select-reverse {
  &:deep(.el-input__wrapper) {
    flex-direction: row-reverse;
    .el-input__inner {
      text-align: right;
    }
  }
}
</style>
