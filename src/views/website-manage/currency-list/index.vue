<route lang="yaml">
name: currencyList
meta:
  title: 币种列表
  constant: false
  layout: true
</route>

<script lang="ts" setup name="currencyList">
import { Edit, Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/website-manage/currency-list'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'
import { i18n } from '@/i18n'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.currency-list'),
  crudOptShow: {
    add: true,
    formSize: '50%',
  },
  defaultQuery: {
    name: null,
  },
  crudMethod: { ...Api },
  defaultForm: {
    name_cn: null,
    name_en: null,
    name_tw: null,
    short_name_cn: null,
    short_name_en: null,
    short_name_tw: null,
    symbol: null,
    exchange_rate: null,
    currency_code: null,
    show_scale: 1,
  },
  crudTag: 'currency:list:',
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

const open = (form: any) => {
  ElMessageBox.prompt(
    `${i18n.global.t('other.current_value')} ${form.value}`,
    i18n.global.t('table.exchange_rate'),
    {
      confirmButtonText: i18n.global.t('crud.sure'),
      cancelButtonText: i18n.global.t('crud.cancel'),
      inputPattern: /^[\+\-]?\d*?\.?\d*?$/,
      inputErrorMessage: '',
    },
  ).then(({ value }) => {
    const { id } = form
    const params = {
      id,
      exchange_rate: value,
    }
    Api.updateExchange(params).then((res: any) => {
      if (res && res.code === 1) {
        ElMessage.success(res.msg)
        setTimeout(() => {
          refresh()
        }, 3000)
      }
    })
  })
}
</script>

<template>
  <PageMain
    :title="$t('router.currency-list')"
    :has-tool="true"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.currency_name')">
          <el-input
            v-model="crudQuery.name"
            :placeholder="$t('table.name')"
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
          :label="$t('table.number')"
          min-width="80"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('name_cn')"
          prop="name_cn"
          :label="$t('table.currency_cn')"
          min-width="80"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('name_en')"
          prop="name_en"
          :label="$t('table.currency_en')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('name_tw')"
          prop="name_tw"
          :label="$t('table.currency_tw')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('short_name_cn')"
          prop="short_name_cn"
          :label="$t('table.cry_cn')"
          min-width="130"
          align="center"
        />

        <el-table-column
          v-if="getColumnShow('short_name_en')"
          prop="short_name_en"
          :label="$t('table.cry_en')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('short_name_tw')"
          prop="short_name_tw"
          :label="$t('table.cry_tw')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('symbol')"
          prop="symbol"
          :label="$t('table.symbol')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('exchange_rate')"
          prop="exchange_rate"
          :label="$t('table.exchange_rate')"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <span style="margin-right: 15px">{{
              scope.row.exchange_rate
            }}</span>
            <el-button
              v-only="otherPermission.exchange"
              type="primary"
              size="small"
              :icon="Edit"
              circle
              @click="
                open({
                  id: scope.row.id,
                  value: scope.row.exchange_rate,
                })
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('currency_code')"
          prop="currency_code"
          :label="$t('table.currency_code')"
          min-width="130"
          align="center"
        />

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
        <el-form
          ref="crudDefaultFormRef"
          :model="proxyForm"
          label-width="160px"
          class="demo-ruleForm"
          inline
        >
          <el-form-item
            :label="$t('table.currency_cn' /**币种名称（中文） */)"
            prop="name_cn"
            :rules="[
              {
                required: true,
                message: $t('table.currency_cn') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.name_cn"
              :placeholder="$t('table.currency_cn')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.currency_en')"
            prop="name_en"
            :rules="[
              {
                required: true,
                message: $t('table.currency_en') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.name_en"
              :placeholder="$t('table.currency_en')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.currency_tw')"
            prop="name_tw"
            :rules="[
              {
                required: true,
                message: $t('table.currency_tw') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.name_tw"
              :placeholder="$t('table.currency_tw')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.cry_cn' /**币种简称（中文） */)"
            prop="short_name_cn"
            :rules="[
              {
                required: true,
                message: $t('table.cry_cn') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.short_name_cn"
              :placeholder="$t('table.cry_cn')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.cry_en')"
            prop="short_name_en"
            :rules="[
              {
                required: true,
                message: $t('table.cry_en') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.short_name_en"
              :placeholder="$t('table.cry_en')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.cry_tw')"
            prop="short_name_tw"
            :rules="[
              {
                required: true,
                message: $t('table.cry_tw') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.short_name_tw"
              :placeholder="$t('table.cry_tw')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.symbol')"
            prop="symbol"
            :rules="[
              {
                required: true,
                message: $t('table.symbol') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.symbol"
              :placeholder="$t('table.symbol')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.exchange_rate')"
            prop="exchange_rate"
            :rules="[
              {
                required: true,
                message: $t('table.exchange_rate') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.exchange_rate"
              :placeholder="$t('table.exchange_rate')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.currency_code')"
            prop="currency_code"
            :rules="[
              {
                required: true,
                message: $t('table.currency_code') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.currency_code"
              :placeholder="$t('table.currency_code')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.display_rate')"
            prop="show_scale"
            :rules="[
              {
                required: true,
                message: $t('table.display_rate') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.show_scale"
              :placeholder="$t('table.display_rate')"
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
      <BindPlay />
      <UploadLogo @refresh="refresh" />
    </template>
  </PageMain>
</template>
