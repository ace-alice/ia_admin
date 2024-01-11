<route lang="yaml">
name: In-playSub-marketReport
meta:
  title: 子盘口滚球报表
  constant: false
  layout: true
    </route>

<script lang="ts" setup name="In-playSub-marketReport">
import { Download, RefreshRight, Search } from '@element-plus/icons-vue'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/financial-manage/in-play-sub-market-report'
import { i18n } from '@/i18n'
import { dictionary } from '@/hooks/lib'
import getGameListHook from '@/hooks/getGameListHook'
import getAdminListHook from '@/hooks/getAdminListHook'
// import getCompanyList from '@/hooks/getCompanyList'
import getProxyListHook from '@/hooks/getProxyListHook'
import { toFixedNumber } from '@/utils'
const route = useRoute()

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.in-play-sub-market-report'),
  defaultQuery: {
    category_id: null,
    game_id: null,
    play_id: route.query?.play_id || null,
    field_sort: 0,
  },
  crudMethod: { ...Api },
}

const {
  crudQuery,
  crudData,
  crudPage,
  crudResData,
  refresh,
  toQuery,
  queryLoading,
  reQuery,
  setTheQuery,
  crudSetQueryKey,
} = CRUD(defaultCrudOptions)

const { gameList, eventList, gameChange } = getGameListHook(true, false)

function changeGameId(id: string | number) {
  setTheQuery({ event_id: null })
  gameChange(id)
}

const { adminList } = getAdminListHook()

// const { companyList } = getCompanyList()

const { proxyList } = getProxyListHook()

/**
   * 表格合计统计逻辑
   * @param param 默认表格row
   * @returns '总计' || '-' || number || 'N/A'
   */
const getSummaries = (param: any) => {
  const { columns, data } = param
  const sums: string[] = []
  if (data.length === 0) {
    return sums
  }
  columns.forEach((column: any, index: number) => {
    if (index === 0) {
      sums[index] = `${i18n.global.t('table.page_total')}/${i18n.global.t('table.list_total')}`
      return
    }
    if (['amount', 'bonus', 'win_lose'].includes(column.property)) {
      const values = data.map((item: any) => Number(item[column.property]))
      const total_value = values.reduce((prev: number, curr: any) => {
        if (!Number.isNaN(Number(curr))) {
          return toFixedNumber(Number(prev) + Number(curr))
        }
        else {
          return toFixedNumber(prev)
        }
      }, 0)
      sums[index] = `${total_value}  /  ${crudResData.statistics[column.property] || 0}`
    }
  })

  return sums
}

const { getLabel } = dictionary()

function formDate(num: number) {
  const dateV = +num || 0
  if (!dateV) {
    return '0`0'
  }
  const s = dateV % 60
  const h = Math.floor(dateV / 60)
  return `${h}\‘${s}`
}

function sortChange({ prop, order }: any) {
  if (!order) {
    setTheQuery({ field_sort: 0 })
    toQuery()
    return
  }
  if (prop === 'valid_time') {
    setTheQuery({ field_sort: order === 'ascending' ? 1 : 2 })
  }
  else if (prop === 'total_time') {
    setTheQuery({ field_sort: order === 'ascending' ? 3 : 4 })
  }
  else if (prop === 'amount') {
    setTheQuery({ field_sort: order === 'ascending' ? 5 : 6 })
  }
  else if (prop === 'bonus') {
    setTheQuery({ field_sort: order === 'ascending' ? 7 : 8 })
  }
  else if (prop === 'win_lose') {
    setTheQuery({ field_sort: order === 'ascending' ? 9 : 10 })
  }
  else if (prop === 'ssss') {
    setTheQuery({ field_sort: order === 'ascending' ? 11 : 12 })
  }
  toQuery()
}
</script>

<template>
  <PageMain
    :title="$t('router.in-play-sub-market-report')"
    :has-add="false"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery">
        <!-- <el-form-item :label="$t('table.three_company')" prop="company_id">
          <el-select
            v-model="crudQuery.company_id"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.company_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item :label="$t('table.agent_name' /**所属代理 */)">
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
        </el-form-item> -->
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
        <el-form-item :label="$t('table.game_id' /**盘口ID */)">
          <el-input
            v-model="crudQuery.game_id"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.play_Id' /**玩法ID */)">
          <el-input
            v-model="crudQuery.play_id"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.trader' /**操盘手 */)">
          <el-select
            v-model="crudQuery.trade_user_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="bet in adminList"
              :key="bet.admin_id"
              :label="bet.username"
              :value="bet.admin_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.game_start_time')">
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
        <el-form-item :label="$t('table.bet_settlement_time')">
          <dateTimePickerQuery
            start-key="update_time_start"
            end-key="update_time_end"
            :prop-time="[
              crudQuery.settle_time_start,
              crudQuery.settle_time_end,
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
        show-summary
        :summary-method="getSummaries"
        @sort-change="sortChange"
      >
        <el-table-column
          prop="game_id"
          :label="$t('table.game_id')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="play_id"
          :label="$t('table.play_Id')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="game_type_id"
          :label="$t('table.game_name')"
          min-width="120"
          align="center"
        >
          <template #default="scope">
            <span>{{ getLabel(scope.row.game_type_id, gameList, 'id', 'game_name') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="event_name"
          :label="$t('table.event_name')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="vs_info"
          :label="$t('table.team_vs')"
          min-width="180"
          align="center"
        />
        <el-table-column
          prop="play_name"
          :label="$t('table.play_name')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="round_name"
          :label="$t('table.round_name')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="valid_time"
          :label="`${$t('table.valid_time')}`"
          min-width="100"
          align="center"
          sortable
        >
          <template #default="scope">
            <span>{{ formDate(+scope.row.valid_time || 0) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="total_time"
          :label="`${$t('table.total_time')}`"
          min-width="100"
          align="center"
          sortable
        >
          <template #default="scope">
            <span>{{ formDate(+scope.row.total_time || 0) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="valid_time_percentage"
          :label="$t('table.valid_time_percentage')"
          min-width="100"
          align="center"
        >
          <template #default="scope">
            <span>{{ (+scope.row.valid_time_percentage || 0) * 100 }}%</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          :label="$t('table.betting_amount')"
          min-width="120"
          align="center"
          sortable
        />
        <el-table-column
          prop="bonus"
          :label="$t('table.bonus')"
          min-width="120"
          align="center"
          sortable
        />
        <el-table-column
          prop="win_lose"
          :label="$t('table.profit_loss')"
          min-width="160"
          align="center"
          sortable
        />
        <!-- <el-table-column
          prop="settle_admin_name"
          :label="$t('table.settle_admin_name')"
          min-width="160"
          align="center"
        /> -->
        <el-table-column
          prop="trade_admin_user"
          :label="$t('table.trader')"
          min-width="160"
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

