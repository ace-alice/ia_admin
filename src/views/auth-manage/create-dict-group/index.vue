<route lang="yaml">
name: createDictGroup
meta:
  title: 创建字典组
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
import PageMain from '@/components/PageMain/index.vue'
import PromiseSwitch from '@/components/PromiseSwitch/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/auth-manage/create-dict-group'
import visibleColumn from '@/hooks/visibleColumn'
import { dictionary } from '@/hooks/lib'
import { i18n } from '@/i18n'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('other.dic_group'),
  crudOptShow: {
    add: true,
    formSize: '50%',
  },
  defaultQuery: {},
  crudMethod: { ...Api },
  defaultForm: {
    name: null,
    key: null,
    comment: null,
  },
  crudTag: 'dict-group:config:',
}

const {
  crudQuery,
  crudData,
  crudPage,
  proxyForm,
  crudStatus,
  dialogVisible,
  crudOptShow,
  refresh,
  toQuery,
  queryLoading,
  crudDefaultFormRef,
  crudSetQueryKey,
  resetCrudStatus,
  changeStatus,
  submitHandle,
  reQuery,
  toAdd,
  toEdit,
  toDel,
} = CRUD(defaultCrudOptions)

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()
const { enableOption } = dictionary()
const dictOp: any = ref([])

const getDicOp = () => {
  Api.getDictGroup().then((res: any) => {
    if (res && res.code === 1) {
      dictOp.value = res.data
    }
    else {
      dictOp.value = []
    }
  })
}
onMounted(() => {
  getDicOp()
})
</script>

<template>
  <PageMain
    :title="$t('router.create-dict-group')"
    :has-tool="true"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.dict_name' /**字典组名称 */)">
          <el-select
            v-model="crudQuery.operate_module"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in dictOp"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.operator_time' /**操作时间 */)">
          <dateTimePickerQuery
            start-key="create_time_start"
            end-key="create_time_end"
            :prop-time="[
              crudQuery.create_time_start,
              crudQuery.create_time_end,
            ]"
            @set-time="crudSetQueryKey"
          />
        </el-form-item>
        <el-form-item :label="$t('crud.create_uname' /**操作用户名 */)">
          <el-input v-model="crudQuery.create_username" />
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
        table-layout="fixed"
      >
        <el-table-column
          v-if="getColumnShow('name')"
          prop="name"
          :label="$t('table.dict_name' /**字典组名称 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('comment')"
          prop="comment"
          :label="$t('table.remark' /**备注 */)"
          min-width="130"
          align="center"
        />

        <el-table-column
          v-if="getColumnShow('create_username')"
          prop="create_username"
          :label="$t('table.create_name' /**创建人 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('status')"
          prop="status"
          :label="$t('table.status')"
          width="150"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.id"
              :init-value="scope.row.status"
              :options="enableOption"
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
          :label="$t('table.operate')"
          min-width="120"
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
                      @click="toDel({ id: scope.row.id })"
                    >
                      {{ $t("crud.delete") }}
                    </el-button>
                  </el-dropdown-item>
                </template>
              </el-dropdown>
            </span>
          </template>
        </el-table-column>
      </el-table>
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
            :label="$t('table.dict_name' /**字典组名称 */)"
            prop="name"
            :rules="[
              {
                required: true,
                message: $t('table.dict_name') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.name"
              :placeholder="$t('other.pls_input')"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.keyValue' /**key值 */)"
            prop="key"
            :rules="[
              {
                required: true,
                message: $t('table.keyValue') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.key"
              :placeholder="$t('other.pls_input')"
              :disabled="crudStatus.edit === 1"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.remark' /**字典组名称 */)"
            prop="comment"
            :rules="[
              {
                required: true,
                message: $t('table.remark') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.comment"
              :placeholder="$t('other.pls_input')"
              style="width: 200px"
              clearable
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
