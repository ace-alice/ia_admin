<route lang="yaml">
name: createDict
meta:
  title: 创建字典
  constant: false
  layout: true
</route>

<script lang="ts" setup name="eventManage">
import { Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import { otherPermission, toolPermission } from './hooks/permission'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/auth-manage/create-dict'
import visibleColumn from '@/hooks/visibleColumn'
import { getLabel } from '@/utils'
import { i18n } from '@/i18n'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('table.dictionary'),
  crudOptShow: {
    add: true,
    formSize: '50%',
  },
  defaultQuery: {},
  crudMethod: { ...Api },
  defaultForm: {
    group_array: [],
    group_id: null,
    value: null,
    content_cn: null,
    content_en: null,
    content_tw: null,
    content_th: null,
    content_vn: null,
    content_in: null,
    content_jp: null,
    content_kr: null,
  },
  crudTag: 'dict:config:',
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
  submitHandle,
  reQuery,
  toAdd,
  toEdit,
  toDel,
} = CRUD(defaultCrudOptions)

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()
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
    :title="$t('router.create-dict')"
    :has-tool="true"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.dict_name' /**字典组名称 */)">
          <el-select
            v-model="crudQuery.group_id"
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
          v-if="getColumnShow('group_id')"
          prop="group_id"
          :label="$t('table.dict_name' /**字典组名称 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            {{ getLabel(scope.row.group_id || "--", dictOp, "id", "name") }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('content_cn')"
          prop="content_cn"
          :label="$t('table.dict_cn' /**字段名称(简体中文) */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('content_tw')"
          prop="content_tw"
          :label="$t('table.dict_tw' /**字段名称(繁体中文) */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('content_en')"
          prop="content_en"
          :label="$t('table.dict_en' /**字段名称(英文)*/)"
          min-width="130"
          align="center"
        />

        <el-table-column
          v-if="getColumnShow('content_th')"
          prop="content_th"
          :label="$t('table.dict_th' /**字段名称(泰语)*/)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('content_vn')"
          prop="content_vn"
          :label="$t('table.dict_vn' /**字段名称(越南语) */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('content_in')"
          prop="content_in"
          :label="$t('table.dict_in' /**字段名称(印尼语) */)"
          min-width="130"
          align="center"
        />

        <el-table-column
          v-if="getColumnShow('dict_jp')"
          prop="content_jp"
          :label="$t('table.dict_jp' /**字段名称(日语) */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('content_kr')"
          prop="content_kr"
          :label="$t('table.dict_kr' /**字段名称(韩语) */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('create_username')"
          prop="create_username"
          :label="$t('table.create_name' /**创建人*/)"
          min-width="130"
          align="center"
        />
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
            v-if="crudStatus.add === 1"
            :label="$t('table.dict_name' /**字典组名称 */)"
            prop="group_array"
            :rules="[
              {
                required: true,
                message: $t('table.dict_name') + $t('table.not_empty'),
              },
            ]"
          >
            <el-select
              v-model="proxyForm.group_array"
              multiple
              value-key="id"
              collapse-tags
              collapse-tags-tooltip
              style="width: 200px"
              popper-class="user-select"
              :placeholder="$t('lib.all')"
            >
              <el-option
                v-for="item in dictOp"
                :key="item.id"
                :label="item.name"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="crudStatus.edit === 1"
            :label="$t('table.dict_name' /**字典组名称 */)"
            prop="group_id"
            :rules="[
              {
                required: true,
                message: $t('table.dict_name') + $t('table.not_empty'),
              },
            ]"
          >
            <el-select
              v-model="proxyForm.group_id"
              style="width: 200px"
              popper-class="user-select"
              :placeholder="$t('lib.all')"
            >
              <el-option
                v-for="item in dictOp"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.dict_id')">
            <el-input
              v-model="proxyForm.value"
              :placeholder="$t('table.dict_id')"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.dict_cn')"
            prop="content_cn"
            :rules="[
              {
                required: true,
                message: $t('table.dict_cn') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.content_cn"
              :placeholder="$t('table.dict_cn')"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.dict_en')"
            prop="content_en"
            :rules="[
              {
                required: true,
                message: $t('table.dict_en') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.content_en"
              :placeholder="$t('table.dict_en')"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.dict_tw')" prop="content_tw">
            <el-input
              v-model="proxyForm.content_tw"
              :placeholder="$t('table.dict_tw')"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.dict_th')" prop="content_th">
            <el-input
              v-model="proxyForm.content_th"
              :placeholder="$t('table.dict_th')"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.dict_vn')" prop="content_vn">
            <el-input
              v-model="proxyForm.content_vn"
              :placeholder="$t('table.dict_vn')"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.dict_in')" prop="content_in">
            <el-input
              v-model="proxyForm.content_in"
              :placeholder="$t('table.dict_in')"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.dict_jp')" prop="content_jp">
            <el-input
              v-model="proxyForm.content_jp"
              :placeholder="$t('table.dict_jp')"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.dict_kr')" prop="content_kr">
            <el-input
              v-model="proxyForm.content_kr"
              :placeholder="$t('table.dict_kr')"
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
