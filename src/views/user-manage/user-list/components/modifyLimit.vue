<script setup lang="ts" name="modifyLimit">
import type { FormInstance } from 'element-plus'
import { ElMessage, ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Delete, Plus } from '@element-plus/icons-vue'
import Api from '@/api/user-manage/user-list'
import getGameListHook from '@/hooks/getGameListHook'

const { proxy }: any = getCurrentInstance()

const i18n = useI18n()

const dialogVisible = ref(false)

const defaultForm: any = {
  username: null,
  user_id: null,
  limit_type: 0,
  limit_money: null,
  user_total_limit: null,
  limit_game: null,
  user_parlay_single_limit: null,
  user_parlay_total_limit: null,
}
const { gameList } = getGameListHook(false, false)

interface LimitGameArrType {
  game_id: number | null
  amount: number | null
}

const limitGameArr = ref<LimitGameArrType[]>([])

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive(Object.assign({}, defaultForm))
const option1: any = ref([
  {
    label: i18n.t('lib.user_limit_type_0' /** 固定额度 */),
    value: 0,
  },
  {
    label: i18n.t('lib.user_limit_type_1' /** 百分比 */),
    value: 1,
  },
])

function handleClose() {
  Object.assign(ruleForm, defaultForm)
  limitGameArr.value = []
  dialogVisible.value = false
}

function submitForm() {
  limitGameArr.value = limitGameArr.value.filter((limit) => {
    return limit.game_id && limit.amount
  })
  if (limitGameArr.value.length > 0) {
    ruleForm.limit_game = ''
    const temp: any = {}
    limitGameArr.value.forEach((lt) => {
      temp[String(lt.game_id)] = lt.amount
    })
    ruleForm.limit_game = temp
  }
  else {
    ruleForm.limit_game = ''
  }
  ruleFormRef.value
    && ruleFormRef.value.validate((valid) => {
      if (valid) {
        Api.userEditLimit({
          user_id: ruleForm.user_id,
          limit_type: ruleForm.limit_type,
          limit_money: Number(ruleForm.limit_money),
          user_total_limit: Number(ruleForm.user_total_limit),
          limit_game: ruleForm.limit_game,
          user_parlay_single_limit: Number(ruleForm.user_parlay_single_limit),
          user_parlay_total_limit: Number(ruleForm.user_parlay_total_limit),
        }).then((res: any) => {
          if (res && res.code === 1) {
            ElNotification.success(res.msg)
            handleClose()
          }
        })
      }
    })
}

onMounted(() => {
  proxy.mittBus.on('modify_limit', (row: any) => {
    ruleForm.user_id = row.user_id
    ruleForm.username = row.username
    Api.userLimitList({
      user_id: row.user_id,
    })
      .then((res: any) => {
        if (res && res.code === 1) {
          ruleForm.limit_type = res.data.limit_type
          ruleForm.limit_money = res.data.limit_money
          ruleForm.user_total_limit = res.data.user_total_limit
          ruleForm.user_parlay_single_limit = res.data.user_parlay_single_limit
          ruleForm.user_parlay_total_limit = res.data.user_parlay_total_limit
          ruleForm.limit_game = JSON.parse(res.data.limit_game)
          if (ruleForm.limit_game) {
            limitGameArr.value = Object.keys(ruleForm.limit_game).map((limitKey: string) => {
              return {
                game_id: +limitKey,
                amount: +ruleForm.limit_game[limitKey],
              }
            })
          }
        }
      })
      .finally(() => {
        dialogVisible.value = true
      })
  })
})

function addLimit() {
  limitGameArr.value.push({
    game_id: null,
    amount: null,
  })
}

function deleteLimit(idx: number) {
  limitGameArr.value.splice(idx, 1)
}

