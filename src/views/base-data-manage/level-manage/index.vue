<route lang="yaml">
name: levelManage
meta:
  title: 赛事等级管理
  constant: false
  layout: true
</route>

<script lang="ts" setup>
import { Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/match-data-manage/level-manage'
import { dictionary } from '@/hooks/lib'
import PromiseSwitch from '@/components/PromiseSwitch/index.vue'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'
import { parseTime } from '@/utils/formatTime'
import { i18n } from '@/i18n'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('table.event_leve_name'),
  crudOptShow: {
    add: true,
    formSize: '80%',
  },
  defaultQuery: {},
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'level:manage:',
}

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  changeStatus,
  crudStatus,
  toAdd,
  resetCrudStatus,
  dialogVisible,
  submitHandle,
  crudOptShow,
  crudDefaultFormRef,
  proxyForm,
  toEdit,
  reQuery,
} = CRUD(defaultCrudOptions)

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()

const { isDisableReseverOptions } = dictionary()
</script>

<template>
  <PageMain :title="$t('router.competition-level-manage')" :has-tool="true" :has-search="false" :has-footer="true">
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item>
          <el-button
            type="primary"
            :icon="Search"
            :loading="queryLoading"
            @click="toQuery"
          >
            {{ $t('crud.search') }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="RefreshRight"
            :loading="queryLoading"
            @click="reQuery"
          >
            {{ $t('crud.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #pageTool>
      <el-button v-only="toolPermission.add" type="primary" :icon="Plus" @click="toAdd">
        {{ $t('crud.add') }}
      </el-button>
    </template>
    <template #pageBody>
      <el-table
        ref="tableRef"
        v-loading="queryLoading"
        :data="crudData"
        stripe
        style="width: 100%;"
        height="100%"
        border
        resizable
        :header-cell-style="filterHeaderColumn"
      >
        <el-table-column
          v-if="getColumnShow('level' /**盘口等级 */)"
          prop="level"
          :label="$t('table.handicap_level')"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('single_limit_min')"
          :label="$t('table.single_limit' /**单注限红 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <div>{{ scope.row.single_limit_min }}</div>
            <div>{{ scope.row.single_limit_max }}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('single_payout_min')"
          :label="$t('table.single_payout' /**单注赔付 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <div>{{ scope.row.single_payout_min }}</div>
            <div>{{ scope.row.single_payout_max }}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('single_game_min')"
          :label="$t('table.single_play_payout' /**单注玩法赔付 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <div>{{ scope.row.single_game_min }}</div>
            <div>{{ scope.row.single_game_max }}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('stop_game_min')"
          :label="$t('table.stop_game'/**停盘值 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <div>{{ scope.row.stop_game_min }}</div>
            <div>{{ scope.row.stop_game_max }}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('warning_game_min')"
          :label="$t('table.warning_game' /**预警值 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <div>{{ scope.row.warning_game_min }}</div>
            <div>{{ scope.row.warning_game_max }}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('single_competition_min')"
          :label="$t('table.single_handicap_payout' /**单注盘口赔付 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <div>{{ scope.row.single_competition_min }}</div>
            <div>{{ scope.row.single_competition_max }}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('game_rate')"
          :label="$t('table.play_return_rate' /**玩法返还率 */)"
          prop="game_rate"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('single_parlay_min')"
          prop="single_parlay_min"
          :label="$t('table.other_single_payout' /**其他串关单注赔付 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('single_parlay_3')"
          prop="single_parlay_3"
          :label="$t('table.three_to_one_payout' /**3串1单注赔付 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('single_parlay_4')"
          prop="single_parlay_4"
          :label="$t('table.four_to_one_payout' /**4串1单注赔付 */)"
          min-width="130"
          align="center"
        />

        <el-table-column
          v-if="getColumnShow('single_parlay_5')"
          prop="single_parlay_5"
          :label="$t('table.five_to_one_payout' /**5串1单注赔付 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('single_parlay_6')"
          prop="single_parlay_6"
          :label="$t('table.six_to_one_payout' /**6串1单注赔付 */)"
          min-width="130"
          align="center"
        />

        <el-table-column
          v-if="getColumnShow('single_parlay_7')"
          prop="single_parlay_7"
          :label="$t('table.seven_to_one_payout'/**7串1单注赔付 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('single_parlay_8')"
          prop="single_parlay_8"
          :label="$t('table.eight_to_one_payout'/**8串1单注赔付 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('single_parlay_9')"
          prop="single_parlay_9"
          :label="$t('table.nine_to_one_payout'/**9串1单注赔付 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('single_parlay_10')"
          prop="single_parlay_10"
          :label="$t('table.ten_to_one_payout'/**10串1单注赔付 */)"
          min-width="130"
          align="center"
        />
        <!-- 累计赔付   start -->
        <el-table-column
          v-if="getColumnShow('other_cumulate_parlay')"
          prop="other_cumulate_parlay"
          :label="$t('table.other_cumulate_parlay' /**其他串关累计赔付 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('cumulate_parlay_3')"
          prop="cumulate_parlay_3"
          :label="$t('table.cumulate_parlay_3' /**3串1累计赔付 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('cumulate_parlay_4')"
          prop="cumulate_parlay_4"
          :label="$t('table.cumulate_parlay_4' /**4串1累计赔付 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('cumulate_parlay_5')"
          prop="cumulate_parlay_5"
          :label="$t('table.cumulate_parlay_5' /**5串1累计赔付 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('cumulate_parlay_6')"
          prop="cumulate_parlay_6"
          :label="$t('table.cumulate_parlay_6' /**6串1累计赔付 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('cumulate_parlay_7')"
          prop="cumulate_parlay_7"
          :label="$t('table.cumulate_parlay_7'/**7串1累计赔付 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('cumulate_parlay_8')"
          prop="cumulate_parlay_8"
          :label="$t('table.cumulate_parlay_8'/**8串1累计赔付 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('cumulate_parlay_9')"
          prop="cumulate_parlay_9"
          :label="$t('table.cumulate_parlay_9'/**9串1累计赔付 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('cumulate_parlay_10')"
          prop="cumulate_parlay_10"
          :label="$t('table.cumulate_parlay_10'/**10串1累计赔付 */)"
          min-width="130"
          align="center"
        />
        <!-- 累计赔付   end -->
        <el-table-column
          v-if="getColumnShow('single_change_rate')"
          prop="single_change_rate"
          :label="$t('table.single_loss_coefficient' /**单枪变赔系数 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('cumulate_change_rate')"
          prop="cumulate_change_rate"
          :label="$t('table.cumulative_variation_coefficient' /**累计变赔系数 */)"
          min-width="130"
          align="center"
        />

        <el-table-column
          v-if="getColumnShow('single_change_extent')"
          prop="single_change_extent"
          :label="$t('table.range_of_single'/**单枪变赔幅度 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('single_change_extent_live')"
          prop="single_change_extent_live"
          :label="$t('table.range_of_single_roll'/**单枪变赔幅度(滚球) */)"
          min-width="130"
          align="center"
        />

        <el-table-column
          v-if="getColumnShow('cumulate_change_extent')"
          prop="cumulate_change_extent"
          :label="$t('table.cumulative_loss_range'/**累计变赔幅度 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('cumulate_change_extent_live')"
          prop="cumulate_change_extent_live"
          :label="$t('table.cumulative_loss_range_roll'/**累计变赔幅度(滚球) */)"
          min-width="130"
          align="center"
        />

        <el-table-column
          v-if="getColumnShow('single_side_rate')"
          prop="single_side_rate"
          :label="$t('table.single_change_coefficient'/**单边变赔系数 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('single_side_extent')"
          prop="single_side_extent"
          :label="$t('table.single_change_amplitude'/**单边变赔幅度 */)"
          min-width="130"
          align="center"
        />

        <el-table-column
          v-if="getColumnShow('single_side_extent_live')"
          prop="single_side_extent_live"
          :label="$t('table.single_change_amplitude_roll'/**单边变赔幅度(滚球) */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('update_time')"
          prop="update_time"
          :label="$t('table.operator_time'/**操作时间 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.update_time">{{ parseTime(scope.row.update_time) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="getColumnShow('status')"
          prop="status"
          :label="$t('table.is_open')"
          width="130"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.id"
              :init-value="scope.row.status"
              :options="isDisableReseverOptions"
              :default-param="{
                id: scope.row.id,
                status: scope.row.status,
              }"
              param-key="status"
              :change-fun="changeStatus"
              emit-fun-name="updateStatus"
              :permission="tablePermission.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="table.operate"
          min-width="130"
          align="center"
          fixed="right"
        >
          <template #header>
            <FilterColumnControl :column-info="columnInfo" />
          </template>
          <template #default="scope">
            <span v-some="Object.values(otherPermission)">
              <el-dropdown
                placement="bottom-end"
                :hide-on-click="false"
                trigger="click"
              >
                <el-button type="warning" link>
                  {{ $t('table.operateControl') }}
                </el-button>
                <template #dropdown>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.edit"
                      type="primary"
                      size="small"
                      @click="toEdit(scope.row)"
                    >
                      {{ $t('crud.edit') }}
                    </el-button>
                  </el-dropdown-item>
                  <!-- <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.del"
                      type="danger"
                      size="small"
                      @click="toDel({ ids: [scope.row.file_id] })"
                    >
                      {{ $t('crud.delete') }}
                    </el-button>
                  </el-dropdown-item> -->
                </template>
              </el-dropdown>
            </span>
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
    <template #other>
      <el-dialog
        v-model="dialogVisible"
        :title="crudStatus.title"
        :before-close="resetCrudStatus"
        :width="crudOptShow.formSize"
      >
        <el-form
          ref="crudDefaultFormRef"
          :model="proxyForm"
          label-width="260px"
          class="demo-ruleForm"
          inline
        >
          <el-form-item :label="$t('table.handicap_level_name' /**盘口等级名称 */)">
            <el-input v-model="proxyForm.level" />
          </el-form-item>
          <el-form-item :label="$t('table.single_limit' /**单注限红 */)">
            <el-col :span="11">
              <el-input v-model="proxyForm.single_limit_min" type="number" :placeholder="$t('table.default_value_num')" />
            </el-col>
            <el-col :span="2" class="text-center">
              <span class="text-gray-500">-</span>
            </el-col>
            <el-col :span="11">
              <el-input v-model="proxyForm.single_limit_max" type="number" :placeholder="$t('table.max_value')" />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('table.single_payout' /**单注赔付 */)">
            <el-col :span="11">
              <el-input v-model="proxyForm.single_payout_min" type="number" :placeholder="$t('table.default_value_num')" />
            </el-col>
            <el-col :span="2" class="text-center">
              <span class="text-gray-500">-</span>
            </el-col>
            <el-col :span="11">
              <el-input v-model="proxyForm.single_payout_max" type="number" :placeholder="$t('table.max_value')" />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('table.single_play_payout' /**单注玩法赔付 */)">
            <el-col :span="11">
              <el-input v-model="proxyForm.single_game_min" type="number" :placeholder="$t('table.default_value_num')" />
            </el-col>
            <el-col :span="2" class="text-center">
              <span class="text-gray-500">-</span>
            </el-col>
            <el-col :span="11">
              <el-input v-model="proxyForm.single_game_max" type="number" :placeholder="$t('table.max_value')" />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('table.stop_game' /**停盘值 */)">
            <el-col :span="11">
              <el-input v-model="proxyForm.stop_game_min" type="number" :placeholder="$t('table.default_value_num')" />
            </el-col>
            <el-col :span="2" class="text-center">
              <span class="text-gray-500">-</span>
            </el-col>
            <el-col :span="11">
              <el-input v-model="proxyForm.stop_game_max" type="number" :placeholder="$t('table.max_value')" />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('table.warning_game' /**预警值 */)">
            <el-col :span="11">
              <el-input v-model="proxyForm.warning_game_min" type="number" :placeholder="$t('table.default_value_num')" />
            </el-col>
            <el-col :span="2" class="text-center">
              <span class="text-gray-500">-</span>
            </el-col>
            <el-col :span="11">
              <el-input v-model="proxyForm.warning_game_max" type="number" :placeholder="$t('table.max_value')" />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('table.single_handicap_payout' /**单注盘口赔付 */)">
            <el-col :span="11">
              <el-input v-model="proxyForm.single_competition_min" type="number" :placeholder="$t('table.default_value_num')" />
            </el-col>
            <el-col :span="2" class="text-center">
              <span class="text-gray-500">-</span>
            </el-col>
            <el-col :span="11">
              <el-input v-model="proxyForm.single_competition_max" type="number" :placeholder="$t('table.max_value')" />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('table.play_return_rate' /**玩法返还率 */)">
            <el-input v-model="proxyForm.game_rate" type="number" :placeholder="$t('table.default_value_rate')" />
          </el-form-item>
          <el-form-item :label="$t('table.other_single_payout' /**其他串关单注赔付 */)">
            <el-input v-model="proxyForm.single_parlay_min" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.three_to_one_payout' /**3串1单注赔付 */)">
            <el-input v-model="proxyForm.single_parlay_3" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.four_to_one_payout' /**4串1单注赔付 */)">
            <el-input v-model="proxyForm.single_parlay_4" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.five_to_one_payout' /**5串1单注赔付 */)">
            <el-input v-model="proxyForm.single_parlay_5" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.six_to_one_payout' /**6串1单注赔付 */)">
            <el-input v-model="proxyForm.single_parlay_6" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.seven_to_one_payout' /**7串1单注赔付 */)">
            <el-input v-model="proxyForm.single_parlay_7" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.eight_to_one_payout' /**8串1单注赔付 */)">
            <el-input v-model="proxyForm.single_parlay_8" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.nine_to_one_payout' /**9串1单注赔付 */)">
            <el-input v-model="proxyForm.single_parlay_9" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.ten_to_one_payout' /**10串1单注赔付 */)">
            <el-input v-model="proxyForm.single_parlay_10" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <!-- start -->
          <el-form-item :label="$t('table.other_cumulate_parlay' /**其他串关累计赔付 */)">
            <el-input v-model="proxyForm.other_cumulate_parlay" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.cumulate_parlay_3' /**3串1累计赔付 */)">
            <el-input v-model="proxyForm.cumulate_parlay_3" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.cumulate_parlay_4' /**4串1累计赔付 */)">
            <el-input v-model="proxyForm.cumulate_parlay_4" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.cumulate_parlay_5' /**5串1累计赔付 */)">
            <el-input v-model="proxyForm.cumulate_parlay_5" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.cumulate_parlay_6' /**6串1累计赔付 */)">
            <el-input v-model="proxyForm.cumulate_parlay_6" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.cumulate_parlay_7' /**7串1累计赔付 */)">
            <el-input v-model="proxyForm.cumulate_parlay_7" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.cumulate_parlay_8' /**8串1累计赔付 */)">
            <el-input v-model="proxyForm.cumulate_parlay_8" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.cumulate_parlay_9' /**9串1累计赔付 */)">
            <el-input v-model="proxyForm.cumulate_parlay_9" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.cumulate_parlay_10' /**10串1累计赔付 */)">
            <el-input v-model="proxyForm.cumulate_parlay_10" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <!-- end -->
          <el-form-item :label="$t('table.single_loss_coefficient' /**单枪变赔系数 */)">
            <el-input v-model="proxyForm.single_change_rate" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.cumulative_variation_coefficient' /**累计变赔系数 */)">
            <el-input v-model="proxyForm.cumulate_change_rate" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.range_of_single' /**单枪变赔幅度 */)">
            <el-input v-model="proxyForm.single_change_extent" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.range_of_single_roll' /**单枪变赔幅度(滚球) */)">
            <el-input v-model="proxyForm.single_change_extent_live" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.cumulative_loss_range' /**累计变赔幅度 */)">
            <el-input v-model="proxyForm.cumulate_change_extent" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.cumulative_loss_range_roll' /**累计变赔幅度(滚球) */)">
            <el-input v-model="proxyForm.cumulate_change_extent_live" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.single_change_coefficient' /**单边变赔系数 */)">
            <el-input v-model="proxyForm.single_side_rate" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.single_change_amplitude' /**单边变赔幅度 */)">
            <el-input v-model="proxyForm.single_side_extent" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
          <el-form-item :label="$t('table.single_change_amplitude_roll' /**单边变赔幅度(滚球) */)">
            <el-input v-model="proxyForm.single_side_extent_live" type="number" :placeholder="$t('table.default_value_num')" />
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="resetCrudStatus">
              {{ $t('crud.cancel') }}
            </el-button>
            <el-button type="primary" @click="submitHandle">
              {{ $t('crud.sure') }}
            </el-button>
          </span>
        </template>
      </el-dialog>
    </template>
  </PageMain>
</template>

<style lang="scss" scoped>
.el-form-item {
  width: 40%;
}

.text-center {
  text-align: center;
}
</style>
