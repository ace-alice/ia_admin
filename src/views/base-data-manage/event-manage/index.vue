<route lang="yaml">
name: eventManage
meta:
  title: 赛事管理
  constant: false
  layout: true
</route>

<script lang="ts" setup name="eventManage">
import { Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import { parseTime } from '@/utils/formatTime'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/match-data-manage/event-manage'
import { dictionary } from '@/hooks/lib'
import PromiseSwitch from '@/components/PromiseSwitch/index.vue'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'
import getGameListHook from '@/hooks/getGameListHook'
import getMatchLevelListHook from '@/hooks/getMatchLevelListHook'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '赛事管理',
  crudOptShow: {
    add: true,
    formSize: '50%',
  },
  defaultQuery: {
    game_id: null,
    is_del: null /** 状态 */,
    is_monitor: null /** 是否监控 */,
    event_name: '', /** 赛事名称 */
  },
  crudMethod: { ...Api },
  defaultForm: {
    config_id: null,
    create_time: null,
    create_user: null,
    create_username: null,
    event_name: null,
    event_name_cn: null,
    event_name_en: null,
    event_name_tw: null,
    game_id: null,
    id: null,
    introduction: null,
    is_del: null,
    is_monitor: null,
    logo_w: null,
    sort: 0,
    update_time: null,
    update_user: null,
    update_username: null,
  },
  crudTag: 'event:manage:',
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
  toDel,
  reQuery,
} = CRUD(defaultCrudOptions)

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()

const { isDisableOptions, opiton1 }
  = dictionary()
const { gameList, getGameTypeName } = getGameListHook(false, false)
const { matchLevelList } = getMatchLevelListHook()
const getEventLabel = (id: number) => {
  if (matchLevelList && matchLevelList.value.length > 0) {
    const find = matchLevelList.value.find((item: any) => item.id === id)
    if (!find) {
      return false
    }
    return find.level
  }
}
</script>

<template>
  <PageMain
    :title="$t('router.competition-manage')"
    :has-tool="true"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.game_name' /**所属游戏 */)">
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
        <el-form-item :label="$t('table.status' /**状态 */)">
          <el-select
            v-model="crudQuery.is_del"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in isDisableOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_monitor' /**是否监控 */)">
          <el-select
            v-model="crudQuery.is_monitor"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in opiton1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.eventName')" prop="event_name">
          <el-input
            v-model="crudQuery.event_name"
            :placeholder="$t('table.eventName')"
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
    <template #pageTool>
      <el-button
        v-only="toolPermission.add"
        type="primary"
        :icon="Plus"
        @click="toAdd"
      >
        {{ $t("crud.add") }}
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
          min-width="130"
          align="center"
        />
        <el-table-column
          prop="event_name_cn"
          :label="$t('table.event_name_cn' /**赛事名称 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          prop="event_name_tw"
          :label="$t('table.event_name_tw' /**赛事名称（繁体中文） */)"
          min-width="130"
          align="center"
        />

        <el-table-column
          prop="event_name_en"
          :label="$t('table.event_name_en' /**赛事名称（英文） */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          :label="$t('table.event_leve_name' /**赛事等级 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            {{ getEventLabel(scope.row.config_id) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="game_id"
          :label="$t('table.game_type' /**所属游戏 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            {{ getGameTypeName(+scope.row.game_id) }}
          </template>
        </el-table-column>

        <!-- <el-table-column
          prop="logo_w"
          :label="$t('table.while_logo' /**透明Logo */)"
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
          prop="logo_b"
          :label="$t('table.black_logo' /**黑色Logo */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <el-image
              style="width: 48px; height: 48px"
              :src="scope.row.logo_b"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="poster"
          :label="$t('table.poster_pc' /**海报(pc)*/)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <el-image
              style="width: 48px; height: 48px"
              :src="scope.row.poster"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="poster_wap"
          :label="$t('table.poster_wap' /**海报(wap) */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <el-image
              style="width: 48px; height: 48px"
              :src="scope.row.poster_wap"
              fit="cover"
            />
          </template>
        </el-table-column> -->
        <el-table-column
          prop="update_username"
          :label="$t('table.update_people' /**更新人 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          prop="update_time"
          :label="$t('table.update_time1' /**更新时间 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.update_time">{{
              parseTime(scope.row.update_time)
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="getColumnShow('is_del')"
          prop="is_del"
          :label="$t('table.is_disable')"
          width="130"
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
              param-key="is_del"
              :change-fun="changeStatus"
              emit-fun-name="updateStatus"
              :permission="tablePermission.status"
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
                  {{ $t("table.operateControl") }}
                </el-button>
                <template #dropdown>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.edit"
                      type="primary"
                      size="small"
                      @click="toEdit(scope.row)"
                    >
                      {{ $t("crud.edit") }}
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
          label-width="150px"
          class="demo-ruleForm"
          inline
        >
          <el-form-item
            :label="$t('table.game_type' /**所属游戏 */)"
            prop="game_id"
            :rules="[
              {
                required: true,
                message: $t('table.game_type') + $t('table.not_empty'),
              },
            ]"
          >
            <el-select
              v-model="proxyForm.game_id"
              style="width: 80%"
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
            :label="$t('table.event_name_cn' /**赛事名称(简体中文) */)"
            prop="event_name_cn"
            :rules="[
              {
                required: true,
                message: $t('table.event_name_cn') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input v-model="proxyForm.event_name_cn" style="width: 80%" />
          </el-form-item>
          <el-form-item
            :label="$t('table.event_name_tw' /**赛事名称(繁体中文) */)"
            prop="event_name_tw"
            :rules="[
              {
                required: true,
                message: $t('table.event_name_tw') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input v-model="proxyForm.event_name_tw" style="width: 80%" />
          </el-form-item>
          <el-form-item
            :label="$t('table.event_name_en' /**赛事名称(英文) */)"
            prop="event_name_en"
            :rules="[
              {
                required: true,
                message: $t('table.event_name_en') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input v-model="proxyForm.event_name_en" style="width: 80%" />
          </el-form-item>
          <el-form-item
            :label="$t('table.event_leve_name' /**赛事等级 */)"
            prop="config_id"
            :rules="[
              {
                required: true,
                message: $t('table.event_leve_name') + $t('table.not_empty'),
              },
            ]"
          >
            <el-select
              v-model="proxyForm.config_id"
              style="width: 80%"
              popper-class="user-select"
              :placeholder="$t('lib.all')"
              clearable
              filterable
            >
              <el-option
                v-for="item in matchLevelList"
                :key="item.id"
                :label="item.level"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.competition_introduce' /**赛事简介 */)"
          >
            <el-input
              v-model="proxyForm.introduction"
              :rows="4"
              type="textarea"
              style="width: 80%"
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
              {{ $t("crud.cancel") }}
            </el-button>
            <el-button type="primary" @click="submitHandle">
              {{ $t("crud.sure") }}
            </el-button>
          </span>
        </template>
      </el-dialog>
    </template>
  </PageMain>
</template>

<style lang="scss" scoped>
.el-dialog__body {
  .el-form-item {
    width: 100%;
  }
}
</style>