function gameIdChange(idx: any) {
  const hasGameId = limitGameArr.value.some((limit, index) => {
    return index !== idx && limit.game_id === limitGameArr.value[idx].game_id
  })
  if (hasGameId) {
    limitGameArr.value[idx].game_id = null
    ElMessage.warning(i18n.t('table.game_already_exists'))
  }
}
onUnmounted(() => {
  proxy.mittBus.off('modify_limit')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('crud.modify_limit')"
    width="700px"
    :before-close="handleClose"
    destroy-on-close
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item
        :label="$t('table.bet_username' /**用户名 */)"
        prop="username"
      >
        <el-input
          v-model="ruleForm.username"
          disabled
          :placeholder="$t('other.pls_input')"
          style="width: 200px;"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="$t('table.quota_mode' /**限制模式 */)"
        prop="limit_type"
        :rules="[
          {
            required: true,
            message: $t('table.quota_mode') + $t('table.not_empty'),
          },
        ]"
      >
        <el-select
          v-model="ruleForm.limit_type"
          :placeholder="$t('table.quota_mode')"
          style="width: 200px;"
        >
          <el-option
            v-for="role in option1"
            :key="role.value"
            :label="role.label"
            :value="role.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="ruleForm.limit_type === 0"
        :label="$t('table.single_t_limit' /**单笔限制 */)"
        prop="limit_money"
        :rules="[
          {
            required: true,
            message: $t('table.single_t_limit') + $t('table.not_empty'),
          },
        ]"
      >
        <el-input
          v-model="ruleForm.limit_money"
          :placeholder="$t('other.pls_input')"
          style="width: 200px;"
          clearable
        />
      </el-form-item>
      <el-form-item
        v-if="ruleForm.limit_type === 1"
        :label="$t('table.restriction_percent' /**限制百分比 */)"
        prop="limit_money"
        :rules="[
          {
            required: true,
            message: $t('table.restriction_percent') + $t('table.not_empty'),
          },
        ]"
      >
        <el-input
          v-model="ruleForm.limit_money"
          :placeholder="$t('other.pls_input')"
          style="width: 200px;"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="$t('table.accumulative_limit' /**累计限额 */)"
        prop="user_total_limit"
        :rules="[
          {
            required: true,
            message: $t('table.accumulative_limit') + $t('table.not_empty'),
          },
        ]"
      >
        <el-input
          v-model="ruleForm.user_total_limit"
          :placeholder="$t('other.pls_input')"
          style="width: 200px;"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="$t('table.user_parlay_single_limit' /** user_parlay_single_limit */)"
        prop="user_parlay_single_limit"
        :rules="[
          {
            required: true,
            message: $t('table.user_parlay_single_limit') + $t('table.not_empty'),
          },
        ]"
      >
        <el-input
          v-model="ruleForm.user_parlay_single_limit"
          :placeholder="$t('other.pls_input')"
          style="width: 200px;"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="$t('table.user_parlay_total_limit' /** user_parlay_total_limit */)"
        prop="user_parlay_total_limit"
        :rules="[
          {
            required: true,
            message: $t('table.user_parlay_total_limit') + $t('table.not_empty'),
          },
        ]"
      >
        <el-input
          v-model="ruleForm.user_parlay_total_limit"
          :placeholder="$t('other.pls_input')"
          style="width: 200px;"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="$t('table.limit_game' /**累计限额 */)"
        prop="limit_game"
      >
        <el-table :data="limitGameArr" border style="width: 520px;">
          <el-table-column
            prop="game_id"
            align="center"
            :label="$t('other.game')"
            width="220"
          >
            <template #default="scope">
              <el-select
                v-model="scope.row.game_id"
                :placeholder="$t('table.to-select')"
                style="width: 190px;"
                filterable
                @change="gameIdChange(scope.$index)"
              >
                <el-option
                  v-for="role in gameList"
                  :key="role.id"
                  :label="role.game_name"
                  :value="role.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            align="center"
            :label="$t('table.limit_game')"
            width="220"
          >
            <template #default="scope">
              <el-input
                v-model="scope.row.amount"
                :placeholder="$t('other.pls_input')"
                style="width: 190px;"
                type="number"
                clearable
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            align="center"
            :label="$t('table.limit_game')"
            width="80"
          >
            <template #header>
              <el-button
                type="primary"
                :icon="Plus"
                circle
                size="small"
                @click="addLimit"
              />
            </template>
            <template #default="scope">
              <el-button
                type="danger"
                :icon="Delete"
                circle
                size="small"
                @click="deleteLimit(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">
          {{ $t("crud.cancel") }}
        </el-button>
        <el-button type="primary" @click="submitForm">
          {{ $t("crud.sure") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
