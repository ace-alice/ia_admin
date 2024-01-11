<route lang="yaml">
name: fileGroupManage
meta:
  title: 文件列表
  constant: false
  layout: true
</route>

<script lang="ts" setup>
import { CopyDocument, Edit, Plus, Search } from '@element-plus/icons-vue'
import type { UploadInstance } from 'element-plus'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import { i18n } from '@/i18n'
import wcsUpload from '@/service/wcs'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/file-manage/file-config'
import { dictionary } from '@/hooks/lib'
import { getFileGroupListHook } from '@/hooks/getFileGroupList'
import PromiseSwitch from '@/components/PromiseSwitch/index.vue'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.file-list'),
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
  crudMethod: { ...Api },
  defaultForm: {
    file_id: null,
    group_id: 1,
    file_type: 'other',
    file_name: '',
    is_front: 0,
    sort: 1,
  },
  formKey: 'file_id',
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
  crudHook,
  crudFindRole,
  crudSetQueryKey,
} = CRUD(defaultCrudOptions)

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()

const { isDisableOptions, isNot } = dictionary()

const { fileGroupList } = getFileGroupListHook()

const storage: any = reactive({})

const file_type: any = reactive({})

const storageList = computed(() => {
  const result: any[] = []
  if (Object.keys(storage).length > 0) {
    for (const keyL of Object.keys(storage)) {
      result.push({ label: (storage as any)[keyL], value: keyL })
    }
  }
  return result
})

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
  Object.assign(storage, form.storage)
  Object.assign(file_type, form.filetype)
  return true
}

const { toUpload } = wcsUpload()

const uploadRef = ref<UploadInstance>()

// 上传前回调
async function beforeImageUpload(file: any) {
  const tempName = file.name.substring(file.name.lastIndexOf('.') + 1)
  const fileName = `image${new Date().getTime()}_${file.size}.${tempName}`
  const isSuccess = await toUpload(file, fileName, file.type)
  if (isSuccess) {
    proxyForm.file_name = fileName
  }
  else {
    uploadRef.value && uploadRef.value.clearFiles()
  }
  return false
}

function editFile(form: any) {
  Api.edit(form)
    .then((res: any) => {
      if (res.code === 1) {
        ElNotification.success(res.msg || res.message)
        refresh()
      }
      else {
        ElMessage.error(res.msg || res.message)
      }
    })
    .finally(() => {
      refresh()
    })
}

const editFileFunc = (
  row: any,
  keyL: string,
  type = 'text',
  pattern: any = /^.+$/,
) => {
  ElMessageBox.prompt('', '输入内容', {
    confirmButtonText: '修改',
    cancelButtonText: '放弃',
    inputPattern: pattern,
    inputErrorMessage: '输入内容不能为空',
    inputType: type,
  })
    .then(async ({ value }: any) => {
      await editFile(Object.assign(row, { [keyL]: value }))
    })
    .catch(() => {
      ElMessage.info('放弃')
    })
}
</script>

