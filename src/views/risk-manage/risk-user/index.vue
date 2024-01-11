<!-- suppress JSUnresolvedVariable -->
<route lang="yaml">
name: RiskUser
meta:
  title: 风控会员
  constant: false
  layout: true
</route>

<script lang="ts" setup name="RiskUser">
import { Download, Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { otherPermission, toolPermission } from './hooks/permission'
import RiskUserHistory from './components/RiskUserHistory.vue'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/risk-manage/risk-user'
import { parseTime } from '@/utils/formatTime'
import getCompanyList from '@/hooks/getCompanyList'
import getGameListHook from '@/hooks/getGameListHook'
import { dictionary } from '@/hooks/lib'
import getAllRiskLabelHook from '@/hooks/getAllRiskLabelHook'
const i18n = useI18n()

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.t('router.risk-user'),
  crudOptShow: {
    add: true,
    formSize: '800px',
  },
  defaultQuery: {
    username: null,
    tag_id: null,
    company_id: null,
    add_type: null,
    game_id: null,
    note: null,
    start_time: null,
    end_time: null,
  },
  crudMethod: { ...Api },
  defaultForm: {
    add_type: 1,
    company_id: null,
    game_id: 0,
    company_name: null,
    create_time: null,
    ext: null,
    game_name: null,
    game_type_id: null,
    id: null,
    params_name: null,
    remarks: null,
    tag_color: null,
    tag_ext_id: null,
    tag_id: null,
    tag_name: null,
    type: 0,
    update_name: null,
    update_time: null,
    update_user: null,
    user_id: null,
    username: null,
  },
  crudTag: 'admin:config:',
}

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
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
  crudHook,
  addEditLoading,
  crudSetQueryKey,
  reQuery,
} = CRUD(defaultCrudOptions)

crudHook.beforeToEdit = (form: any) => {
  Object.assign(proxyForm, {
    game_id: form.game_type_id,
    note: form.remarks,
  })
  return true
}

const { companyList } = getCompanyList()
const { allRiskList } = getAllRiskLabelHook()
const { gameList } = getGameListHook(false, false)
const { getLabel, addTypeOptions } = dictionary()
const { proxy }: any = getCurrentInstance()

function toOpenHistory(row: any) {
  proxy.mittBus.emit('getRiskUserHistoryBus', { uid: row.user_id })
}
</script>

