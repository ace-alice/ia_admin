<script setup lang="ts" name="MatchResultSettings">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElNotification } from 'element-plus'
import { useRoute } from 'vue-router'
import { otherPermission } from '../../hooks/permission'
import {
  getAutoSettleParamsApi,
  setAutoSettleParamsApi,
} from '@/api/handicap-manage/normal-handicap-settle'

const emit = defineEmits(['refresh'])

const dialogVisible = ref(false)

const match = inject('match', 1)

const route = useRoute()

const teamArr = ref<any[]>([])

const winTeamInfo = reactive<any>({
  game_id: +(route.query?.game_id || 0),
  action: 'first',
  is_settle: false,
  team_id: null,
  img: null,
  type: 3,
})

function setResultInfoTheForm(from: any) {
  Object.assign(winTeamInfo, from)
}

const winTeamFormRef = ref<FormInstance>()

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
    game_id: winTeamInfo.game_id,
    match: winTeamInfo.match,
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

      Object.assign(winTeamInfo, {
        team_id: +res.data[`${winTeamInfo.action}_result`] || null,
        img: res.data[`${winTeamInfo.action}_result_img`],
        is_settle: res.data.is_result_settle,
      })
    }
  })
}

function openDialog(
  setSortQ: 'first' | 'second' | 'final',
  match_stage: number,
) {
  winTeamInfo.action = setSortQ
  winTeamInfo.match = match_stage
  if (winTeamFormRef.value) {
    winTeamFormRef.value?.resetFields()
  }
  getFinshInfo()
  dialogVisible.value = true
}
</script>

<template>
  <!-- v-only="otherPermission.finishSetOne" -->
  <el-button
    v-only="otherPermission.finishSetOne"
    type="success"
    plain
    style="margin-left: 12px"
    @click="openDialog('second', match)"
  >
    {{ $t("table.select_match_results") }}
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
