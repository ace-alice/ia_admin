<route lang="yaml">
name: operateHistory
meta:
  title: 操作日志
  constant: false
  layout: true
    </route>

<script lang="ts" setup name="eventManage">
import { RefreshRight, Search } from '@element-plus/icons-vue'
import { parseTime } from '@/utils/formatTime'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/auth-manage/operate-history'
import visibleColumn from '@/hooks/visibleColumn'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '操作日志',
  crudOptShow: {
    add: true,
    formSize: '50%',
  },
  defaultQuery: {
  },
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'operate:history:',
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
} = CRUD(defaultCrudOptions)

const { tableRef }
      = visibleColumn()
const moduleOptions: any = ref([])
const interfaceOptions: any = ref([])
const getEventOptions = () => {
  Api.getParams().then((res: any) => {
    if (res && res.code === 1) {
      const getOption = (data: any) => {
        const tmp: any = []
        Object.keys(data).forEach((k: any) => {
          const obj = {
            label: data[k],
            value: k,
          }
          tmp.push(obj)
        })
        return tmp
      }
      moduleOptions.value = getOption(res.data.module)
      interfaceOptions.value = getOption(res.data.interface)
    }
  })
}
onMounted(() => {
  getEventOptions()
})
</script>

<template>
  <PageMain :title="$t('router.operate-history')" :has-tool="false" :has-footer="true">
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.operator_time' /**操作时间 */)">
          <dateTimePickerQuery
            start-key="create_time_start"
            end-key="create_time_end"
            :prop-time="[crudQuery.create_time_start, crudQuery.create_time_end]"
            @set-time="crudSetQueryKey"
          />
        </el-form-item>
        <el-form-item :label="$t('table.operate_module' /**操作模块 */)">
          <el-select
            v-model="crudQuery.operate_module"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in moduleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.operate_interface' /**操作界面 */)">
          <el-select
            v-model="crudQuery.operate_interface"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in interfaceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.operate_button' /**操作按钮 */)">
          <el-select
            v-model="crudQuery.operate_button"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              :label="$t('table.set_play_lock' /**玩法锁单 */)"
              value="setPlayLock"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.operator' /**操作人 */)">
          <el-input v-model="crudQuery.admin_username" clearable type="text" />
        </el-form-item>
        <el-form-item :label="$t('table.parameter' /**参数 */)">
          <el-input v-model="crudQuery.params" clearable type="text" />
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
    <template #pageBody>
      <el-table
        ref="tableRef"
        v-loading="queryLoading"
        :data="crudData"
        stripe
        style="width: 100%;"
        height="100%"
        border
        resizable
      >
        <el-table-column
          prop="create_time"
          :label="$t('table.operator_time')"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.create_time">{{ parseTime(scope.row.create_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operate_module"
          :label="$t('table.operate_module' /**操作模块 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          prop="operate_interface"
          :label="$t('table.operate_interface' /**操作界面*/)"
          min-width="130"
          align="center"
        />

        <el-table-column
          prop="operate_button"
          :label="$t('table.operate_btn' /**操作按钮*/)"
          min-width="130"
          align="center"
        />
        <el-table-column
          prop="operate_field"
          :label="$t('table.operate_text' /**操作字段 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          prop="operate_after"
          :label="$t('table.operate_after' /**操作后 */)"
          min-width="130"
          align="center"
        />

        <el-table-column
          prop="admin_username"
          :label="$t('table.operator' /**操作人 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          prop="request_ip"
          :label="$t('table.operate_ip' /**操作IP */)"
          min-width="130"
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

