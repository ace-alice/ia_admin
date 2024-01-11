<route lang="yaml">
name: fileRecover
meta:
  title: 文件回收站
  constant: false
  layout: true
</route>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElNotification } from 'element-plus'
import { dictionary } from '@/hooks/lib'
import { getFileGroupListHook } from '@/hooks/getFileGroupList'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/file-manage/recover'
import { dateTimePickerQuery } from '@/components/dateComponents'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '文件回收站',
  crudOptShow: {
    add: true,
    formSize: '80%',
  },
  defaultQuery: {
    file_ext: null,
    file_hash: null,
    file_md5: null,
    file_name: null,
    file_id: null,
    start_time: null,
    end_time: null,
    group_id: null,
    file_type: null,
    is_front: null,
    is_disable: -1,
    storage: null,
  },
  formKey: 'file_id',
  crudMethod: { ...Api },
  crudTag: 'file:recover:',
}

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  toEdit,
  toDel,
  crudHook,
  crudSetQueryKey,
} = CRUD(defaultCrudOptions)

const file_type: any = reactive({})

const { fileGroupList } = getFileGroupListHook()

const fileTypeList = computed(() => {
  const result: any[] = []
  if (Object.keys(file_type).length > 0) {
    for (const keyL of Object.keys(file_type)) {
      result.push({ label: (file_type as any)[keyL], value: keyL })
    }
  }
  return result
})

crudHook.afterRefresh = (form: any) => {
  Object.assign(file_type, form.filetype)
  return true
}

const dialogVisible = ref(false)

const { isDisableOptions, isNot, getLabel } = dictionary()

function toRecover(row: any) {
  Api.recoverReco({ ids: [row.file_id] }).then((res: any) => {
    if (res.code !== 1) {
      ElMessage.error(res.msg)
    }
    else {
      ElNotification.success(res.message || res.msg)
      refresh()
    }
  })
}

const otherPermission = {
  // 是否可以需改需要权限验证
  del: 'file:recover:del',
  reco: 'file:recover:reco',
}
</script>

<template>
  <PageMain :title="$t('router.file-recycle')" :has-tool="false" :has-footer="true">
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.file_ext')">
          <el-input
            v-model="crudQuery.file_ext"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.file_name')">
          <el-input
            v-model="crudQuery.file_name"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.group_name')">
          <el-select
            v-model="crudQuery.group_id"
            style="width: 200px"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in fileGroupList"
              :key="item.group_id"
              :label="item.group_name"
              :value="item.group_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.file_type')">
          <el-select
            v-model="crudQuery.file_type"
            style="width: 200px"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in fileTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
        <el-form-item :label="$t('table.is_front')">
          <el-select
            v-model="crudQuery.is_front"
            style="width: 200px"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in isNot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
          prop="file_name"
          :label="$t('table.file_name')"
          min-width="140"
          align="center"
        >
          <template #default="scope">
            {{ scope.row.file_name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="file_id"
          :label="$t('table.file_id')"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="per_domain"
          :label="$t('table.per_domain')"
          min-width="200"
          align="center"
        >
          <template #default="scope">
            {{ scope.row.domain }}
          </template>
        </el-table-column>
        <el-table-column
          prop="group_id"
          :label="$t('table.group_name')"
          min-width="160"
          align="center"
        >
          <template #default="scope">
            <el-select
              v-model="scope.row.group_id"
              style="width: 120px"
              popper-class="user-select"
              :disabled="true"
            >
              <el-option
                v-for="item in fileGroupList"
                :key="item.group_id"
                :label="item.group_name"
                :value="item.group_id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="file_type"
          :label="$t('table.file_type')"
          min-width="160"
          align="center"
        />
        <el-table-column
          prop="is_front"
          :label="$t('table.is_front')"
          min-width="160"
          align="center"
        >
          <template #default="scope">
            {{ getLabel(scope.row.is_front, isNot) }}
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
                      v-only="otherPermission.del"
                      type="danger"
                      size="small"
                      @click="toDel({ ids: [scope.row.file_id] })"
                    >
                      {{ $t("crud.delete") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.reco"
                      type="danger"
                      size="small"
                      @click="toRecover(scope.row)"
                    >
                      {{ $t("router.recover") }}
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
  </PageMain>
</template>

<style lang="scss" scoped></style>
