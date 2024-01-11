<route lang="yaml">
name: fileGroupManage
meta:
  title: 下载中心
  constant: false
  layout: true
</route>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/file-manage/report-export'
import { dateTimePickerQuery } from '@/components/dateComponents'
import { parseTime } from '@/utils/formatTime'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '下载中心',
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
  crudTag: 'menu:config:',
}

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  crudSetQueryKey,
} = CRUD(defaultCrudOptions)

const router = useRouter()
</script>

<template>
  <PageMain :title="$t('router.download-center')" :has-tool="true" :has-footer="true">
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.file_name')">
          <el-input
            v-model="crudQuery.file_name"
            clearable
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
      </el-form>
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
          prop="filename"
          :label="$t('table.file_name')"
          min-width="100"
          align="center"
        >
          <template #default="scope">
            <a
              style="cursor: pointer"
              class="download-link"
              :href="scope.row.filepath"
              target="_blank"
            >{{ scope.row.filename }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          :label="$t('table.create_time')"
          min-width="100"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.create_time">{{ parseTime(scope.row.create_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="admin_name"
          :label="$t('table.create_name')"
          min-width="100"
          align="center"
        />
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
