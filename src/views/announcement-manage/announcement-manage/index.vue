<route lang="yaml">
name: announcementManage
meta:
  title: 公告管理
  constant: false
  layout: true
</route>

<script lang="ts" setup name="announcementManage">
import { Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/announcement-manage/announcement-manage'
import { dictionary } from '@/hooks/lib'
import PromiseSwitch from '@/components/PromiseSwitch/index.vue'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'
import { parseTime } from '@/utils/formatTime'

const defaultFormC: any = {
  id: null,
  title: null, // 标题
  title_cn: null, // 标题
  title_tw: null, // 标题
  title_en: null, // 标题
  content: null, // 内容
  content_cn: null, // 内容
  content_tw: null, // 内容
  content_en: null, // 内容
  show_type: '1', // 展示位置:1-前台，2-商户 以,分隔
  show_type_arr: [1], // 展示位置:1-前台，2-商户 以,分隔
  sort: 0, // 排序
  create_user: null, // 创建管理员id
  create_name: null, // 创建管理员名称
  create_time: null,
  update_user: null, // 更新管理员id
  update_time: null,
  update_name: null, // 更新管理员名称
  status: 1, // 状态：0-下线，1-上线
  purpose: 9, // 公告目的，1赛程变更，2赛程提前，3赛制变更，4战队弃权，5战队弃赛，6比赛信息错误，7赔率错误 8无官方赛果 9其它
  target: 1, // 目标人群，1全部会员，2有下注的会员
  game_id: null, // 盘口编号
  target_id: null, // 针对的战队/玩法的编号
}

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '',
  crudOptShow: {
    add: true,
    formSize: '900px',
  },
  defaultQuery: {
    status: null,
    id: null,
    start_time: null,
    end_time: null,
    key: null,
  },
  crudMethod: { ...Api },
  defaultForm: Object.assign({}, defaultFormC),
  crudTag: 'announcement:manage:',
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
  crudSetQueryKey,
  crudHook,
} = CRUD(defaultCrudOptions)

function purposeChange() {
  Object.assign(proxyForm, defaultFormC, {
    id: proxyForm.id,
    purpose: proxyForm.purpose,
  })
  setTimeout(() => {
    crudDefaultFormRef.value && crudDefaultFormRef.value.clearValidate()
  }, 60)
}

crudHook.beforeToCU = (form: any) => {
  proxyForm.show_type_arr = String(form.show_type)
    .split(',')
    .map(s => Number(s))
  return true
}

crudHook.beforeValidateCU = (form: any) => {
  form.show_type = form.show_type_arr.join(',')
  return true
}

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()

const {
  announcementStatusOption,
  announcementPurposeOption,
  announcementDisplayOption,
  announcementTargetOption,
} = dictionary()
</script>

