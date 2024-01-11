<script lang="ts" setup name="play-setting">
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElNotification } from 'element-plus'
import {
  getHandicapParam,
  setHandicapParam,
} from '@/api/handicap-manage/fix-live-list'

const emit = defineEmits(['refresh'])

const route = useRoute()

const playId = ref<any>('')

const defaultForm = {
  game_return_rate: null,
  single_limit: null,
  single_payout: null,
  single_game: null,
  lock_game_rate: null,
  global_set: null,
  play_id: null,
  game_id: null,
  stop_game: null,
  warning_game: null,
}

const dialogVisible = ref(false)

const ruleFormRef = ref<FormInstance>()

const proxyForm: any = reactive(Object.assign({}, defaultForm))

const initPage = () => {
  const params: any = {
    game_id: route.query?.game_id,
  }
  if (playId.value) {
    params.play_id = playId.value
  }
  getHandicapParam(params).then((res: any) => {
    if (res && +res.code === 1) {
      Object.assign(proxyForm, res.data)
    }
    else {
      Object.assign(proxyForm, defaultForm)
    }
  })
}

function submit() {
  ruleFormRef.value
    && ruleFormRef.value.validate((valid) => {
      if (valid) {
        setHandicapParam(
          Object.assign({}, proxyForm, {
            game_id: Number(route.query?.game_id),
            play_id: playId.value,
          }),
        ).then((res: any) => {
          if (+res.code === 1) {
            ElNotification.success('玩法参数设置成功')
            dialogVisible.value = false
            emit('refresh')
          }
        })
      }
    })
}

const validateReturn = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the return rate !'))
  }
  else if (
    value < +proxyForm.min_rate_return
    || value > +proxyForm.max_rate_return
  ) {
    callback(
      new Error(`${proxyForm.min_rate_return} - ${proxyForm.max_rate_return}`),
    )
  }
  else {
    callback()
  }
}

const { proxy }: any = getCurrentInstance()

onMounted(() => {
  proxy.mittBus.on('openPlaySettingBus', (play_id: any) => {
    playId.value = +play_id
    initPage()
    dialogVisible.value = true
  })
})

onUnmounted(() => {
  proxy.mittBus.off('openPlaySettingBus')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('other.game_param')"
    width="1000px"
    destroy-on-close
  >
    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="proxyForm"
      label-width="140px"
    >
      <el-row>
        <el-form-item
          v-if="+proxyForm.min_rate_return && +proxyForm.max_rate_return"
          :label="$t('table.game_return_rate')"
          prop="game_return_rate"
          :rules="[
            {
              required: true,
              message: $t('table.game_return_rate') + $t('table.not_empty'),
              trigger: 'blur',
            },
            {
              validator: validateReturn,
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model.number="proxyForm.game_return_rate"
            type="number"
            clearable
            :placeholder="`${proxyForm.min_rate_return || 0}-${
              proxyForm.max_rate_return || 0
            }`"
            style="width: 200px"
          />
          <el-row>
            <span>{{ $t("crud.return_rate")
            }}{{ `${proxyForm.rate_return}%，` }}</span>
            <span>
              {{ $t("crud.current_value")
              }}{{ `${proxyForm.game_return_rate - proxyForm.rate_return}%` }}
            </span>
          </el-row>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item
          :label="$t('table.single_limit')"
          prop="single_limit"
          :rules="[
            {
              required: true,
              message: $t('table.single_limit') + $t('table.not_empty'),
            },
          ]"
        >
          <el-input
            v-model="proxyForm.single_limit"
            type="number"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
          <el-row>
            <span>{{ $t("crud.limit_red_r")
            }}{{ `${proxyForm.limit_ratio}%，` }}</span>
            <span>
              {{ $t("crud.current_value")
              }}{{
                `${
                  (proxyForm.single_limit * proxyForm.limit_ratio) / 100 || 0
                } ， `
              }}
            </span>
            <span>
              {{ $t("crud.username_limit_red")
              }}{{
                `${
                  (proxyForm.single_limit * proxyForm.limit_ratio * (+proxyForm.payout_scale / 100)) / 100 || 0
                } ， `
              }}
            </span>
            <span>
              {{ $t("table.default_value_num") }}：{{
                proxyForm.default_single_limit
              }}
            </span>
          </el-row>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item
          :label="$t('table.single_payout')"
          prop="single_payout"
          :rules="[
            {
              required: true,
              message: $t('table.single_payout') + $t('table.not_empty'),
            },
          ]"
        >
          <el-input
            v-model="proxyForm.single_payout"
            type="number"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
          <el-row>
            <div>
              {{ $t("crud.limit_red_r") }}{{ `${proxyForm.limit_ratio}%，` }}
            </div>
            <div>
              {{ $t("crud.current_value")
              }}{{
                `${
                  (proxyForm.single_payout
                    * proxyForm.limit_ratio
                    * proxyForm.payout_scale)
                  / 100
                  / 100 || 0
                } ，`
              }}
            </div>
            <span>
              {{ $t("table.default_value_num") }}：{{
                proxyForm.default_single_payout
              }}
            </span>
          </el-row>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item
          :label="$t('table.single_play_payout')"
          prop="single_game"
          :rules="[
            {
              required: true,
              message: $t('table.single_play_payout') + $t('table.not_empty'),
            },
          ]"
        >
          <el-input
            v-model="proxyForm.single_game"
            type="number"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
          <el-row>
            <div>
              {{ $t("crud.limit_red_r") }}{{ `${proxyForm.limit_ratio}%，` }}
            </div>
            <div>
              {{ $t("crud.current_value")
              }}{{
                `${
                  (proxyForm.single_game
                    * proxyForm.limit_ratio
                    * proxyForm.payout_scale)
                  / 100
                  / 100 || 0
                } ，`
              }}
            </div>
            <span>
              {{ $t("table.default_value_num") }}：{{
                proxyForm.default_single_game
              }}
            </span>
          </el-row>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item
          :label="$t('table.stop_game')"
          prop="stop_game"
          :rules="[
            {
              required: true,
              message: $t('table.stop_game') + $t('table.not_empty'),
            },
          ]"
        >
          <el-input
            v-model="proxyForm.stop_game"
            type="number"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
          <div style="margin-right: 5px;">
            {{ $t("table.default_value_num") }}：{{
              proxyForm.default_stop_game
            }}
          </div>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item
          :label="$t('table.warning_game')"
          prop="warning_game"
          :rules="[
            {
              required: true,
              message: $t('table.warning_game') + $t('table.not_empty'),
            },
          ]"
        >
          <el-input
            v-model="proxyForm.warning_game"
            type="number"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
          <div style="margin-right: 5px;">
            {{ $t("table.default_value_num") }}：{{
              proxyForm.default_warning_game
            }}
          </div>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item
          :label="$t('table.lock_rate')"
          prop="lock_game_rate"
          :rules="[
            {
              required: true,
              message: $t('table.lock_rate') + $t('table.not_empty'),
            },
          ]"
        >
          <el-radio-group v-model="proxyForm.lock_game_rate">
            <el-radio :label="1">
              {{ $t("other.lock") }}
            </el-radio>
            <el-radio :label="0">
              {{ $t("other.unlock") }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t("crud.cancel") }}
        </el-button>
        <el-button type="primary" @click="submit">
          {{ $t("crud.sure") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.el-row {
  margin-left: 10px;
  div:nth-child(2) {
    margin-left: 5px;
  }
}
</style>
