<route lang="yaml">
name: RefinishReport
meta:
  title: 反结算报表
  constant: false
  layout: true
    </route>

<script lang="ts" setup name="RefinishReport">
import { Download, RefreshRight, Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/financial-manage/refinish-report'
import { i18n } from '@/i18n'
import { parseTime } from '@/utils/formatTime'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.refinish-report'),
  defaultQuery: {
    game_id: null,
    start_time: dayjs().subtract(1, 'day').startOf('day').unix(),
    end_time: dayjs().endOf('day').unix(),
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
} = CRUD(defaultCrudOptions)
</script>

<template>
  <PageMain
    :title="$t('router.refinish-report')"
    :has-add="false"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.game_id')">
          <el-input
            v-model="crudQuery.game_id"
            type="number"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.bet_settlement_time')">
          <dateTimePickerQuery
            start-key="start_time"
            end-key="end_time"
            :prop-time="[
              crudQuery.start_time,
              crudQuery.end_time,
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
      >
        <el-table-column
          prop="game_id"
          :label="$t('table.game_id')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="game_name"
          :label="$t('table.game_name')"
          min-width="140"
          align="center"
        />
        <el-table-column
          prop="even_name"
          :label="$t('table.eventName')"
          min-width="140"
          align="center"
        />
        <el-table-column
          prop="team_info"
          :label="$t('table.team_vs')"
          min-width="200"
          align="center"
        />
        <el-table-column
          prop="play_name"
          :label="$t('table.play_name')"
          min-width="140"
          align="center"
        />
        <el-table-column
          prop="origin_winner"
          :label="$t('table.origin_winner')"
          min-width="140"
          align="center"
        />
        <el-table-column
          prop="winner_name"
          :label="$t('table.winner_point_extra_id')"
          min-width="140"
          align="center"
        />
        <el-table-column
          prop="recover_name"
          :label="$t('table.recover_name')"
          min-width="140"
          align="center"
        />
        <el-table-column
          prop="recover_time"
          :label="$t('table.recover_time')"
          width="180"
          align="center"
        >
          <template #default="scope">
            {{ parseTime(scope.row.recover_time) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="refinish_name"
          :label="$t('table.refinish_name')"
          min-width="140"
          align="center"
        />
        <el-table-column
          prop="refinish_time"
          :label="$t('table.refinish_time')"
          width="180"
          align="center"
        >
          <template #default="scope">
            {{ parseTime(scope.row.refinish_time) }}
          </template>
        </el-table-column>
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
