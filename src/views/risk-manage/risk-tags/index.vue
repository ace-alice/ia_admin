<!-- suppress JSUnresolvedVariable -->
<route lang="yaml">
name: RiskTags
meta:
  title: 风控标签
  constant: false
  layout: true
</route>

<script lang="ts" setup name="RiskTags">
import { Plus, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import {
  otherPermission,
  toolPermission,
} from './hooks/permission'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/risk-manage/risk-tags'
const i18n = useI18n()

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.t('router.risk-tags'),
  crudOptShow: {
    add: true,
    formSize: '800px',
  },
  defaultQuery: {},
  crudMethod: { ...Api },
  defaultForm: {
    id: null,
    create_time: null,
    ext_id: null,
    tag_color: null,
    tag_id: null,
    tag_name: null,
    update_time: null,
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
} = CRUD(defaultCrudOptions)

crudHook.beforeToEdit = (form: any) => {
  Object.assign(proxyForm, {
    tag_color: form.tag_color ? `#${form.tag_color}` : null,
    id: form.tag_id,
  })
  return true
}

crudHook.beforeValidateCU = (form: any) => {
  if (form.tag_color) {
    form.tag_color = (form.tag_color as string).substring(1)
  }
  return true
}
</script>

<template>
  <PageMain :title="$t('router.risk-tags')" :has-tool="true" :has-footer="true">
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
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
        row-key="admin_id"
        style="width: 100%; height: 100%"
        border
        resizable
        table-layout="fixed"
      >
        <el-table-column
          prop="tag_id"
          :label="$t('table.number')"
          min-width="60"
          align="center"
        />
        <el-table-column
          prop="tag_name"
          :label="$t('table.risk_tag_name')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="tag_color"
          :label="$t('table.tag_color')"
          min-width="60"
          align="center"
        >
          <template #default="scope">
            <div
              v-if="scope.row.tag_color"
              :style="{
                background: `#${scope.row.tag_color}`,
                height: '16px',
                width: '32px',
                margin: 'auto',
              }"
            />
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
                      @click="toDel({ id: scope.row.tag_id })"
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
            :label="$t('table.risk_tag_name')"
            prop="tag_name"
            :rules="[
              {
                required: true,
                message: $t('table.risk_tag_name') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.tag_name"
              :placeholder="$t('table.risk_tag_name')"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.tag_color')"
            prop="tag_color"
            :rules="[
              {
                required: true,
                message: $t('table.tag_color') + $t('table.not_empty'),
              },
            ]"
          >
            <el-color-picker v-model="proxyForm.tag_color" style="width: 200px" />
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
:deep(.el-color-picker){
  width: 200px;
}
</style>
