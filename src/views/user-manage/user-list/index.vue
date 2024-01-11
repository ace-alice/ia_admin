<route lang="yaml">
name: userList
meta:
  title: 用户列表
  constant: false
  layout: true
</route>

<script lang="ts" setup name="userList">
import { ArrowDown, Download, RefreshRight, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import {
  otherPermission,
} from './hooks/permission'
import modifyAmount from './components/modifyAmount.vue'
import modifyLimit from './components/modifyLimit.vue'
import modifyLabel from './components/modifyLabel.vue'
import userGroup from './components/userGroup.vue'
import { parseTime } from '@/utils/formatTime'
import { getLabel } from '@/utils'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/user-manage/user-list'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'
import { i18n } from '@/i18n'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.user-list'),
  crudOptShow: {
    add: true,
    formSize: '50%',
  },
  defaultQuery: {
    user_id: null,
    username: null,
    company_id: null,
    risk_id: null,
    user_group_id: null,
    today: null,
    create_start_time: null,
    create_end_time: null,
  },
  crudMethod: { ...Api },
  defaultForm: {},
  crudCreateQuery: false,
  crudTag: 'user:list:',
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

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()
const { proxy }: any = getCurrentInstance()
const option1: any = ref([])
const option2: any = ref([])
const option3: any = ref([])
const selectionArr = ref<any[]>([])
function handleSelectionChange(selection: any[]) {
  selectionArr.value = selection
}
function toReview(rowArr: any[]) {
  proxy.mittBus.emit('openUserGroup', { rowArr })
}

function toBatchOperate() {
  toReview(selectionArr.value)
}
const remove = () => {
  const userId: any = []
  selectionArr.value.forEach((item: any) => {
    userId.push(item.user_id)
  })
  if (!userId.length) {
    return
  }
  Api.removetoGroup({
    user_ids: userId.toString(),
  }).then((res: any) => {
    if (res && res.code === 1) {
      ElNotification.success(res.msg || res.message)
      refresh()
    }
  })
}
const handleRemove = () => {
  ElMessageBox.confirm(i18n.global.t('other.sure_remove'))
    .then(() => {
      remove()
    })
    .catch(() => {
      // catch error
    })
}
const option4: any = ref([
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 0,
  },
])
// 限额信息
const limitInfo: any = ref({})
// 所属公司
const getOption1 = () => {
  Api.getAllComp().then((res: any) => {
    if (res && res.code === 1) {
      option1.value = res.data
    }
  })
}
// 用户组
const getOption2 = () => {
  Api.getAllUserGroup().then((res: any) => {
    if (res && res.code === 1) {
      option2.value = res.data
    }
  })
}
const getOption3 = () => {
  Api.getAllRiskLabel().then((res: any) => {
    if (res && res.code === 1) {
      option3.value = res.data
    }
  })
}
const openDialog = (row: any, event_name: string) => {
  proxy.mittBus.emit(event_name, row)
}
const initOption = () => {
  getOption1()
  getOption2()
  getOption3()
}
const view = (row: any) => {
  Api.userLimitInfo({
    user_id: row.user_id,
    company_id: row.company_id,
  }).then((res: any) => {
    if (res && res.code === 1) {
      limitInfo.value = res.data
      ElMessageBox({
        title: i18n.global.t('lib.view'),
        message: h('div', null, [
          h(
            'p',
            null,
            `${i18n.global.t('lib.simply_comp')}`
              + `--${
                limitInfo.value.company_limit_type === 0
                  ? `${i18n.global.t('other.amount')}：`
                  : `${i18n.global.t('other.percent')}：`
              }`
              + `${limitInfo.value.company_limit}`
              + `${limitInfo.value.company_limit_type === 0 ? '' : '%'}`,
          ),
          h(
            'p',
            null,
            `${i18n.global.t('lib.simply_user')}`
              + `--${
                limitInfo.value.user_limit_type === 0
                  ? `${i18n.global.t('other.amount')}：`
                  : `${i18n.global.t('other.percent')}：`
              }`
              + `${limitInfo.value.user_limit}`
              + `${limitInfo.value.user_limit_type === 0 ? '' : '%'}`,
          ),
        ]),
        showCancelButton: false,
        showConfirmButton: false,
      }).then((action) => {
        ElMessage({
          type: 'info',
          message: `action: ${action}`,
        })
      })
    }
  })
}
onMounted(() => {
  initOption()
})
</script>

