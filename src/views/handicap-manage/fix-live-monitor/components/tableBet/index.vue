<!-- eslint-disable no-case-declarations -->
<script setup lang="ts">
import { ElNotification } from 'element-plus'
import type { PropType } from 'vue'
import { tablePermission } from '../../hooks/permission'
import {
  getProjects,
  setProjectReceive,
} from '@/api/handicap-manage/fix-live-list'
import { toFixedNumber } from '@/utils'
const props = defineProps({
  rowInfo: {
    type: Object as PropType<any>,
    default: () => {},
  },
  noDeal: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['change'])

const leftBetData = ref<any[]>([])

const rightBetData = ref<any[]>([])

const otherBetData = ref<any[]>([])

const route = useRoute()

// 获取注单
const getProjectsHandle = () => {
  getProjects({
    game_id: route.query?.game_id,
    play_id: props.rowInfo.id,
  }).then((res: any) => {
    if (res && res.code === 1) {
      if (props.rowInfo.team.length > 2) {
        otherBetData.value = res.data.data
      }
      else {
        leftBetData.value = res.data.data.filter((data: any) => {
          return +props.rowInfo.team[0].id === +data.winner
        })
        rightBetData.value = res.data.data.filter((data: any) => {
          return +props.rowInfo.team[1].id === +data.winner
        })
      }
      emit('change', { play_id: props.rowInfo.id, teams: res.data.monitor })
    }
    else {
      otherBetData.value = []
      leftBetData.value = []
      rightBetData.value = []
    }
  })
}
const setBetReceive = (row: any, type: number, isAll = false) => {
  const params: any = {
    type,
  }
  if (isAll) {
    const list
      = row === 'left'
        ? leftBetData
        : row === 'right'
          ? rightBetData
          : otherBetData
    const projectId: any = []
    list.value.forEach((item: any) => {
      projectId.push(item.id)
    })
    params.project_id = projectId
  }
  else {
    params.project_id = [row.id]
  }
  setProjectReceive(params).then((res: any) => {
    if (res && res.code === 1) {
      ElNotification.success(res.msg)
      getProjectsHandle()
    }
  })
}

const { proxy }: any = getCurrentInstance()
onMounted(() => {
  getProjectsHandle()
  props.rowInfo.team.forEach((team: any, index: number) => {
    proxy.mittBus.on(`pushBetData${team.id}`, (data: any) => {
      switch (data.type) {
        case 'message_trader_rejects_order_push':
          if (props.rowInfo.team.length !== 2) {
            otherBetData.value.push(data.data)
          }
          else {
            if (index === 0) {
              leftBetData.value.push(data.data)
            }
            else {
              rightBetData.value.push(data.data)
            }
          }
          emit('change', { play_id: props.rowInfo.id, teams: data.data.team })
          break
        case 'message_trader_rejects_order_auto_accept_push':
          if (props.rowInfo.team.length !== 2) {
            otherBetData.value = otherBetData.value.filter((bet: any) => {
              return !String(bet.id).includes(String(data.data.id))
            })
          }
          else {
            if (index === 0) {
              leftBetData.value = leftBetData.value.filter((bet: any) => {
                return !String(bet.id).includes(String(data.data.id))
              })
            }
            else {
              rightBetData.value = rightBetData.value.filter((bet: any) => {
                return !String(bet.id).includes(String(data.data.id))
              })
            }
          }
          break
      }
    })
  })
})
onUnmounted(() => {
  props.rowInfo.team.forEach((team: any) => {
    proxy.mittBus.off(`pushBetData${team.id}`)
  })
})
</script>

<template>
  <div v-if="rowInfo.team.length < 3" style="display: flex">
    <el-table
      stripe
      style="width: calc(50vw - 150px); margin-left: 10px"
      max-height="360px"
      border
      resizable
      :data="leftBetData"
    >
      <el-table-column
        prop="username"
        :label="$t('table.bet_username')"
        min-width="120"
        align="center"
      />
      <el-table-column
        prop="desc"
        :label="$t('table.bet_betting_content')"
        min-width="120"
        align="center"
      >
        <template #default="scope">
          <span>{{ scope.row.desc }}</span>
          <el-tag
            class="mx-1"
            :type="scope.row.id.includes('PARLAY') ? '' : 'success'"
            effect="dark"
            size="small"
            style="margin-left: 8px"
          >
            {{ scope.row.id.includes("PARLAY") ? "PARLAY" : "SINGLE" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        :label="$t('table.bet_amount')"
        min-width="100"
        align="center"
      >
        <template #default="scope">
          {{ toFixedNumber(scope.row.amount, 0) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="odds"
        :label="$t('table.bet_odds')"
        min-width="90"
        align="center"
      >
        <template #default="scope">
          {{ toFixedNumber(scope.row.odds) }}
        </template>
      </el-table-column>
      <el-table-column min-width="185" align="center" fixed="right">
        <template #header>
          <el-button
            v-only="tablePermission.accept"
            type="primary"
            :disabled="leftBetData.length < 1 || noDeal"
            size="small"
            @click="setBetReceive('left', 1, true)"
          >
            {{ $t("table.accept_all") }}
          </el-button>
          <el-button
            v-only="tablePermission.acceptAll"
            type="primary"
            :disabled="leftBetData.length < 1 || noDeal"
            size="small"
            @click="setBetReceive('left', 0, true)"
          >
            {{ $t("table.reject_all") }}
          </el-button>
        </template>
        <template #default="scope">
          <el-button
            v-only="tablePermission.reject"
            type="primary"
            size="small"
            :disabled="noDeal"
            @click="setBetReceive(scope.row, 1)"
          >
            {{ $t("table.accept") }}
          </el-button>
          <el-button
            v-only="tablePermission.rejectAll"
            type="primary"
            size="small"
            :disabled="noDeal"
            @click="setBetReceive(scope.row, 0)"
          >
            {{ $t("table.reject_") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      stripe
      style="width: calc(50vw - 140px); margin-left: 10px"
      max-height="360px"
      border
      resizable
      :data="rightBetData"
    >
      <el-table-column
        prop="username"
        :label="$t('table.bet_username')"
        min-width="120"
        align="center"
      />
      <el-table-column
        prop="desc"
        :label="$t('table.bet_betting_content')"
        min-width="120"
        align="center"
      >
        <template #default="scope">
          <span>{{ scope.row.desc }}</span>
          <el-tag
            class="mx-1"
            :type="scope.row.id.includes('PARLAY') ? '' : 'success'"
            effect="dark"
            size="small"
            style="margin-left: 8px"
          >
            {{ scope.row.id.includes("PARLAY") ? "PARLAY" : "SINGLE" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        :label="$t('table.bet_amount')"
        min-width="100"
        align="center"
      >
        <template #default="scope">
          {{ toFixedNumber(scope.row.amount, 0) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="odds"
        :label="$t('table.bet_odds')"
        min-width="90"
        align="center"
      >
        <template #default="scope">
          {{ toFixedNumber(scope.row.odds) }}
        </template>
      </el-table-column>
      <el-table-column min-width="185" align="center" fixed="right">
        <template #header>
          <el-button
            v-only="tablePermission.accept"
            type="primary"
            :disabled="rightBetData.length < 1 || noDeal"
            size="small"
            @click="setBetReceive('right', 1, true)"
          >
            {{ $t("table.accept_all") }}
          </el-button>
          <el-button
            v-only="tablePermission.acceptAll"
            type="primary"
            :disabled="rightBetData.length < 1 || noDeal"
            size="small"
            @click="setBetReceive('right', 0, true)"
          >
            {{ $t("table.reject_all") }}
          </el-button>
        </template>
        <template #default="scope">
          <el-button
            v-only="tablePermission.reject"
            type="primary"
            size="small"
            :disabled="noDeal"
            @click="setBetReceive(scope.row, 1)"
          >
            {{ $t("table.accept") }}
          </el-button>
          <el-button
            v-only="tablePermission.rejectAll"
            type="primary"
            size="small"
            :disabled="noDeal"
            @click="setBetReceive(scope.row, 0)"
          >
            {{ $t("table.reject_") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-table
    v-else
    stripe
    style="width: calc(100vw - 220px)"
    max-height="360px"
    resizable
    :data="otherBetData"
  >
    <el-table-column
      prop="username"
      :label="$t('table.bet_username')"
      min-width="140"
      align="center"
    />
    <el-table-column
      prop="desc"
      :label="$t('table.bet_betting_content')"
      min-width="140"
      align="center"
    >
      <template #default="scope">
        <span>{{ scope.row.desc }}</span>
        <el-tag
          class="mx-1"
          :type="scope.row.id.includes('PARLAY') ? '' : 'success'"
          effect="dark"
          size="small"
          style="margin-left: 8px"
        >
          {{ scope.row.id.includes("PARLAY") ? "PARLAY" : "SINGLE" }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="amount"
      :label="$t('table.bet_amount')"
      min-width="100"
      align="center"
    >
      <template #default="scope">
        {{ toFixedNumber(scope.row.amount, 0) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="odds"
      :label="$t('table.bet_odds')"
      min-width="90"
      align="center"
    >
      <template #default="scope">
        {{ toFixedNumber(scope.row.odds) }}
      </template>
    </el-table-column>
    <el-table-column min-width="185" align="center" fixed="right">
      <template #header>
        <el-button
          v-only="tablePermission.accept"
          type="primary"
          :disabled="otherBetData.length < 1 || noDeal"
          size="small"
          @click="setBetReceive('other', 1, true)"
        >
          {{ $t("table.accept_all") }}
        </el-button>
        <el-button
          v-only="tablePermission.acceptAll"
          type="primary"
          :disabled="otherBetData.length < 1 || noDeal"
          size="small"
          @click="setBetReceive('other', 0, true)"
        >
          {{ $t("table.reject_all") }}
        </el-button>
      </template>
      <template #default="scope">
        <el-button
          v-only="tablePermission.reject"
          type="primary"
          size="small"
          :disabled="noDeal"
          @click="setBetReceive(scope.row, 1)"
        >
          {{ $t("table.accept") }}
        </el-button>
        <el-button
          v-only="tablePermission.rejectAll"
          type="primary"
          size="small"
          :disabled="noDeal"
          @click="setBetReceive(scope.row, 0)"
        >
          {{ $t("table.reject_") }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">
.bet-header {
  margin-left: 20px;
  margin-bottom: 8px;
}

:deep(.el-table__empty-block) {
  display: none;
}
</style>