<template>
  <PageMain
    :title="$t('router.announcement-manage')"
    :has-tool="true"
    :has-search="true"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.status')">
          <el-select
            v-model="crudQuery.status"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="game in announcementStatusOption"
              :key="game.value"
              :label="game.label"
              :value="game.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.word_key')">
          <el-input
            v-model="crudQuery.key"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="ID">
          <el-input
            v-model="crudQuery.id"
            type="number"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.create_time')">
          <dateTimePickerQuery
            start-key="start_time"
            end-key="end_time"
            :prop-time="[crudQuery.start_time, crudQuery.end_time]"
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
          v-if="getColumnShow('number')"
          prop="id"
          :label="$t('table.number')"
          min-width="80"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('title')"
          prop="title"
          :label="$t('table.announcement_title')"
          min-width="200"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="getColumnShow('content')"
          prop="content"
          :label="$t('table.content')"
          min-width="160"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="getColumnShow('status')"
          prop="status"
          :label="$t('table.status')"
          width="130"
          align="center"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.id"
              :init-value="scope.row.status"
              :options="announcementStatusOption"
              :default-param="{
                id: scope.row.id,
                status: scope.row.status,
              }"
              param-key="status"
              :change-fun="changeStatus"
              emit-fun-name="onlineApi"
              :permission="tablePermission.status"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column
          v-if="getColumnShow('sort')"
          prop="sort"
          :label="$t('table.sort')"
          min-width="80"
          align="center"
        /> -->
        <el-table-column
          v-if="getColumnShow('create_name')"
          prop="create_name"
          :label="$t('table.create_name')"
          min-width="120"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('create_time')"
          prop="create_time"
          :label="$t('table.create_time')"
          min-width="170"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.create_time">{{
              parseTime(scope.row.create_time)
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('update_name')"
          prop="update_name"
          :label="$t('table.update_people')"
          min-width="120"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('update_time')"
          prop="update_time"
          :label="$t('table.operator_time')"
          min-width="170"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.update_time">{{
              parseTime(scope.row.update_time)
            }}</span>
            <span v-else>--</span>
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
        <template #header>
          <el-form-item
            :label="`${crudStatus.title}  ${$t('table.announce_objective')}`"
          >
            <el-select
              v-model="proxyForm.purpose"
              style="width: 220px"
              :placeholder="$t('table.to-select')"
              popper-class="user-select"
              filterable
              @change="purposeChange"
            >
              <el-option
                v-for="game in announcementPurposeOption"
                :key="game.value"
                :label="game.label"
                :value="game.value"
              />
            </el-select>
          </el-form-item>
        </template>
        <el-form
          ref="crudDefaultFormRef"
          :model="proxyForm"
          label-width="160px"
          class="demo-ruleForm"
          inline
          label-position="top"
        >
          <template v-if="+proxyForm.purpose === 9">
            <el-form-item
              :label="`${$t('table.title')}(zh_cn)`"
              :rules="[
                {
                  required: true,
                  message: $t('table.title') + $t('table.not_empty'),
                },
              ]"
              style="width: 100%"
              prop="title_cn"
            >
              <el-input
                v-model="proxyForm.title_cn"
                :autosize="{ minRows: 1, maxRows: 3 }"
                type="textarea"
                maxlength="50"
                show-word-limit
                :placeholder="$t('other.pls_input')"
              />
            </el-form-item>
            <el-form-item
              :label="`${$t('table.title')}(zh_tw)`"
              style="width: 100%"
              prop="title_tw"
              :rules="[
                {
                  required: true,
                  message: $t('table.title') + $t('table.not_empty'),
                },
              ]"
            >
              <el-input
                v-model="proxyForm.title_tw"
                :autosize="{ minRows: 1, maxRows: 3 }"
                type="textarea"
                maxlength="50"
                show-word-limit
                :placeholder="$t('other.pls_input')"
              />
            </el-form-item>
            <el-form-item
              :label="`${$t('table.title')}(English)`"
              :rules="[
                {
                  required: true,
                  message: $t('table.title') + $t('table.not_empty'),
                },
              ]"
              style="width: 100%"
              prop="title_en"
            >
              <el-input
                v-model="proxyForm.title_en"
                :autosize="{ minRows: 1, maxRows: 3 }"
                type="textarea"
                :placeholder="$t('other.pls_input')"
              />
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item :label="$t('table.announce_target')" prop="target">
              <el-select
                v-model="proxyForm.target"
                style="width: 220px"
                :placeholder="$t('table.to-select')"
                popper-class="user-select"
              >
                <el-option
                  v-for="game in announcementTargetOption"
                  :key="game.value"
                  :label="game.label"
                  :value="game.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('table.game_id')"
              prop="game_id"
              :rules="[
                {
                  required: true,
                  message: $t('table.game_id') + $t('table.not_empty'),
                },
              ]"
            >
              <el-input
                v-model.number="proxyForm.game_id"
                type="number"
                style="width: 220px"
                :placeholder="$t('other.pls_input')"
              />
            </el-form-item>
          </template>
          <el-form-item
            :label="`${$t('table.content')}(zh_cn)`"
            style="width: 100%"
            prop="content_cn"
            :rules="[
              {
                required: true,
                message: $t('table.content') + $t('table.not_empty'),
              },
            ]"
          >
            <!-- <div
              v-if="+proxyForm.purpose !== 9"
              style="font-size: 12px; color: red"
            >
              {{ $t("table.announce_content_pls") }}
            </div> -->
            <el-input
              v-model="proxyForm.content_cn"
              :autosize="{ minRows: 3, maxRows: 6 }"
              type="textarea"
              :placeholder="$t('other.pls_input')"
            />
          </el-form-item>
          <el-form-item
            :label="`${$t('table.content')}(zh_tw)`"
            style="width: 100%"
            prop="content_tw"
            :rules="[
              {
                required: true,
                message: $t('table.content') + $t('table.not_empty'),
              },
            ]"
          >
            <!-- <div
              v-if="+proxyForm.purpose !== 9"
              style="font-size: 12px; color: red"
            >
              {{ $t("table.announce_content_pls") }}
            </div> -->
            <el-input
              v-model="proxyForm.content_tw"
              :autosize="{ minRows: 3, maxRows: 6 }"
              type="textarea"
              :placeholder="$t('other.pls_input')"
            />
          </el-form-item>
          <el-form-item
            :label="`${$t('table.content')}(English)`"
            style="width: 100%"
            prop="content_en"
            :rules="[
              {
                required: true,
                message: $t('table.content') + $t('table.not_empty'),
              },
            ]"
          >
            <!-- <div
              v-if="+proxyForm.purpose !== 9"
              style="font-size: 12px; color: red"
            >
              {{ $t("table.announce_content_pls") }}
            </div> -->
            <el-input
              v-model="proxyForm.content_en"
              :autosize="{ minRows: 3, maxRows: 6 }"
              type="textarea"
              :placeholder="$t('other.pls_input')"
            />
          </el-form-item>
          <!-- <el-form-item :label="$t('table.sort')" prop="sort">
            <el-input-number
              v-model="proxyForm.sort"
              :placeholder="$t('table.sort')"
              style="width: 200px"
            />
          </el-form-item> -->
          <el-form-item :label="$t('table.display_site')" prop="show_type_arr">
            <el-checkbox-group v-model="proxyForm.show_type_arr">
              <el-checkbox-button
                v-for="item in announcementDisplayOption"
                :key="item.value"
                :label="item.value"
              >
                {{ item.label }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="$t('table.status')" prop="status">
            <el-radio-group v-model="proxyForm.status">
              <el-radio
                v-for="item in announcementStatusOption"
                :key="item.value"
                :label="item.value"
                border
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
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
.text-center {
  text-align: center;
}
</style>
