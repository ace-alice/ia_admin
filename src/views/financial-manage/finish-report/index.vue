<route lang="yaml">
name: FinishReport
meta:
  title: 结算报表
  constant: false
  layout: true
  </route>

<script lang="ts" setup name="FinishReport">
import { Download, RefreshRight, Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/financial-manage/finish-report'
import { i18n } from '@/i18n'
import getGameListHook from '@/hooks/getGameListHook'
import { dictionary } from '@/hooks/lib'
import { parseTime } from '@/utils/formatTime'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.finish-report'),
  defaultQuery: {
    type_id: null,
    game_id: null,
    start_time: dayjs().subtract(1, 'day').startOf('day').unix(),
    end_time: dayjs().endOf('day').unix(),
    category_id: null,
    is_champion: null,
    finish_name: null,
    settle_name: null,
    creat_name: null,
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

const { gameList } = getGameListHook(false, false)

const { handicapType, isNot } = dictionary()
</script>

<template>
  <PageMain
    :title="$t('router.finish-report')"
    :has-add="false"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.game_type')">
          <el-select
            v-model="crudQuery.type_id"
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
        <el-form-item :label="$t('table.is_champion')">
          <el-select
            v-model="crudQuery.is_champion"
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
        <el-form-item :label="$t('table.create_name')">
          <el-input
            v-model="crudQuery.create_name"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.settle_admin_name')">
          <el-input
            v-model="crudQuery.settle_name"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.finish_name')">
          <el-input
            v-model="crudQuery.finish_name"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.time')">
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
          prop="winner_name"
          :label="$t('table.winner_point_extra_id')"
          min-width="140"
          align="center"
        />
        <el-table-column
          prop="create_name"
          :label="$t('table.create_name')"
          min-width="140"
          align="center"
        />
        <el-table-column
          prop="create_time"
          :label="$t('table.create_time')"
          width="180"
          align="center"
        >
          <template #default="scope">
            {{ parseTime(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="settle_name"
          :label="$t('table.settle_admin_name')"
          min-width="140"
          align="center"
        />
        <el-table-column
          prop="settle_time"
          :label="$t('table.bet_settlement_time')"
          width="180"
          align="center"
        >
          <template #default="scope">
            {{ parseTime(scope.row.settle_time) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="confirm_name"
          :label="$t('table.confirm_name')"
          min-width="140"
          align="center"
        />
        <el-table-column
          prop="confirm_time"
          :label="$t('table.confirm_time')"
          width="180"
          align="center"
        >
          <template #default="scope">
            {{ parseTime(scope.row.confirm_time) }}
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
