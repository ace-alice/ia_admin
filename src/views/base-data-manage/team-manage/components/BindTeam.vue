<script setup lang="ts" name="BindTeam">
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { reduce } from 'lodash-es'
import {
  bindTeamApi,
  getBindTeamApi,
  getThirdGameApi,
  getThirdTeamApi,
} from '@/api/match-data-manage/team-manage'

const { proxy }: any = getCurrentInstance()

const i18n = useI18n()

const dialogVisible = ref(false)

const ruleFormRef = ref<FormInstance>()

const defaultForm: any = {
  id: null,
  company_id: null,
  company_name: null,
  game_id: null,
  game_name: null,
  team_id: null,
  team_name: null,
  is_bind: 1,
}

const ruleForm = reactive(Object.assign({}, defaultForm))

const hasCheckTeam = ref<number[]>([])

const bindTeamList = ref<any[]>([])

const companyList = [
  { label: '蚂蚁电竞', value: 1 },
  { label: '蚂蚁体育', value: 2 },
]

const gameList = ref<any[]>([])
const teamList = ref<any[]>([])

function companyChange() {
  ruleForm.game_id = null
  ruleForm.game_name = null
  ruleForm.team_id = null
  ruleForm.team_name = null
  ruleForm.company_name = null
  teamList.value = []

  const company = companyList.find((com: any) => {
    return +com.value === +ruleForm.company_id
  })

  if (company) {
    ruleForm.company_name = company.label
  }

  getThirdGameApi({ company_id: ruleForm.company_id }).then((res: any) => {
    if (+res.code === 1) {
      gameList.value = res.data
    }
  })
}

function gameChange() {
  ruleForm.team_id = null
  ruleForm.team_name = null
  ruleForm.game_name = null
  if (ruleForm.company_id === 2) {
    return false
  }
  const game = gameList.value.find((com: any) => {
    return +com.id === +ruleForm.game_id
  })

  if (game) {
    ruleForm.game_name = game.name
  }

  getThirdTeamApi({
    company_id: ruleForm.company_id,
    game_id: ruleForm.game_id,
  }).then((res: any) => {
    if (+res.code === 1) {
      teamList.value = res.data
    }
  })
}
const remoteSearch = (query: string) => {
  if (!query) {
    return false
  }
  getThirdTeamApi({
    company_id: ruleForm.company_id,
    game_id: ruleForm.game_id,
    team_name: query,
  }).then((res: any) => {
    if (+res.code === 1) {
      teamList.value = res.data
    }
  })
}
function teamChange() {
  ruleForm.team_name = null
  if (ruleForm.company_id === 2) {
    return false
  }
  const game = teamList.value.find((com: any) => {
    return +com.id === +ruleForm.team_id
  })

  if (game) {
    ruleForm.team_name = game.name
  }
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
  team_id: [
    {
      required: true,
      message: i18n.t('table.three_team') + i18n.t('table.not_empty'),
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
  getBindTeamApi({
    id: ruleForm.id,
    page: pageForm.page,
    limit: pageForm.limit,
  }).then((res: any) => {
    if (+res.code === 1) {
      bindTeamList.value = res.data.data
      pageForm.count = res.data.total
      hasCheckTeam.value = bindTeamList.value.map((bind: any) =>
        Number(bind.team_id),
      )
    }
  })
}

function submitForm() {
  ruleFormRef.value
    && ruleFormRef.value.validate((valid) => {
      if (valid) {
        const getTeamName = () => {
          const find = teamList.value.find((item: any) => item.id === ruleForm.team_id)
          if (!find) {
            return false
          }
          return find.name
        }
        const getGameName = () => {
          const find = gameList.value.find((item: any) => item.id === ruleForm.game_id)
          if (!find) {
            return false
          }
          return find.name
        }
        ruleForm.team_name = getTeamName()
        ruleForm.game_name = getGameName()
        bindTeamApi(ruleForm).then((res: any) => {
          if (+res.code === 1) {
            ruleForm.team_id = null
            ruleForm.team_name = null
            pageForm.page = 1
            getBindTeam()
          }
        })
      }
    })
}

function bindCancel(row: any) {
  bindTeamApi(Object.assign(row, { is_bind: 0 })).then((res: any) => {
    if (+res.code === 1) {
      getBindTeam()
    }
  })
}

function handleClose() {
  Object.assign(ruleForm, defaultForm)
  gameList.value = []
  teamList.value = []
  pageForm.page = 1
  pageForm.limit = 5
  dialogVisible.value = false
}

onMounted(() => {
  proxy.mittBus.on('teamBindTeamBus', (row: any) => {
    ruleForm.id = row.id
    getBindTeam()
    dialogVisible.value = true
  })
})
onUnmounted(() => {
  proxy.mittBus.off('teamBindTeamBus')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('table.bind_team')"
    width="1200px"
    :before-close="handleClose"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
      class="demo-ruleForm"
      status-icon
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
      <el-form-item :label="$t('table.three_team')" prop="team_id">
        <!-- remote
          :remote-method="remoteSearch" -->
        <el-select
          v-model="ruleForm.team_id"
          :placeholder="$t('table.three_team')"
          style="width: 360px"
          filterable
          @change="teamChange"
        >
          <el-option
            v-for="team in teamList"
            :key="team.id"
            :disabled="hasCheckTeam.includes(+team.id)"
            :label="team.name"
            :value="team.id"
          />
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
    <el-table :data="bindTeamList" style="width: 100%">
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
        prop="team_name"
        :label="$t('table.three_team')"
        align="center"
      />
      <el-table-column
        :label="$t('table.operate')"
        align="center"
      >
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
