<script setup lang="ts" name="GlobalSettle">
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElNotification } from 'element-plus'
import { otherPermission } from '../hooks/permission'
import {
  getGameWinLossApi,
  setGameWinLossApi,
} from '@/api/handicap-manage/normal-handicap-settle'

const dialogVisible = ref(false)

const teamInfo = ref<{ team_name: string; team_id: number }[]>([])

const route = useRoute()

const formData = reactive<any>({
  game_id: +(route.query?.game_id || 0),
  team_id: undefined,
})

const isFinsh = ref(false)

const ruleFormRef = ref<FormInstance>()

const loading = ref(false)

const submit = () => {
  ruleFormRef.value
    && ruleFormRef.value.validate((valid) => {
      if (valid) {
        loading.value = true
        setGameWinLossApi(formData)
          .then((res: any) => {
            if (+res.code === 1) {
              ElNotification.success('设置成功')
              dialogVisible.value = false
              isFinsh.value = true
            }
          })
          .finally(() => {
            loading.value = false
          })
      }
    })
}

function getFinshInfo() {
  getGameWinLossApi({ game_id: formData.game_id }).then((res: any) => {
    if (+res.code === 1) {
      teamInfo.value = res.data.choices
      formData.team_id
        = res.data.winner_team_id === 'draw'
          ? 'draw'
          : Number(res.data.winner_team_id) || undefined
      isFinsh.value = !!res.data.winner_team_id
    }
  })
}

function openDialog() {
  if (ruleFormRef.value) {
    ruleFormRef.value?.resetFields()
  }
  getFinshInfo()
  dialogVisible.value = true
}

const router = useRouter()

function toChangeList(category_id: any) {
  if (!route.query.game_id) {
    return
  }
  const routePage = router.resolve({
    path: '/financial-manage/odds-betting-report',
    query: {
      game_id: route.query.game_id,
      category_id,
    },
  })
  window.open(routePage.href, '_blank')
}

onMounted(() => {
  getFinshInfo()
})
</script>

<template>
  <el-button type="primary" @click="openDialog">
    {{ $t("other.set_betting") }}
  </el-button>
  <el-button
    v-if="isFinsh"
    v-only="otherPermission.seeOddChange"
    type="info"
    style="margin-left: 12px"
    @click="toChangeList(2)"
  >
    {{ $t("table.fix_odd_list") }}
  </el-button>
  <el-button
    v-if="isFinsh"
    v-only="otherPermission.seeOddChange"
    type="info"
    @click="toChangeList(3)"
  >
    {{ $t("table.live_odd_list") }}
  </el-button>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('other.set_betting')"
    width="500px"
  >
    <el-form
      ref="ruleFormRef"
      :model="formData"
      label-width="180px"
      label-position="top"
    >
      <el-form-item
        :label="$t('lib.win_lose_1')"
        prop="team_id"
        :rules="[{ required: true, message: 'team_id is required' }]"
      >
        <el-radio-group v-model="formData.team_id">
          <el-radio
            v-for="team in teamInfo"
            :key="team.team_id"
            :label="team.team_id"
          >
            {{ team.team_name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button :disabled="loading" @click="dialogVisible = false">{{
          $t("crud.cancel")
        }}</el-button>
        <el-button :loading="loading" type="primary" @click="submit">
          {{ $t("crud.sure") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
