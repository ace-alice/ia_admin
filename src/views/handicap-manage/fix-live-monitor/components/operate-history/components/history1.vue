<script lang="ts" setup>
import type { PropType } from 'vue'
import CRUD from '@/components/Crud'
import PageMain from '@/components/PageMain/index.vue'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/handicap-manage/history1'
import { parseTime } from '@/utils/formatTime'
const props = defineProps({
  gameId: {
    type: Number,
    default: () => 0,
  },
  playId: {
    type: Number,
    default: () => 0,
  },
  teams: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
})
const defaultCrudOptions: CrudOptionsType = {
  defaultQuery: {
    game_id: props.gameId,
    play_id: props.playId,
  },
  crudMethod: { ...Api },
}
const { crudPage, crudData, queryLoading, refresh } = CRUD(defaultCrudOptions)
const crudDataCu = computed(() => {
  return crudData.value.map((data: any) => {
    if (data.length < 1) {
      return {}
    }
    else {
      const temp: any = {}
      data.forEach((element: any, index: number) => {
        if (index === 0) {
          temp.admin_name = element.admin_name
          temp.time = element.time
        }
        if (element.points_id) {
          temp[`old_point_${element.points_id}`] = element.old_point
          temp[`points_name_${element.points_id}`] = element.points_name
          temp[`point_${element.points_id}`] = element.point
        }
      })
      return temp
    }
  })
})
</script>

<template>
  <PageMain :has-footer="true" :has-tool="false" :has-search="false" title="">
    <template #pageBody>
      <el-table
        ref="tableRef"
        v-loading="queryLoading"
        :data="crudDataCu"
        stripe
        style="width: 100%"
        height="100%"
        border
        resizable
      >
        <el-table-column
          :label="$t('table.operator_time')"
          min-width="180"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.time">{{ parseTime(scope.row.time) }}</span>
          </template>
        </el-table-column>
        <template
          v-for="(option, index) in teams"
          :key="index"
        >
          <el-table-column
            :prop="`points_name_${option.id}`"
            :label="$t('table.change_name')"
            min-width="120"
            class-name="option-class"
            align="center"
          />
          <el-table-column
            :prop="`old_point_${option.id}`"
            :label="$t('table.change_before_point')"
            min-width="120"
            align="center"
          />
          <el-table-column
            :prop="`point_${option.id}`"
            :label="$t('table.change_after_point')"
            min-width="120"
            align="center"
          />
        </template>
        <el-table-column
          prop="admin_name"
          :label="$t('table.operator')"
          min-width="120"
          align="center"
        />
      </el-table>
    </template>
    <template #pageFooter>
      <el-pagination
        v-model:current-page="crudPage.page"
        v-model:page-size="crudPage.limit"
        :page-sizes="[10, 50, 100, 500, 1000]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="crudPage.count"
        @size-change="refresh"
        @current-change="refresh"
      />
    </template>
  </PageMain>
</template>
