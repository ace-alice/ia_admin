<route lang="yaml">
name: zoneManage
meta:
  title: 赛区管理
  constant: false
  layout: true
</route>

<script lang="ts" setup>
import { Edit, Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/match-data-manage/zone-manage'
import { dictionary } from '@/hooks/lib'
import PromiseSwitch from '@/components/PromiseSwitch/index.vue'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'
import getGameListHook from '@/hooks/getGameListHook'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '赛区管理',
  crudOptShow: {
    add: true,
    formSize: '50%',
  },
  defaultQuery: {
    game_type_id: null,
    is_del: null,
    name: '',
  },
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'zone:manage:',
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
const { gameList, getGameTypeName } = getGameListHook(false, false)

const { isNot, statusOptions } = dictionary()
</script>

<template>
  <PageMain title="赛区管理" :has-tool="true" :has-footer="true">
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.game_name')" prop="game_name">
          <el-select
            v-model="crudQuery.game_type_id"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in gameList"
              :key="item.id"
              :label="item.game_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.bet_state')" prop="is_del">
          <el-select
            v-model="crudQuery.is_del"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.name_cn')" prop="name">
          <el-input
            v-model="crudQuery.name"
            type="text"
            clearable
            :placeholder="$t('table.name')"
          />
        </el-form-item>

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
      <el-button type="primary" :icon="Plus" @click="toAdd">
        {{ $t('crud.add') }}
      </el-button>
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
        :header-cell-style="filterHeaderColumn"
      >
        <el-table-column
          v-if="getColumnShow('id')"
          prop="id"
          label="id"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('name')"
          prop="name"
          :label="$t('table.game_name' /**所属游戏 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            {{ getGameTypeName(+scope.row.game_type_id) || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('name_cn')"
          prop="name_cn"
          :label="$t('table.title_cn' /**简体 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('name_tw')"
          prop="name_tw"
          :label="$t('table.title_tw' /**繁体 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('name_en')"
          prop="name_en"
          :label="$t('table.title_en' /**英文 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('is_del')"
          prop="is_del"
          :label="$t('table.is_del')"
          width="130"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.id"
              :init-value="scope.row.is_del"
              :options="isNot"
              :default-param="{
                id: scope.row.id,
                is_del: scope.row.is_del,
              }"
              param-key="is_del"
              :change-fun="changeStatus"
              emit-fun-name="updateStatus"
              :permission="tablePermission.editDomain"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="table.operate"
          width="120"
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
          label-width="120px"
          class="demo-ruleForm"
          inline
        >
          <el-form-item
            :label="$t('table.game_name' /**所属游戏 */)"
            prop="game_type_id"
            style="width: 100%"
            :rules="[
              {
                required: true,
                message: $t('table.game_name') + $t('table.not_empty'),
              },
            ]"
          >
            <el-select
              v-model="proxyForm.game_type_id"
              :placeholder="$t('lib.all')"
              filterable
              style="width: 360px"
            >
              <el-option
                v-for="game in gameList"
                :key="game.id"
                :label="game.game_name"
                :value="game.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.title_cn' /**名称（简体） */)"
            prop="name_cn"
            style="width: 100%"
            :rules="[
              {
                required: true,
                message: $t('table.title_cn') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.name_cn"
              type="text"
              style="width: 360px"
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.title_tw' /**名称（繁体） */)"
            prop="name_tw"
            style="width: 100%"
            :rules="[
              {
                required: true,
                message: $t('table.title_tw') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.name_tw"
              type="text"
              style="width: 360px"
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.title_en' /**名称（英文） */)"
            prop="name_en"
            style="width: 100%"
            :rules="[
              {
                required: true,
                message: $t('table.title_en') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.name_en"
              type="text"
              style="width: 360px"
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.serial_number' /**序号 */)"
            prop="sort"
            style="width: 100%"
          >
            <el-input-number
              v-model="proxyForm.sort"
              :placeholder="$t('table.sort')"
              :min="0"
              step-strictly
              :step="1"
              style="width: 220px"
              clearable
            />
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
