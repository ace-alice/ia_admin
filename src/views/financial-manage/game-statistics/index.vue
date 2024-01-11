<route lang="yaml">
name: GameStatistics
meta:
  title: 游戏统计
  constant: false
  layout: true
  </route>

<script lang="ts" setup name="GameStatistics">
import { Download, RefreshRight, Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import type { TableColumnCtx } from 'element-plus'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/financial-manage/game-statistics'
import { i18n } from '@/i18n'
import getGameListHook from '@/hooks/getGameListHook'
import { dictionary } from '@/hooks/lib'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.game-statistics'),
  defaultQuery: {
    game_type_id: null,
    game_id: null,
    game_start_time_start: dayjs().subtract(1, 'day').startOf('day').unix(),
    game_start_time_end: dayjs().endOf('day').unix(),
    category_id: null,
    export: 0,
    is_del: null,
    is_finish: null,
  },
  crudMethod: { ...Api },
}

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  reQuery,
  crudSetQueryKey,
  crudResData,
} = CRUD(defaultCrudOptions)

const { gameList } = getGameListHook(false, false)

const { handicapType, isNot, getLabel } = dictionary()

const { t } = useI18n()

interface GameType {
  [key: string]: any
}

interface SummaryMethodProps<T = GameType> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

const getSummaries = (param: SummaryMethodProps) => {
  const { columns } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = t('table.list_total')
      return
    }
    if (column.property === 'game_type_id') {
      sums[index] = `${t('table.total_game_num')}: ${crudResData.statistics?.total_game_count || 0}`
    }
    if (column.property === 'play_count') {
      sums[index] = `${t('table.total_play_num')}: ${crudResData.statistics?.total_play_count || 0}`
    }
  })
  return sums
}
</script>

<template>
  <PageMain
    :title="$t('router.game-statistics')"
    :has-add="false"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.game_type')">
          <el-select
            v-model="crudQuery.game_type_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="game in gameList"
              :key="game.id"
              :label="game.game_name"
              :value="game.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.game_id')">
          <el-input
            v-model="crudQuery.game_id"
            type="number"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.play_Id')">
          <el-input
            v-model="crudQuery.play_id"
            type="number"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.betting_type' /**盘口类型 */)">
          <el-select
            v-model="crudQuery.category_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in handicapType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_cancel')">
          <el-select
            v-model="crudQuery.is_del"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
          >
            <el-option
              v-for="item in isNot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_close')">
          <el-select
            v-model="crudQuery.is_finish"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
          >
            <el-option
              v-for="item in isNot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.game_time')">
          <dateTimePickerQuery
            start-key="game_start_time_start"
            end-key="game_start_time_end"
            :prop-time="[
              crudQuery.game_start_time_start,
              crudQuery.game_start_time_end,
            ]"
            @set-time="crudSetQueryKey"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="Search"
            :loading="queryLoading"
            @click="toQuery"
          >
            {{ $t("crud.search") }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="RefreshRight"
            :loading="queryLoading"
            @click="reQuery"
          >
            {{ $t("crud.reset") }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            :icon="Download"
            :loading="queryLoading"
            @click="toQuery({ export: 1 })"
          >
            {{ $t("crud.export") }}
          </el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #pageBody>
      <el-table
        v-loading="queryLoading"
        :data="crudData"
        stripe
        style="width: 100%"
        height="100%"
        border
        resizable
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column
          prop="game_id"
          :label="$t('table.game_id')"
          width="160"
          align="center"
        />
        <el-table-column
          prop="game_type_id"
          :label="$t('table.game_name')"
          width="240"
          align="center"
        >
          <template #default="scope">
            {{ getLabel(scope.row.game_type_id, gameList, 'id', 'game_name') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="event_name"
          :label="$t('table.eventName')"
          width="220"
          align="center"
        >
          <template #default="scope">
            {{ scope.row.event_id }}
          </template>
        </el-table-column>
        <el-table-column
          prop="vs_info"
          :label="$t('table.team_vs')"
          min-width="240"
          align="center"
        />
        <el-table-column
          prop="play_count"
          :label="$t('table.points_count_2')"
          width="240"
          align="center"
        />
        <el-table-column
          prop="bo_info"
          :label="$t('table.game_info')"
          width="160"
          align="center"
        />
        <el-table-column
          prop="category_name"
          :label="$t('table.type')"
          width="140"
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
