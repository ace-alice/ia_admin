<script lang="ts" setup>
import { ref } from 'vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/handicap-manage/odds-history'
import LineChart from '@/components/Echart/LineChart/index.vue'
import { parseTime } from '@/utils/formatTime'
const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
})
const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '赔率变化',
  crudOptShow: {
    formSize: '80%',
  },
  defaultQuery: {
    point_id: props.id,
  },
  crudMethod: { ...Api },
}
const { crudPage, crudData, refresh, queryLoading } = CRUD(defaultCrudOptions)
const activeName = ref('chart')
</script>

<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="赔率变化折线图" name="chart">
      <LineChart
        :chart-data="[820, 932, 901, 934, 1290, 1330, 1320, 801, 102, 230, 4321, 4129]"
        :chart-axis="[
          '一月',
          '二月',
          '三月',
          '四月',
          '五月',
          '六月',
          '七月',
          '八月',
          '九月',
          '十月',
          '十一月',
          '十二月',
        ]"
        class="myEcharts"
        chart-id="oddsLine"
      />
    </el-tab-pane>
    <el-tab-pane label="赔率变化记录" name="history">
      <el-table
        ref="oddTableRef"
        v-loading="queryLoading"
        :data="crudData"
        stripe
        row-key="role_id"
        style="width: 100%; height: 100%"
        border
        resizable
        table-layout="auto"
      >
        <el-table-column
          prop="team_name"
          :label="$t('table.odds_change_team' /**赔率变更战队 */)"
          min-width="80"
          align="center"
        />
        <el-table-column
          prop="old_point"
          :label="$t('table.change_before_odds' /**变更前赔率 */)"
          min-width="80"
          align="center"
        />
        <el-table-column
          prop="point"
          :label="$t('table.change_after_odds' /**变更后赔率 */)"
          min-width="80"
          align="center"
        />
        <el-table-column
          prop="admin_username"
          :label="$t('table.operator' /**操作人 */)"
          min-width="80"
          align="center"
        />
        <el-table-column
          prop="time"
          :label="$t('table.operator_time' /**操作时间 */)"
          min-width="80"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.time">{{ parseTime(scope.row.time) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination
          v-model:current-page="crudPage.page"
          v-model:page-size="crudPage.limit"
          :page-sizes="[10, 50, 100, 500, 1000]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="crudPage.count"
          @size-change="refresh"
          @current-change="refresh"
        />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" scoped>
.myEcharts {
  width: 100%;
  height: 300px;
}
.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