<template>
  <PageMain :title="$t('router.file-list')" :has-tool="true" :has-footer="true">
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
        <el-form-item :label="$t('table.storage')">
          <el-select
            v-model="crudQuery.storage"
            style="width: 200px"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in storageList"
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
        row-key="role_id"
        style="width: 100%; height: 100%"
        border
        :header-cell-style="filterHeaderColumn"
        table-layout="fixed"
      >
        <el-table-column
          v-if="getColumnShow('sort')"
          prop="sort"
          :label="$t('table.sort')"
          min-width="140"
          align="center"
        >
          <template #default="scope">
            {{ scope.row.sort }}
            <el-button
              link
              :disabled="!crudFindRole.only(otherPermission.edit)"
              @click="editFileFunc(scope.row, 'sort', 'number')"
            >
              <el-icon><Edit /></el-icon>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('file_name')"
          prop="file_name"
          :label="$t('table.file_name')"
          min-width="140"
          align="center"
        >
          <template #default="scope">
            <a
              class="download-link"
              :href="scope.row.file_url"
              target="_blank"
            >{{ scope.row.file_name }}</a>
            <Clipboard class="Clipboard" :content="scope.row.file_url">
              <template #label>
                <el-icon><CopyDocument /></el-icon>
              </template>
            </Clipboard>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('file_id')"
          prop="file_id"
          :label="$t('table.file_id')"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="file_url"
          label="图片预览"
          min-width="120"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.file_type !== 'image'">--</span>
            <el-image
              v-if="scope.row.file_type === 'image'"
              style="width: 60px; height: 60px"
              :src="scope.row.file_url"
              fit="contain"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('per_domain')"
          prop="per_domain"
          :label="$t('table.per_domain')"
          min-width="200"
          align="center"
        >
          <template #default="scope">
            {{ scope.row.domain }}
            <el-button
              link
              :disabled="!crudFindRole.only(tablePermission.editDomain)"
              @click="editFileFunc(scope.row, 'domain')"
            >
              <el-icon><Edit /></el-icon>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('group_id')"
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
              :disabled="!crudFindRole.only(tablePermission.editGroup)"
              @change="editFile(scope.row)"
            >
              <el-option
                v-for="item in fileGroupList"
                :key="item.group_id"
                :label="item.group_name"
                :value="Number(item.group_id)"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('file_type')"
          prop="file_type"
          :label="$t('table.file_type')"
          min-width="160"
          align="center"
        >
          <template #default="scope">
            <el-select
              v-model="scope.row.file_type"
              style="width: 120px"
              popper-class="user-select"
              :disabled="!crudFindRole.only(tablePermission.editType)"
              @change="editFile(scope.row)"
            >
              <el-option
                v-for="item in fileTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('is_disable')"
          prop="is_disable"
          :label="$t('table.is_disable')"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.file_id"
              :init-value="scope.row.is_disable"
              :options="isDisableOptions"
              :default-param="{
                ids: [scope.row.file_id],
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
          v-if="getColumnShow('is_front')"
          prop="is_front"
          :label="$t('table.is_front')"
          min-width="160"
          align="center"
        >
          <template #default="scope">
            <el-select
              v-model="scope.row.is_front"
              style="width: 120px"
              popper-class="user-select"
              :disabled="!crudFindRole.only(otherPermission.edit)"
              @change="editFile(scope.row)"
            >
              <el-option
                v-for="item in isNot"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
                      @click="toDel({ ids: [scope.row.file_id] })"
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
          <el-form-item :label="$t('table.file_name')" prop="file_name">
            <el-input
              v-model="proxyForm.file_name"
              :placeholder="$t('table.file_name')"
              style="width: 200px"
              disabled
            />
          </el-form-item>
          <el-form-item :label="$t('table.file_type')">
            <el-select
              v-model="proxyForm.file_type"
              style="width: 200px"
              popper-class="user-select"
            >
              <el-option
                v-for="item in fileTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.is_front')">
            <el-select
              v-model="proxyForm.is_front"
              style="width: 200px"
              popper-class="user-select"
            >
              <el-option
                v-for="item in isNot"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.sort')" prop="sort">
            <el-input-number
              v-model="proxyForm.sort"
              style="width: 200px"
              :step="1"
              :min="0"
              step-strictly
            />
          </el-form-item>
          <el-form-item :label="$t('table.group_name')" prop="group_id">
            <el-select
              v-model="proxyForm.group_id"
              style="width: 200px"
              popper-class="user-select"
            >
              <el-option
                v-for="item in fileGroupList"
                :key="item.group_id"
                :label="item.group_name"
                :value="item.group_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.file')">
            <el-upload
              ref="uploadRef"
              class="upload-demo"
              drag
              :limit="1"
              name="file"
              :before-upload="beforeImageUpload"
            >
              <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
              </div>
            </el-upload>
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
