<route lang="yaml">
name: gameManage
meta:
  title: 游戏管理
  constant: false
  layout: true
</route>

<script lang="ts" setup name="gameManage">
import { Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import { parseTime } from '@/utils/formatTime'
import { i18n } from '@/i18n'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/match-data-manage/game-manage'
import { dictionary } from '@/hooks/lib'
import PromiseSwitch from '@/components/PromiseSwitch/index.vue'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('other.game'),
  crudOptShow: {
    add: true,
    formSize: '50%',
  },
  defaultQuery: {
    game_name: null,
    is_del: null,
  },
  crudMethod: { ...Api },
  defaultForm: {
    id: null,
    game_name_cn: null,
    game_name_en: null,
    game_name_tw: null,
    game_name_th: null,
    game_name_vn: null,
    game_name_in: null,
    game_name_jp: null,
    game_name_kr: null,
    logo_w: null,
    sort: 0,
    is_del: 0,
  },
  crudTag: 'game:manage',
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
  setTheForm,
} = CRUD(defaultCrudOptions)

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()

const { isDisableOptions, isNot } = dictionary()

function setTheFormHandle(form: any) {
  setTheForm({ logo_w: form.logo_w })
}
</script>

<template>
  <PageMain :title="$t('router.game-manage')" :has-tool="true" :has-footer="true">
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.is_disable')" prop="is_disable">
          <el-select
            v-model="crudQuery.is_del"
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
        <el-form-item :label="$t('table.bet_game_name')" prop="game_name">
          <el-input
            v-model="crudQuery.game_name"
            :placeholder="$t('table.bet_game_name')"
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
          min-width="80"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('game_name_cn')"
          prop="game_name_cn"
          :label="$t('table.game_name_cn')"
          min-width="150"
          align="center"
        />

        <el-table-column
          v-if="getColumnShow('game_name_tw')"
          prop="game_name_tw"
          :label="$t('table.game_name_tw')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('game_name_en')"
          prop="game_name_en"
          :label="$t('table.game_name_en')"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('game_name_th')"
          prop="game_name_th"
          :label="$t('table.game_name_th')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('game_name_vn')"
          prop="game_name_vn"
          :label="$t('table.game_name_vn')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('game_name_in')"
          prop="game_name_in"
          :label="$t('table.game_name_in')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('game_name_jp')"
          prop="game_name_jp"
          :label="$t('table.game_name_jp')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('game_name_kr')"
          prop="game_name_kr"
          :label="$t('table.game_name_kr')"
          min-width="150"
          align="center"
        />
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
          v-if="getColumnShow('update_username')"
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
            <span v-if="scope.row.update_time">{{ parseTime(scope.row.update_time) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('is_del')"
          prop="is_del"
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
              :permission="tablePermission.status"
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
        destroy-on-close
      >
        <el-form
          ref="crudDefaultFormRef"
          :model="proxyForm"
          label-width="160px"
          class="demo-ruleForm"
          inline
        >
          <!-- <el-form-item :label="$t('table.is_disable')" prop="is_disable">
            <el-switch
              v-model="proxyForm.is_del"
              style="width: 220px"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item> -->
          <el-form-item
            :label="$t('table.game_name_cn')"
            prop="game_name_cn"
            :rules="[
              {
                required: true,
                message: $t('table.game_name_cn') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.game_name_cn"
              :placeholder="$t('table.game_name_cn')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.game_name_en')"
            prop="game_name_en"
            :rules="[
              {
                required: true,
                message: $t('table.game_name_en') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.game_name_en"
              :placeholder="$t('table.game_name_en')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.game_name_tw')"
            prop="game_name_tw"
            :rules="[
              {
                required: true,
                message: $t('table.game_name_tw') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.game_name_tw"
              :placeholder="$t('table.game_name_tw')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.game_name_th')"
            prop="game_name_th"
            :rules="[
              {
                required: true,
                message: $t('table.game_name_th') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.game_name_th"
              :placeholder="$t('table.game_name_th')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.game_name_vn')"
            prop="game_name_vn"
            :rules="[
              {
                required: true,
                message: $t('table.game_name_vn') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.game_name_vn"
              :placeholder="$t('table.game_name_vn')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.game_name_in')"
            prop="game_name_in"
            :rules="[
              {
                required: true,
                message: $t('table.game_name_in') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.game_name_in"
              :placeholder="$t('table.game_name_in')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.game_name_jp')"
            prop="game_name_jp"
            :rules="[
              {
                required: true,
                message: $t('table.game_name_jp') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.game_name_jp"
              :placeholder="$t('table.game_name_jp')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.game_name_kr')"
            prop="game_name_kr"
            :rules="[
              {
                required: true,
                message: $t('table.game_name_kr') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.game_name_kr"
              :placeholder="$t('table.game_name_kr')"
              style="width: 220px"
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
          <NormalImageUpload
            :form-label="$t('table.logo_w')"
            :data="proxyForm.logo_w"
            imgkey="logo"
            img-url-key="logo_w"
            @set-image="setTheFormHandle"
          />
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
