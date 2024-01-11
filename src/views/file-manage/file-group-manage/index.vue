<route lang="yaml">
name: fileGroupManage
meta:
  title: 分组管理
  constant: false
  layout: true
</route>

<script lang="ts" setup>
import { Plus, Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/file-manage/file-group-manage'
import { dictionary } from '@/hooks/lib'
import { parseTime } from '@/utils/formatTime'
import { i18n } from '@/i18n'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('other.group'),
  crudOptShow: {
    add: true,
    formSize: '80%',
  },
  defaultQuery: {
    group_name: null,
    group_desc: null,
    is_disable: -1,
    group_id: null,
    start_time: null,
    end_time: null,
  },
  crudMethod: { ...Api },
  defaultForm: {
    group_name: null,
    group_desc: null,
    is_disable: 0,
    group_id: null,
    group_sort: 1,
  },
  formKey: 'group_id',
  crudTag: 'file:group:',
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
} = CRUD(defaultCrudOptions)

const { isDisableOptions } = dictionary()

const router = useRouter()

function toPath(row: any) {
  router.push({
    name: 'uploadConfig',
    query: { group_id: row.group_id, group_name: row.group_name },
  })
}
</script>

<template>
  <PageMain :title="$t('router.group-manage')" :has-tool="true" :has-footer="true">
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.group_name')">
          <el-input
            v-model="crudQuery.group_name"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.group_desc')">
          <el-input
            v-model="crudQuery.group_desc"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.is_disable')">
          <el-select
            v-model="crudQuery.is_disable"
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in isDisableOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
        row-key="role_id"
        style="width: 100%; height: 100%"
        border
        table-layout="fixed"
      >
        <el-table-column
          prop="group_name"
          :label="$t('table.group_name')"
          min-width="140"
          align="center"
        />
        <el-table-column
          prop="group_desc"
          :label="$t('table.group_desc')"
          min-width="160"
          align="center"
        />
        <el-table-column
          prop="is_disable"
          :label="$t('table.is_disable')"
          min-width="140"
          align="center"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.group_name"
              :init-value="scope.row.is_disable"
              :options="isDisableOptions"
              :default-param="{
                ids: [scope.row.group_id],
                is_disable: scope.row.is_disable,
              }"
              param-key="is_disable"
              :change-fun="changeStatus"
              emit-fun-name="isDisable"
              :permission="tablePermission.is_disable"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          :label="$t('table.create_time')"
          min-width="160"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.create_time">
              {{
                parseTime(scope.row.create_time)
              }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="update_time"
          :label="$t('table.update_time')"
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
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.del"
                      type="danger"
                      size="small"
                      @click="toDel({ ids: [scope.row.group_id] })"
                    >
                      {{ $t("crud.delete") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.uploadConfig"
                      type="danger"
                      size="small"
                      @click="toPath(scope.row)"
                    >
                      {{ $t("router.upload-config") }}
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
            :label="$t('table.group_name')"
            prop="group_name"
            :rules="[
              {
                required: true,
                message: $t('table.group_name') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.group_name"
              :placeholder="$t('table.group_name')"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.group_desc')" prop="group_desc">
            <el-input
              v-model="proxyForm.group_desc"
              :placeholder="$t('table.group_desc')"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.sort')" prop="group_sort">
            <el-input-number
              v-model="proxyForm.group_sort"
              style="width: 200px"
              :step="1"
              :min="0"
              step-strictly
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="resetCrudStatus">{{
              $t("crud.cancel")
            }}</el-button>
            <el-button type="primary" @click="submitHandle">
              {{ $t("crud.sure") }}
            </el-button>
          </span>
        </template>
      </el-dialog>
    </template>
  </PageMain>
</template>

<style lang="scss" scoped></style>
