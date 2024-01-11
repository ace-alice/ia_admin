<!-- eslint-disable no-case-declarations -->
<route lang="yaml">
name: championList
meta:
  title: 冠军盘监控
  constant: false
  layout: true
</route>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import championListHook from './hooks/championListHook'
import OddsHistory from './components/oddHistory/index.vue'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/handicap-manage/champoin-list'
import { dictionary } from '@/hooks/lib'
import PromiseSwitch from '@/components/PromiseSwitch/index.vue'
import visibleColumn from '@/hooks/visibleColumn'
import { toFixedNumber } from '@/utils'
const route = useRoute()

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '冠军盘监控',
  crudOptShow: {
    add: true,
    formSize: '50%',
  },
  defaultQuery: {
    game_id: route.query?.game_id,
  },
  crudMethod: { ...Api },
  defaultForm: {},
  isPageQuery: false,
  crudTag: 'champion:manage',
}

const {
  crudData,
  crudPage,
  crudResData,
  refresh,
  queryLoading,
  changeStatus,
  dialogVisible,
  crudOptShow,
  crudHook,
} = CRUD(defaultCrudOptions)

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()
const { changeDate, handleChange } = championListHook()
const { proxy }: any = getCurrentInstance()
const dialogTitle = ref('')

const i18n = useI18n()

const selectRow: any = ref({})
const { isNot } = dictionary()
const showDialog = (title: string, row: any) => {
  dialogVisible.value = true
  dialogTitle.value = title
  selectRow.value = row
}

const getSummaries = (param: any) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((_: any, index: number) => {
    if (index === 0) {
      sums[index] = i18n.t('table.pump_water')
      return
    }
    if (index === 6) {
      const values = data.map((item: any) => Number(item.point))
      sums[index] = values.reduce((prev: number, curr: any) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return toFixedNumber(prev + 100 / curr)
        }
        else {
          return toFixedNumber(prev)
        }
      }, 0)
    }
  })

  return sums
}

crudHook.afterRefresh = function () {
  setTimeout(() => {
    window.document.title = crudResData.info
  }, 100)

  return true
}
onMounted(() => {
  proxy.mittBus.on('fixLiveMonitorBus', (data: any) => {
    const betData: any = data.data
    switch (data.type) {
      case 'message_trader_profit_loss_value_push':
        if (!betData || betData.team.length <= 0) {
          return false
        }
        crudData.value.forEach((item: any) => {
          betData.team.forEach((el: any) => {
            if (item.id === el.id) {
              item.team_bet_amount = el.early_bet_amount
              item.team_profit = el.early_profit_loss
            }
          })
        })
        break
    }
  })
})
</script>

<template>
  <PageMain
    :title="$t('router.champion-monitor')"
    :has-search="false"
    :has-tool="true"
    :has-footer="true"
  >
    <template #pageTool>
      <el-date-picker
        v-model="crudResData.game_start_time"
        v-only="toolPermission.setStartTime"
        type="datetime"
        style="width: 200px"
        :placeholder="$t('table.game_start_time')"
        value-format="X"
        @change="changeDate(crudResData.game_start_time)"
      />
      <span style="margin-left: 25px">{{ crudResData.info }}</span>
    </template>
    <template #pageBody>
      <el-table
        ref="tableRef"
        v-loading="queryLoading"
        :data="crudData"
        stripe
        style="width: 100%"
        height="100%"
        border
        resizable
        :summary-method="getSummaries"
        show-summary
        :header-cell-style="filterHeaderColumn"
      >
        <el-table-column
          v-if="getColumnShow('id')"
          prop="id"
          :label="$t('table.id' /**ID */)"
          min-width="120"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('play_name')"
          prop="play_name"
          :label="$t('table.play_name' /**玩法名称 */)"
          min-width="120"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('team_name')"
          prop="team_name"
          :label="$t('table.team_name' /**队伍名称 */)"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="team_profit"
          :label="$t('table.team_win_loss' /**队伍盈亏 */)"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="team_bet_amount"
          :label="$t('table.team_betting' /**队伍投注额 */)"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="point"
          :label="$t('table.team_odds' /**队伍赔率*/)"
          min-width="120"
          align="center"
        >
          <template #default="scope">
            <el-input-number
              v-model="scope.row.point"
              v-only="tablePermission.changePoint"
              :step="0.01"
              :min="1.01"
              :precision="2"
              @change="handleChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="team_rake"
          :label="$t('table.pump_water' /**队伍抽水*/)"
          min-width="120"
          align="center"
        >
          <template #default="scope">
            {{ toFixedNumber(100 / scope.row.point) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.is_hiddle' /**是否展示*/)"
          min-width="120"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.id"
              :init-value="scope.row.is_hide"
              :options="isNot"
              :default-param="{
                point_id: scope.row.id,
                type: !Number(scope.row.is_hide),
              }"
              param-key="type"
              :change-fun="changeStatus"
              emit-fun-name="setPlayStatus"
              :permission="tablePermission.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operate')"
          min-width="120"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <span v-some="Object.values(otherPermission)">
              <el-dropdown
                placement="bottom-end"
                :hide-on-click="false"
                trigger="click"
              >
                <el-button type="warning" link>
                  {{ $t("table.operate") }}
                </el-button>
                <template #dropdown>
                  <el-dropdown-item>
                    <el-button v-only="otherPermission.viewBet" type="primary" size="small">
                      {{ $t("crud.view_bet") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.viewHistory"
                      type="danger"
                      size="small"
                      @click="showDialog('查看赔率变化', scope.row)"
                    >
                      {{ $t("crud.view_odd_history") }}
                    </el-button>
                  </el-dropdown-item>
                </template>
              </el-dropdown>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- <template #pageFooter>
      <el-pagination
        v-model:current-page="crudPage.page"
        v-model:page-size="crudPage.limit"
        :page-sizes="[10, 50, 100, 500, 1000]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="crudPage.count"
        @size-change="refresh"
        @current-change="refresh"
      />
    </template> -->
    <template #other>
      <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        :width="crudOptShow.formSize"
        @close="dialogVisible = false"
      >
        <OddsHistory :id="selectRow.id" :key="selectRow.id" />
      </el-dialog>
    </template>
  </PageMain>
</template>
