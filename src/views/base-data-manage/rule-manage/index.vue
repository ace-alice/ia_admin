<route lang="yaml">
name: ruleManage
meta:
  title: 玩法规则管理
  constant: false
  layout: true
  </route>

<script lang="ts" setup name="ruleManage">
import { Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import { parseTime } from '@/utils/formatTime'
import { getLabel } from '@/utils'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/match-data-manage/rule-manage'
import { dictionary } from '@/hooks/lib'
import PromiseSwitch from '@/components/PromiseSwitch/index.vue'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'
import { i18n } from '@/i18n'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('table.rule_play'),
  crudOptShow: {
    add: true,
    formSize: '50%',
  },
  defaultQuery: {
    game_name: null,
    is_del: null,
  },
  crudMethod: { ...Api },
  defaultForm: {

  },
  crudTag: 'rule:manage:',
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

const { enableOption } = dictionary()

const typeOption: any = ref([])
const getType = () => {
  Api.getTypeLang().then((res: any) => {
    if (res && res.code === 1) {
      const data = res.data
      Object.keys(data).forEach((k: any, v: any) => {
        const obj = {
          value: Number(k),
          label: data[k],
        }
        typeOption.value.push(obj)
      })
    }
  })
}
onMounted(() => {
  getType()
})
</script>

<template>
  <PageMain :title="$t('router.play-rule-manage')" :has-tool="true" :has-footer="true">
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery">
        <el-form-item :label="$t('table.rule_type' /**规则类型 */)" prop="type">
          <el-select
            v-model="crudQuery.type"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
          >
            <el-option
              v-for="item in typeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.status' /**状态 */)" prop="status">
          <el-select
            v-model="crudQuery.status"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
          >
            <el-option
              v-for="item in enableOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.rule_name' /**玩法规则名称 */)" prop="rule_name">
          <el-input
            v-model="crudQuery.rule_name"
            :placeholder="$t('table.rule_name')"
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
            {{ $t('crud.search') }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="RefreshRight"
            :loading="queryLoading"
            @click="reQuery"
          >
            {{ $t('crud.reset') }}
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
        {{ $t('crud.add') }}
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
          :label="$t('table.id' /**ID */)"
          min-width="80"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('name_cn' /**玩法规则名称 */)"
          prop="name_cn"
          :label="$t('table.rule_name')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('type')"
          prop="type"
          :label="$t('table.rule_type'/**规则类型 */)"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            {{ getLabel(scope.row.type, typeOption) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('status')"
          prop="status"
          :label="$t('table.status' /**状态 */)"
          min-width="150"
          align="center"
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
          v-if="getColumnShow('ext')"
          prop="ext"
          :label="$t('table.expand' /**扩展 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('update_username')"
          prop="update_username"
          :label="$t('table.update_people'/**更新人 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('update_time')"
          prop="update_time"
          :label="$t('table.update_time1' /**更新时间 */)"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.create_time">{{ parseTime(scope.row.create_time) }}</span>
          </template>
        </el-table-column>
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
                  {{ $t('table.operateControl') }}
                </el-button>
                <template #dropdown>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.edit"
                      type="primary"
                      size="small"
                      @click="toEdit(scope.row)"
                    >
                      {{ $t('crud.edit') }}
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
        destroy-on-close
      >
        <el-form
          ref="crudDefaultFormRef"
          :model="proxyForm"
          label-width="160px"
          class="demo-ruleForm"
          inline
        >
          <el-form-item
            :label="$t('table.game_name_cn' /**中文名 */)" prop="name_cn" :rules="[
              {
                required: true,
                message: $t('table.game_name_cn') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.name_cn" :placeholder="$t('table.name_cn')"
              style="width: 60%"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.game_name_en' /**英文名称 */)"
            prop="name_en"
            :rules="[
              {
                required: true,
                message: $t('table.game_name_en') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.name_en"
              :placeholder="$t('table.game_name_en')"
              style="width: 60%"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.rule_type' /**规则类型 */)"
            prop="type"
            :rules="[
              {
                required: true,
                message: $t('table.rule_type') + $t('table.not_empty'),
              },
            ]"
          >
            <el-radio-group v-model="proxyForm.type">
              <el-radio v-for="item in typeOption" :key="item.id" :label="item.value" size="large">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :label="$t('table.desc' /**描述 */)"
            prop="desc"
            :rules="[
              {
                required: true,
                message: $t('table.desc') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.desc"
              style="width:60%"
              type="textarea"
              show-word-limit
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.expand' /**拓展 */)"
            prop="ext"
            :rules="[
              {
                required: true,
                message: $t('table.expand') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.ext"
              style="width: 60%"
              clearable
            />
          </el-form-item>
          <!-- <el-form-item
            :label="$t('table.status')"
          >
            <el-select
              v-model="proxyForm.status"
              style="width: 60%"
              popper-class="user-select"
              :placeholder="$t('lib.all')"
              clearable
            >
              <el-option
                v-for="item in enableOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="resetCrudStatus">
              {{ $t('crud.cancel') }}
            </el-button>
            <el-button type="primary" @click="submitHandle">
              {{ $t('crud.sure') }}
            </el-button>
          </span>
        </template>
      </el-dialog>
    </template>
  </PageMain>
</template>

<style lang="scss" scoped>
.el-dialog__body{
.el-form-item{
  width: 100%;
}
}
</style>
