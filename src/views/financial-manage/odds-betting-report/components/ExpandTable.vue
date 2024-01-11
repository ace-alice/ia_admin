<script lang="ts" setup name="ExpandTable">
import type { PropType } from 'vue'
import { parseTime } from '@/utils/formatTime'

const props = defineProps({
  crudData: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  teams: {
    type: Array as PropType<number[] | string[]>,
    default: () => [],
  },
})

const crudDataCu = computed(() => {
  return props.crudData.map((data: any) => {
    if (data.length < 1) {
      return {}
    }
    else {
      const temp: any = {}
      data.forEach((element: any, index: number) => {
        if (index === 0) {
          temp.operate_user_name = element.operate_user_name
          temp.time = element.time
        }
        if (element.point_id) {
          Object.keys(element).forEach((keyl) => {
            temp[`${keyl}_${element.point_id}`] = element[keyl]
          })
        }
      })
      return temp
    }
  })
})
</script>

<template>
  <el-table :data="crudDataCu" stripe border>
    <el-table-column
      prop="time"
      :label="$t('table.update_time1' /**更新时间 */)"
      width="170"
      align="center"
    >
      <template #default="scope">
        <span v-if="scope.row.time">{{
          parseTime(scope.row.time)
        }}</span>
        <span v-else>--</span>
      </template>
    </el-table-column>
    <template
      v-for="(option, index) in teams"
      :key="option"
    >
      <el-table-column
        prop="desc"
        :label="$t('table.option') + (index + 1)"
        min-width="150"
        class-name="option-class"
        align="center"
      >
        <template #default="scope">
          <span>{{ scope.row[`point_name_${option}`] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="odds"
        :label="$t('table.bet_betting_odds')"
        min-width="100"
        align="center"
      >
        <template #default="scope">
          <span>{{ scope.row[`odds_${option}`] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        :label="$t('table.bet_amount') + $t('table.order_num')"
        min-width="150"
        align="center"
      >
        <template #default="scope">
          <span>{{ scope.row[`bet_amount_${option}`] }}({{
            scope.row[`bet_count_${option}`]
          }})</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        :label="$t('table.total_bet_amount') + $t('table.order_num')"
        min-width="150"
        align="center"
      >
        <template #default="scope">
          <span>{{ scope.row[`total_bet_amount_${option}`] }}({{
            scope.row[`total_bet_count_${option}`]
          }})</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="profit"
        :label="$t('table.profit_loss')"
        min-width="150"
        align="center"
      >
        <template #default="scope">
          <span>{{ scope.row[`profit_amount_${option}`] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="real_profit"
        :label="$t('table.real_profit')"
        min-width="150"
        align="center"
      >
        <template #default="scope">
          <span>{{ scope.row[`real_profit_amount_${option}`] }}</span>
        </template>
      </el-table-column>
    </template>
    <el-table-column
      prop="operate_user_name"
      :label="$t('table.operator')"
      min-width="150"
      align="center"
    >
      <template #default="scope">
        <span>{{ scope.row.operate_user_name }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>
