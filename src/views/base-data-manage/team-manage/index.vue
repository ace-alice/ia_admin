<route lang="yaml">
name: teamManage
meta:
  title: 战队管理
  constant: false
  layout: true
</route>

<script lang="ts" setup name="teamManage">
import { Edit, Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import BindTeam from './components/BindTeam.vue'
import UploadLogo from './components/UploadLogo.vue'
import { parseTime } from '@/utils/formatTime'
import { i18n } from '@/i18n'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/match-data-manage/team-manage'
import { dictionary } from '@/hooks/lib'
import PromiseSwitch from '@/components/PromiseSwitch/index.vue'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'
import getGameListHook from '@/hooks/getGameListHook'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('other.team'),
  crudOptShow: {
    add: true,
    formSize: '50%',
  },
  defaultQuery: {
    team_name: null,
    is_del: null,
    game_id: null,
    is_monitor: null,
  },
  crudMethod: { ...Api },
  defaultForm: {
    id: null,
    game_id: null,
    team_name_cn: null,
    team_name_en: null,
    team_name_tw: null,
    introduction: null,
    sort: 0,
    // is_del: 0,
    // is_monitor: 0,
  },
  crudTag: 'team:manage:',
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

const { isDisableOptions, isNot } = dictionary()

const { gameList, getGameTypeName } = getGameListHook(false, false)

const { proxy }: any = getCurrentInstance()

function toBindTeam(row: any) {
  proxy.mittBus.emit('teamBindTeamBus', row)
}

function toUploadLogo(row: any) {
  proxy.mittBus.emit('uploadLogoBus', row)
}
</script>

<template>
  <PageMain :title="$t('router.team-manage')" :has-tool="true" :has-footer="true">
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.game_name')" prop="game_name">
          <el-select
            v-model="crudQuery.game_id"
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
        <el-form-item :label="$t('table.is_disable')" prop="is_disable">
          <el-select
            v-model="crudQuery.is_del"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
          >
            <el-option
              v-for="item in isDisableOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_monitor')" prop="is_monitor">
          <el-select
            v-model="crudQuery.is_monitor"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
          >
            <el-option
              v-for="item in isNot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.team_name')" prop="team_name">
          <el-input
            v-model="crudQuery.team_name"
            :placeholder="$t('table.team_name')"
            style="width: 200px"
            clearable
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
      <el-button
        v-only="toolPermission.add"
        type="primary"
        :icon="Plus"
        @click="toAdd"
      >
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
          :label="$t('table.id')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('sort')"
          prop="sort"
          :label="$t('table.sort')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('team_name_cn')"
          prop="team_name_cn"
          :label="$t('table.team_name_cn')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('team_name_tw')"
          prop="team_name_tw"
          :label="$t('table.team_name_tw')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('team_name_en')"
          prop="team_name_en"
          :label="$t('table.team_name_en')"
          min-width="130"
          align="center"
        />

        <el-table-column
          v-if="getColumnShow('game_id')"
          prop="game_id"
          :label="$t('table.game_name')"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            {{ getGameTypeName(+scope.row.game_id) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('logo_w')"
          prop="logo_w"
          :label="$t('table.logo_w')"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <el-image
              style="width: 48px; height: 48px"
              :src="scope.row.logo_w"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('update_user')"
          prop="update_username"
          :label="$t('table.action_name')"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('update_time')"
          prop="update_time"
          :label="$t('table.update_time1')"
          min-width="190"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.update_time">
              {{ parseTime(scope.row.update_time) }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('is_del')"
          :label="$t('table.is_disable')"
          width="150"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.id"
              :init-value="scope.row.is_del"
              :options="isDisableOptions"
              :default-param="{
                id: scope.row.id,
                del: scope.row.is_del,
              }"
              param-key="del"
              :change-fun="changeStatus"
              emit-fun-name="isDisable"
              :permission="tablePermission.is_disable"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('is_monitor')"
          :label="$t('table.is_monitor')"
          width="150"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.id"
              :init-value="scope.row.is_monitor"
              :options="isNot"
              :default-param="{
                id: scope.row.id,
                is_monitor: scope.row.is_monitor,
              }"
              param-key="del"
              :change-fun="changeStatus"
              emit-fun-name="updateMonitorStatus"
              :permission="tablePermission.is_disable"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operate')"
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
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.bindTeam"
                      type="primary"
                      size="small"
                      @click="toBindTeam(scope.row)"
                    >
                      {{ $t('table.bind_team') }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.uploadLogo"
                      type="primary"
                      size="small"
                      @click="toUploadLogo(scope.row)"
                    >
                      {{ $t('table.upload_logo') }}
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
          label-width="160px"
          class="demo-ruleForm"
          inline
        >
          <el-form-item
            :label="$t('table.game_name')"
            prop="game_id"
            :rules="[
              {
                required: true,
                message: $t('table.game_name') + $t('table.not_empty'),
              },
            ]"
          >
            <el-select
              v-model="proxyForm.game_id"
              style="width: 60%"
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
          <el-form-item
            :label="$t('table.team_name_cn')"
            prop="team_name_cn"
            :rules="[
              {
                required: true,
                message: $t('table.team_name_cn') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.team_name_cn"
              :placeholder="$t('table.team_name_cn')"
              style="width: 60%"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.team_name_en')"
            prop="team_name_en"
            :rules="[
              {
                required: true,
                message: $t('table.team_name_en') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.team_name_en"
              :placeholder="$t('table.team_name_en')"
              style="width: 60%"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.team_name_tw')"
            prop="team_name_tw"
            :rules="[
              {
                required: true,
                message: $t('table.team_name_tw') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.team_name_tw"
              :placeholder="$t('table.team_name_tw')"
              style="width: 60%"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.intro')" prop="introduction">
            <el-input
              v-model="proxyForm.introduction"
              :placeholder="$t('table.intro')"
              :rows="4"
              type="textarea"
              style="width: 60%"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.sort')" prop="sort">
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
      <BindTeam />
      <UploadLogo @refresh="refresh" />
    </template>
  </PageMain>
</template>

<style lang="scss" scoped>
.el-dialog__body{
  .el-form-item{
    width: 100%;
  }
}
</style>
