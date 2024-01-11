<route lang="yaml">
name: betVoidReview
meta:
  title: 注单作废审核
  constant: false
  layout: true
</route>

<script lang="ts" setup name="betVoidReview">
import { ArrowDown, RefreshRight, Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { ElMessageBox, ElNotification } from 'element-plus'
import { otherPermission } from './hooks/permission'
import VoidDetails from './components/Details.vue'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api, { verifyApi } from '@/api/bet-manage/bet-void-review'
import { parseTime } from '@/utils/formatTime'
import { dictionary } from '@/hooks/lib'
import { getLabel } from '@/utils'

const i18n = useI18n()

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.t('router.bet-void-review'),
  crudOptShow: {
    add: true,
    formSize: '800px',
  },
  defaultQuery: {
    status: 0,
    start_time: null,
    end_time: null,
  },
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'bet:void:review',
}

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  crudSetQueryKey,
  reQuery,
  crudFindRole,
} = CRUD(defaultCrudOptions)

const { auditStatusOptions } = dictionary()

const selectionArr = ref<any[]>([])

function handleSelectionChange(selection: any[]) {
  selectionArr.value = selection.map((sele: any) => sele.id)
}

function toReview(status: 1 | 2, id: string) {
  ElMessageBox.confirm(
    status === 1
      ? `${i18n.t('lib.audit_passed')}?`
      : `${i18n.t('lib.audit_reject')}?`,
    i18n.t('user.logOutTitle'),
    {
      confirmButtonText: i18n.t('crud.submit'),
      cancelButtonText: i18n.t('crud.cancel'),
      type: 'warning',
    },
  ).then(() => {
    verifyApi({ status, id }).then((res: any) => {
      if (+res.code === 1) {
        ElNotification.success(i18n.t('crud.BaseHandlesuccessfully'))
        refresh()
      }
    })
  })
}

function toBatchOperate(code: 'status1' | 'status2') {
  if (code === 'status1') {
    toReview(1, selectionArr.value.join(','))
  }
  else {
    toReview(2, selectionArr.value.join(','))
  }
}

const { proxy }: any = getCurrentInstance()

function toSeeDetails(id: number | string) {
  proxy.mittBus.emit('seeVoidDetailsBus', String(id))
}
</script>

<template>
  <PageMain
    :title="$t('router.bet-void-review')"
    :has-tool="false"
    :has-footer="true"
  >
    <template #other>
      <VoidDetails />
    </template>
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.audit_status')">
          <el-select
            v-model="crudQuery.status"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="audit in auditStatusOptions"
              :key="audit.value"
              :label="audit.label"
              :value="audit.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('lib.abort_apply_time')">
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="(row) => +row.status === 0"
        />
        <el-table-column
          prop="cancel_name"
          :label="$t('table.see_details')"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <el-button size="small" type="info" @click="toSeeDetails(scope.row.id)">
              {{ $t("table.see_details") }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="cancel_name"
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
            <span v-if="scope.row.create_time">{{
              parseTime(scope.row.create_time)
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
          prop="status"
          :label="$t('table.audit_status')"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <el-tag
              :type="
                +scope.row.status === 2
                  ? 'danger'
                  : +scope.row.status === 1
                    ? 'success'
                    : 'info'
              "
            >
              {{ getLabel(scope.row.status, auditStatusOptions) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="check_user"
          :label="$t('table.audit_user')"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.check_name">
              {{ scope.row.check_name }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="update_time"
          :label="$t('table.audit_time')"
          min-width="150"
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
          prop=""
          :label="$t('table.operate')"
          min-width="180"
          fixed="right"
          align="center"
        >
          <template #default="scope">
            <el-button
              v-if="
                +scope.row.status === 0
                  && crudFindRole.only(otherPermission.edit)
              "
              type="primary"
              size="small"
              @click="toReview(1, String(scope.row.id))"
            >
              {{ getLabel(1, auditStatusOptions) }}
            </el-button>
            <el-button
              v-if="
                +scope.row.status === 0
                  && crudFindRole.only(otherPermission.edit)
              "
              type="danger"
              size="small"
              @click="toReview(2, String(scope.row.id))"
            >
              {{ getLabel(2, auditStatusOptions) }}
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
      <el-dropdown
        v-if="crudFindRole.only(otherPermission.edit)"
        popper-class="batch-operation"
        @command="toBatchOperate"
      >
        <el-button type="primary">
          {{ $t("crud.batch_operation" /**批量操作 */) }}
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              command="status1"
              :disabled="selectionArr.length === 0"
            >
              {{ getLabel(1, auditStatusOptions) }}
            </el-dropdown-item>
            <el-dropdown-item
              command="status2"
              :disabled="selectionArr.length === 0"
            >
              {{ getLabel(2, auditStatusOptions) }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </PageMain>
</template>

<style lang="scss" scoped></style>
