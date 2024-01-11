<script setup lang="ts" name="BindPlay">
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {
  bindPlayApi,
  getBindPlayApi,
  getThirdGameApi,
  getThirdPlayApi,
} from '@/api/match-data-manage/team-manage'

const { proxy }: any = getCurrentInstance()

const i18n = useI18n()

const dialogVisible = ref(false)

const ruleFormRef = ref<FormInstance>()

const defaultForm: any = {
  id: null,
  company_id: null,
  game_id: null,
  play_id: [],
  is_bind: 1,
}

const ruleForm = reactive(Object.assign({}, defaultForm))

const hasCheckPlay = ref<number[]>([])

const bindPlayList = ref<any[]>([])

const companyList = [
  { label: '蚂蚁电竞', value: 1 },
  { label: '蚂蚁体育', value: 2 },
]

const gameList = ref<any[]>([])
const playList = ref<any[]>([])

function companyChange() {
  ruleForm.game_id = null
  ruleForm.play_id = []
  getThirdGameApi({ company_id: ruleForm.company_id }).then((res: any) => {
    if (+res.code === 1) {
      gameList.value = res.data
    }
  })
}

function gameChange() {
  ruleForm.play_id = []
  if (ruleForm.company_id === 2) {
    return false
  }
  getThirdPlayApi({
    company_id: ruleForm.company_id,
    game_id: ruleForm.game_id,
  }).then((res: any) => {
    if (+res.code === 1) {
      playList.value = res.data
    }
  })
}

const rules = reactive<FormRules>({
  company_id: [
    {
      required: true,
      message: i18n.t('table.three_company') + i18n.t('table.not_empty'),
      trigger: 'blur',
    },
  ],
  game_id: [
    {
      required: true,
      message: i18n.t('table.three_game') + i18n.t('table.not_empty'),
      trigger: 'blur',
    },
  ],
  play_id: [
    {
      required: true,
      message: i18n.t('table.play_name') + i18n.t('table.not_empty'),
      trigger: 'blur',
    },
  ],
})

const pageForm = reactive({
  page: 1,
  limit: 5,
  count: 0,
})

function getBindTeam() {
  getBindPlayApi({
    id: ruleForm.id,
    page: pageForm.page,
    limit: pageForm.limit,
  }).then((res: any) => {
    if (+res.code === 1) {
      bindPlayList.value = res.data.data
      pageForm.count = res.data.total
      hasCheckPlay.value = bindPlayList.value.map((bind: any) =>
        Number(bind.id),
      )
    }
  })
}

function submitForm() {
  ruleFormRef.value
    && ruleFormRef.value.validate((valid) => {
      if (valid) {
        const playInfo: any = []
        // ruleForm.play_id.forEach((x: any) => {
        //   const find = playList.value.find((item: any) => item.id === x)
        //   if (find) {
        //     playInfo.push({
        //       play_id: x,
        //       play_name: find.name,
        //     })
        //   }
        // })
        const find = playList.value.find((item: any) => +item.id === +ruleForm.play_id)
        if (find) {
          playInfo.push({
            play_id: find.id,
            play_name: find.name,
          })
        }
        const getCompanyName = () => {
          const find = companyList.find((item: any) => item.value === ruleForm.company_id)
          if (!find) {
            return false
          }
          return find.label
        }
        const getGameName = () => {
          const find = gameList.value.find((item: any) => item.id === ruleForm.game_id)
          if (!find) {
            return false
          }
          return find.name
        }
        ruleForm.third_play_json = playInfo
        ruleForm.company_name = getCompanyName()
        ruleForm.game_name = getGameName()
        bindPlayApi(ruleForm).then((res: any) => {
          if (+res.code === 1) {
            ruleForm.play_id = []
            ruleForm.play_name = null
            pageForm.page = 1
            getBindTeam()
          }
        })
      }
    })
}