<template>
  <PageMain :title="$t('router.risk-user')" :has-tool="true" :has-footer="true">
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.time' /**投注时间 */)">
          <dateTimePickerQuery
            start-key="start_time"
            end-key="end_time"
            :prop-time="[crudQuery.start_time, crudQuery.end_time]"
            @set-time="crudSetQueryKey"
          />
        </el-form-item>
        <el-form-item :label="$t('table.trigger_object')">
          <el-select
            v-model="crudQuery.game_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            filterable
            clearable
          >
            <el-option
              v-for="game in gameList"
              :key="game.id"
              :label="game.game_name"
              :value="game.id"
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
        <el-form-item :label="$t('table.username')" prop="username">
          <el-input
            v-model="crudQuery.username"
            :placeholder="$t('table.username')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.risk_label')">
          <el-select
            v-model="crudQuery.tag_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            filterable
            clearable
          >
            <el-option
              v-for="company in allRiskList"
              :key="company.tag_id"
              :label="company.tag_name"
              :value="company.tag_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.add_type')">
          <el-select
            v-model="crudQuery.add_type"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            filterable
            clearable
          >
            <el-option
              v-for="company in addTypeOptions"
              :key="company.value"
              :label="company.label"
              :value="company.value"
            />
          </el-select>
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
        v-loading="queryLoading"
        :data="crudData"
        stripe
        row-key="id"
        style="width: 100%; height: 100%"
        border
        resizable
        table-layout="fixed"
      >
        <el-table-column
          prop="company_name"
          :label="$t('table.comp_name')"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="username"
          :label="$t('table.username')"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="tag_color"
          :label="$t('table.tag_color')"
          min-width="80"
          align="center"
        >
          <template #default="scope">
            <div
              v-if="scope.row.tag_color"
              :style="{
                background: `#${scope.row.tag_color}`,
                height: '24px',
                width: '64px',
                margin: 'auto',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="tag_name"
          :label="$t('table.risk_tag_name')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="game_id"
          :label="$t('table.trigger_object')"
          min-width="100"
          align="center"
        >
          <template #default="scope">
            <div v-if="scope.row.game_type_id">
              <!-- {{
                getLabel(scope.row.game_type_id, gameList, "id", "game_name")
              }} -->
              {{ scope.row.game_name }}
            </div>
            <div v-else>
              {{ $t("table.all_game") }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="remarks"
          :label="$t('table.remark')"
          min-width="200"
          align="left"
        />
        <el-table-column
          prop="add_type"
          :label="$t('table.add_type')"
          min-width="100"
          align="center"
        >
          <template #default="scope">
            <el-tag>{{ getLabel(+scope.row.add_type, addTypeOptions) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="update_name"
          :label="$t('table.update_people')"
          min-width="100"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.update_name">{{
              scope.row.update_name
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="update_time"
          :label="$t('table.update_time1')"
          min-width="160"
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
          :label="$t('table.operate')"
          min-width="120"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <span v-some="Object.values(otherPermission)">
              <el-dropdown
                placement="bottom-end"
                :hide-on-click="false"
                trigger="click"
              >
                <el-button type="warning" link>
                  {{ $t("table.operate") }}
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
                    <el-button
                      v-only="otherPermission.history"
                      type="primary"
                      size="small"
                      @click="toOpenHistory(scope.row)"
                    >
                      {{ $t("table.risk_history") }}
                    </el-button>
                    <el-button
                      v-only="otherPermission.del"
                      type="danger"
                      size="small"
                      @click="toDel({ id: scope.row.id })"
                    >
                      {{ $t("table.remove_risk") }}
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
      <RiskUserHistory />
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
            :label="$t('table.username')"
            prop="username"
            :rules="[
              {
                required: true,
                message: $t('table.username') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.username"
              :placeholder="$t('table.username')"
              style="width: 200px"
              clearable
              :disabled="!!crudStatus.edit"
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.comp_name' /**所属公司 */)"
            prop="company_id"
            :rules="[
              {
                required: true,
                message: $t('table.comp_name') + $t('table.not_empty'),
              },
            ]"
          >
            <el-select
              v-model="proxyForm.company_id"
              style="width: 200px"
              :placeholder="$t('lib.all')"
              popper-class="user-select"
              filterable
              clearable
              :disabled="!!crudStatus.edit"
            >
              <el-option
                v-for="company in companyList"
                :key="company.id"
                :label="company.company_name"
                :value="company.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.risk_label')">
            <el-select
              v-model="proxyForm.tag_id"
              style="width: 200px"
              :placeholder="$t('lib.all')"
              popper-class="user-select"
              filterable
              clearable
            >
              <el-option
                v-for="company in allRiskList"
                :key="company.tag_id"
                :label="company.tag_name"
                :value="company.tag_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.trigger_object')"
            prop="game_id"
            :rules="[
              {
                required: true,
                message: $t('table.trigger_object') + $t('table.not_empty'),
              },
            ]"
          >
            <el-select
              v-model="proxyForm.game_id"
              style="width: 200px"
              :placeholder="$t('lib.all')"
              popper-class="user-select"
              filterable
              clearable
            >
              <el-option
                :label="$t('table.all_game')"
                :value="0"
              />
              <el-option
                v-for="game in gameList"
                :key="game.id"
                :label="game.game_name"
                :value="game.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.remark')"
            prop="note"
            :rules="[
              {
                required: true,
                message: $t('table.remark') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.note"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              style="width: 550px"
              :placeholder="$t('table.remark')"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button :disabled="addEditLoading" @click="resetCrudStatus">{{
              $t("crud.cancel")
            }}</el-button>
            <el-button
              type="primary"
              :loading="addEditLoading"
              @click="submitHandle"
            >
              {{ $t("crud.sure") }}
            </el-button>
          </span>
        </template>
      </el-dialog>
    </template>
  </PageMain>
</template>

<style lang="scss" scoped>
:deep(.el-color-picker) {
  width: 200px;
}
</style>
