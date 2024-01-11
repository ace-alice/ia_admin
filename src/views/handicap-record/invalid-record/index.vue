<route lang="yaml">
name: invalidRecord
meta:
  title: 作废记录列表
  constant: false
  layout: true
</route>

<script lang="ts" setup name="invalidRecord">
import { RefreshRight, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { otherPermission } from './hooks/permission'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/handicap-record/invalid-record'
import { parseTime } from '@/utils/formatTime'
import { dictionary } from '@/hooks/lib'
import { getLabel } from '@/utils'

const i18n = useI18n()

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.t('router.invalid-record'),
  crudOptShow: {
    add: true,
    formSize: '800px',
  },
  defaultQuery: {
    abort_id: null,
    abort_type: null,
    applier: null,
    reviewer: null,
    apply_time_start: null,
    apply_time_end: null,
    confirm_time_start: null,
    confirm_time_end: null,
  },
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'invalid:record:',
}

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  reQuery,
  crudSetQueryKey,
} = CRUD(defaultCrudOptions)

const { abortTypeOptions } = dictionary()

const router = useRouter()

function toSeeDetail(row: any) {
  const form: any = { name: 'betList', query: { is_cancel: 1 } }
  if (+row.type === 2) {
    form.query.play_id = row.abort_id
  }
  else {
    form.query.project = row.abort_id
  }
  router.push(form)
}
</script>

<template>
  <PageMain
    :title="$t('router.invalid-record')"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.id')">
          <el-input
            v-model="crudQuery.abort_id"
            type="number"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.apply_type')">
          <el-select
            v-model="crudQuery.abort_type"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="audit in abortTypeOptions"
              :key="audit.value"
              :label="audit.label"
              :value="audit.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.apply_user')">
          <el-input
            v-model="crudQuery.applier"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.apply_time')">
          <dateTimePickerQuery
            start-key="apply_time_start"
            end-key="apply_time_end"
            :prop-time="[crudQuery.apply_time_start, crudQuery.apply_time_end]"
            @set-time="crudSetQueryKey"
          />
        </el-form-item>
        <el-form-item :label="$t('table.audit_user')">
          <el-input
            v-model="crudQuery.reviewer"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.audit_time')">
          <dateTimePickerQuery
            start-key="confirm_time_start"
            end-key="confirm_time_end"
            :prop-time="[crudQuery.confirm_time_start, crudQuery.confirm_time_end]"
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
    <template #pageBody>
      <el-table
        ref="tableRef"
        v-loading="queryLoading"
        :data="crudData"
        stripe
        row-key="id"
        style="width: 100%"
        height="100%"
        border
        resizable
      >
        <el-table-column
          prop="abort_id"
          :label="$t('table.abort_id')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="type"
          :label="$t('table.apply_type')"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <el-tag :type="+scope.row.type === 1 ? 'warning' : 'danger'">
              {{
                getLabel(scope.row.type, abortTypeOptions)
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="applier_name"
          :label="$t('table.apply_user')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="create_time"
          :label="$t('table.apply_time')"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.apply_time">{{
              parseTime(scope.row.apply_time)
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="reason"
          :label="$t('table.invalid-reason')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="reviewer"
          :label="$t('table.audit_user')"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.reviewer">
              {{ scope.row.reviewer }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="confirm_time"
          :label="$t('table.audit_time')"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.confirm_time">{{
              parseTime(scope.row.confirm_time)
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          :label="$t('table.operate')"
          min-width="180"
          fixed="right"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="info"
              size="small"
              @click="toSeeDetail(scope.row)"
            >
              {{ $t('crud.view_bet') }}
            </el-button>
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
  </PageMain>
</template>

<style lang="scss" scoped></style>