function bindCancel(row: any) {
  bindPlayApi(
    Object.assign({}, row, { is_bind: 0, third_play_id: row.play_id }),
  ).then((res: any) => {
    if (+res.code === 1) {
      getBindTeam()
    }
  })
}

function handleClose() {
  Object.assign(ruleForm, defaultForm)
  gameList.value = []
  playList.value = []
  pageForm.page = 1
  pageForm.limit = 5
  dialogVisible.value = false
}
const remoteSearch = (query: string) => {
  if (!query) {
    return false
  }
  getThirdPlayApi({
    company_id: ruleForm.company_id,
    game_id: ruleForm.game_id,
    play_name: query,
  }).then((res: any) => {
    if (+res.code === 1) {
      playList.value = res.data
    }
  })
}
onMounted(() => {
  proxy.mittBus.on('teamBindPlayBus', (row: any) => {
    ruleForm.id = row.id
    getBindTeam()
    dialogVisible.value = true
  })
})
onUnmounted(() => {
  proxy.mittBus.off('teamBindPlayBus')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('table.bind_paly')"
    width="1200px"
    :before-close="handleClose"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('table.three_company')" prop="company_id">
        <el-select
          v-model="ruleForm.company_id"
          :placeholder="$t('table.three_company')"
          filterable
          style="width: 360px"
          @change="companyChange"
        >
          <el-option
            v-for="company in companyList"
            :key="company.value"
            :label="company.label"
            :value="company.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.three_game')" prop="game_id">
        <el-select
          v-model="ruleForm.game_id"
          :placeholder="$t('table.three_game')"
          style="width: 360px"
          filterable
          @change="gameChange"
        >
          <el-option
            v-for="game in gameList"
            :key="game.id"
            :label="game.name"
            :value="game.id"
          />
        </el-select>
      </el-form-item>
      <!-- 蚂蚁电竞 -->
      <el-form-item v-if="!ruleForm.company_id || ruleForm.company_id === 1" :label="$t('table.play_name')" prop="play_id">
        <el-select
          v-model="ruleForm.play_id"
          :placeholder="$t('table.play_name')"
          style="width: 360px"
          filterable
        >
          <el-option
            v-for="play in playList"
            :key="play.id"
            :label="play.name"
            :value="play.id"
          />
        </el-select>
      </el-form-item>
      <!-- 蚂蚁体育 -->
      <el-form-item v-if="ruleForm.company_id === 2" :label="$t('table.play_name')" prop="play_id">
        <el-select
          v-model="ruleForm.play_id"
          :placeholder="$t('table.play_name')"
          style="width: 360px"
          filterable
          multiple
          remote
          :remote-method="remoteSearch"
        >
          <el-option
            v-for="play in playList"
            :key="play.id"
            :disabled="hasCheckPlay.includes(+play.id)"
            :label="play.name"
            :value="play.id"
          >
            <div>
              <span>{{ play.name }}</span>
              <span v-if="play.value">{{ `（${play.value}）` }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">
          {{ $t('crud.sure') }}
        </el-button>
        <el-button @click="handleClose">
          {{ $t('crud.cancel') }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="bindPlayList" style="width: 100%">
      <el-table-column
        prop="company_name"
        :label="$t('table.three_company')"
        align="center"
      />
      <el-table-column
        prop="game_name"
        :label="$t('table.three_game')"
        align="center"
      />
      <el-table-column
        prop="play_name"
        :label="$t('table.play_name')"
        align="center"
      />
      <el-table-column :label="$t('table.operate')" align="center">
        <template #default="scope">
          <el-button type="danger" @click="bindCancel(scope.row)">
            {{ $t('table.bind_cancel') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-divider />
    <el-pagination
      v-model:current-page="pageForm.page"
      v-model:page-size="pageForm.limit"
      :page-sizes="[5, 10, 50, 100, 500, 1000]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageForm.count"
      @size-change="getBindTeam"
      @current-change="getBindTeam"
    />
  </el-dialog>
</template>