<template>
  <PageMain
    :title="$t('router.user-list')"
    :has-add="false"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.user_id' /**用户ID */)" prop="user_id">
          <el-input
            v-model="crudQuery.user_id"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.bet_username' /**用户名 */)"
          prop="username"
        >
          <el-input
            v-model="crudQuery.username"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.comp_name' /**所属公司 */)"
          prop="company_id"
        >
          <el-select
            v-model="crudQuery.company_id"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in option1"
              :key="item.id"
              :label="item.company_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('table.risk_label' /**风控标签 */)"
          prop="risk_id"
        >
          <el-select
            v-model="crudQuery.risk_id"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in option3"
              :key="item.tag_id"
              :label="item.tag_name"
              :value="item.tag_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('table.user_group' /**用户组 */)"
          prop="user_group_id"
        >
          <el-select
            v-model="crudQuery.user_group_id"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in option2"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('table.today_bet' /**今日是否注单 */)"
          prop="today"
        >
          <el-select
            v-model="crudQuery.today"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
          >
            <el-option
              v-for="item in option4"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.create_time_1' /**注册时间 */)">
          <dateTimePickerQuery
            start-key="create_start_time"
            end-key="create_end_time"
            :prop-time="[
              crudQuery.create_start_time,
              crudQuery.create_end_time,
            ]"
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
        <el-form-item>
          <el-button
            type="success"
            :icon="Download"
            :loading="queryLoading"
            @click="toQuery({ export: 1 })"
          >
            {{ $t("crud.export") }}
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
        style="width: 100%"
        height="100%"
        border
        resizable
        :header-cell-style="filterHeaderColumn"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          v-if="getColumnShow('user_id')"
          prop="user_id"
          :label="$t('table.user_id' /**用户ID */)"
          min-width="80"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('username')"
          prop="username"
          :label="$t('table.bet_username' /**用户名 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('company_name')"
          prop="company_name"
          :label="$t('table.comp_name' /**所属公司 */)"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('currency_name')"
          prop="currency_name"
          :label="$t('table.money_type' /**货币类型 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('total_balance')"
          prop="total_balance"
          :label="$t('table.total_money' /**总余额 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('hold_balance')"
          prop="hold_balance"
          :label="$t('table.freeze_money' /**冻结金额 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('available_balance')"
          prop="available_balance"
          :label="$t('table.avail_money' /**可用余额 */)"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('in_amount')"
          prop="in_amount"
          :label="$t('table.quota_money' /**限额 */)"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <span
              class="view"
              style="cursor: pointer"
              @click="view(scope.row)"
            >{{ $t("lib.view") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('create_time')"
          prop="create_time"
          :label="$t('table.create_time_1' /**注册时间 */)"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.create_time">{{ parseTime(scope.row.create_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('risk_id')"
          prop="risk_id"
          :label="$t('table.risk_label' /**风控标签 */)"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            {{ getLabel(scope.row.risk_id, option3, "tag_id", "tag_name") }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('user_group_name')"
          prop="user_group_name"
          :label="$t('table.user_group' /**所属用户组 */)"
          min-width="150"
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
                      v-only="otherPermission.p1"
                      type="primary"
                      size="small"
                      @click="openDialog(scope.row, 'modify_amount')"
                    >
                      {{ $t("crud.modify_amount") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.p2"
                      type="primary"
                      size="small"
                      @click="openDialog(scope.row, 'modify_limit')"
                    >
                      {{ $t("crud.modify_limit") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.p3"
                      type="primary"
                      size="small"
                      @click="openDialog(scope.row, 'modify_label')"
                    >
                      {{ $t("crud.modify_label") }}
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
      <el-dropdown popper-class="batch-operation">
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
              @click="toBatchOperate"
            >
              {{ $t("lib.add_to_group") }}
            </el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu>
            <el-dropdown-item
              command="status2"
              :disabled="selectionArr.length === 0"
              @click="handleRemove"
            >
              {{ $t("lib.remove_to_group") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <template #other>
      <modifyAmount />
      <modifyLimit />
      <modifyLabel @refresh="refresh" />
      <userGroup @refresh="refresh" />
    </template>
  </PageMain>
</template>

<style lang="scss" scoped></style>
