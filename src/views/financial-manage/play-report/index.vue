<route lang="yaml">
name: PlayReport
meta:
  title: 玩法报表
  constant: false
  layout: true
</route>

<script lang="ts" setup name="PlayReport">
import { Download, RefreshRight, Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/financial-manage/play-report'
import { i18n } from '@/i18n'
import getProxyListHook from '@/hooks/getProxyListHook'
import getGameListHook from '@/hooks/getGameListHook'
import { dictionary } from '@/hooks/lib'
import getCompanyList from '@/hooks/getCompanyList'
import { toFixedNumber } from '@/utils'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.play-report'),
  defaultQuery: {
    game_type_id: null,
    event_id: null,
    game_id: null,
    game_start_time_start: dayjs().subtract(1, 'day').startOf('day').unix(),
    game_start_time_end: dayjs().endOf('day').unix(),
    category_id: null,
    is_champion: null,
    proxy_id: null,
    company_id: null,
    export: 0,
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
  setTheQuery,
  crudSetQueryKey,
  crudHook,
  crudResData,
} = CRUD(defaultCrudOptions)

const { proxyList } = getProxyListHook()

const { companyList } = getCompanyList()

const { gameList, eventList, gameChange } = getGameListHook(true, false)

const { handicapType, isNot } = dictionary()

function changeGameId(id: string | number) {
  setTheQuery({ event_id: null })
  gameChange(id)
}
const { t } = useI18n()
crudHook.afterRefresh = () => {
  const sumPage: any = {
    game_id: '',
    amount: 0,
    bonus: 0,
    win_lose: 0,
  }
  if (crudData.value.length === 0) {
    return
  }
  crudData.value.forEach((data: any) => {
    sumPage.amount += +data.amount || 0
    sumPage.bonus += +data.bonus || 0
    sumPage.win_lose += +data.win_lose || 0
    sumPage.game_id = `${t('table.page_total_funds')}: ${toFixedNumber(sumPage.win_lose)}`
  })
  ;(crudData.value as any).push(sumPage)
  if (crudResData.statistics) {
    (crudData.value as any).push({
      game_id: `${t('table.total_funds')}: ${toFixedNumber(
        crudResData.statistics.win_lose,
      )}`,
      amount: toFixedNumber(crudResData.statistics.amount),
      bonus: toFixedNumber(crudResData.statistics.bonus),
      win_lose: toFixedNumber(crudResData.statistics.win_lose),
    })
  }
}

function sortChange({ prop, order }: any) {
  if (!order) {
    setTheQuery({ field_sort: 0 })
    toQuery()
    return
  }
  if (prop === 'amount') {
    setTheQuery({ field_sort: order === 'ascending' ? 2 : 1 })
  }
  else if (prop === 'bonus') {
    setTheQuery({ field_sort: order === 'ascending' ? 4 : 3 })
  }
  else if (prop === 'win_lose') {
    setTheQuery({ field_sort: order === 'ascending' ? 6 : 5 })
  }
  toQuery()
}
</script>

<template>
  <PageMain
    :title="$t('router.play-report')"
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
            @change="changeGameId(crudQuery.game_type_id)"
          >
            <el-option
              v-for="game in gameList"
              :key="game.id"
              :label="game.game_name"
              :value="game.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.game_event')">
          <el-select
            v-model="crudQuery.event_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="event in eventList"
              :key="event.id"
              :label="event.event_name"
              :value="event.id"
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
        <el-form-item :label="$t('table.agent_name' /**所属代理 */)">
          <el-select
            v-model="crudQuery.proxy_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="pro in proxyList"
              :key="pro.id"
              :label="pro.proxy_name"
              :value="pro.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.comp_name' /**所属公司 */)">
          <el-select
            v-model="crudQuery.company_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            filterable
            clearable
          >
            <el-option
              v-for="company in companyList"
              :key="company.id"
              :label="company.company_name"
              :value="company.id"
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
        @sort-change="sortChange"
      >
        <el-table-column
          prop="game_id"
          :label="$t('table.game_id')"
          width="240"
          align="left"
        />
        <el-table-column
          prop="play_id"
          :label="$t('table.play_Id')"
          width="120"
          align="center"
        />
        <el-table-column
          prop="game_type_name"
          :label="$t('table.game_name')"
          width="160"
          align="center"
        />
        <el-table-column
          prop="event_name"
          :label="$t('table.eventName')"
          width="220"
          align="center"
        />
        <el-table-column
          prop="vs_info"
          :label="$t('table.team_vs')"
          min-width="240"
          align="center"
        />
        <el-table-column
          prop="game_info"
          :label="$t('table.game_info')"
          width="160"
          align="center"
        />
        <el-table-column
          prop="round_name"
          :label="$t('table.bo_number')"
          width="100"
          align="center"
        />
        <el-table-column
          prop="desc"
          :label="$t('table.asste_desc')"
          width="120"
          align="center"
        />
        <el-table-column
          prop="amount"
          :label="$t('table.money_amount')"
          width="160"
          align="center"
          sortable
        >
          <template #default="scope">
            {{ toFixedNumber(scope.row.amount) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="bonus"
          :label="$t('table.money_bonus')"
          width="160"
          align="center"
          sortable
        >
          <template #default="scope">
            {{ toFixedNumber(scope.row.bonus) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="win_lose"
          :label="$t('table.money_win_lose')"
          width="160"
          align="center"
          sortable
        >
          <template #default="scope">
            {{ toFixedNumber(scope.row.win_lose) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="settle_admin_name"
          :label="$t('table.settle_admin_name')"
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
