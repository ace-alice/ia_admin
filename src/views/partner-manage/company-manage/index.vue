<route lang="yaml">
name: CompanyManage
meta:
  title: 公司管理
  constant: false
  layout: true
</route>

<script lang="ts" setup name="CompanyManage">
import {
  Delete,
  Edit,
  Plus,
  RefreshRight,
  Search,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElOption, ElSelect } from 'element-plus'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import ChangeCompanyConfig from './components/ChangeCompanyConfig.vue'
import ChangeCompanyPoints from './components/ChangeCompanyPoints.vue'
import { parseTime } from '@/utils/formatTime'
import { i18n } from '@/i18n'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/partner-manage/company-manage'
import { dictionary } from '@/hooks/lib'
import PromiseSwitch from '@/components/PromiseSwitch/index.vue'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'
import getProxyListHook from '@/hooks/getProxyListHook'
import getCompanyList from '@/hooks/getCompanyList'
import getCurrencyTypeHook from '@/hooks/getCurrencyTypeHook'
import getGameListHook from '@/hooks/getGameListHook'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.company-manage'),
  crudOptShow: {
    add: true,
    formSize: '1400px',
  },
  defaultQuery: {
    proxy_id: null,
    is_del: null,
    partner_code: null,
    company_id: null,
    type: null,
    money_currency_type: null,
  },
  crudMethod: { ...Api },
  defaultForm: {
    id: null,
    admin_ip_list: '[]',
    available_balance: null,
    available_balance_json: '{}',
    balance_type: 0,
    company_code: null,
    company_desc_img_cn: null,
    company_desc_img_en: null,
    company_logo_img: null,
    company_name_cn: null,
    company_name_en: null,
    company_name_tw: null,
    competition_limit: null,
    config_arr: null,
    contact_email: null,
    company_name: null,
    create_time: null,
    create_user: null,
    create_username: null,
    css_id: null,
    currency_desc: null,
    currency_id: null,
    default_lang: null,
    domain_list: null,
    enable_name: null,
    game_logo_pc: null,
    game_logo_pc_hover: null,
    game_logo_wap: null,
    game_logo_wap_hover: null,
    hide_autochess: null,
    hide_games: null,
    hide_odds_str: null,
    introduction: null,
    ip_list: null,
    is_del: 0,
    is_proxy_create: null,
    is_vir_game: null,
    last_update: null,
    limit_money: null,
    limit_money_type: 0,
    odd_limit_money: null,
    online_time: null,
    partner_code: null,
    proxy_id: null,
    proxy_name: null,
    rate: null,
    receipt_config: null,
    secret_iv: null,
    secret_key: null,
    single_wallet_api_url: null,
    single_wallet_detail: 0,
    single_wallet_status: 0,
    sorted_games: null,
    system_code: null,
    type: 1,
    type_name: null,
    update_time: null,
    update_user: null,
    update_username: null,
    config_arr_temp: [
      {
        amount: 0,
        points: null,
      },
      {
        amount: 1000000,
        points: null,
      },
      {
        amount: 3000000,
        points: null,
      },
    ],
    vir_limit_id: 1,
    virtual_name_cn: null,
    virtual_name_en: null,
    virtual_name_tw: null,
    virtual_status: 0,
    volume_scale: null,
    web_url: null,
    limit_game: '',
    limit_game_arr: [],
  },
  crudTag: 'company:manage',
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
  crudHook,
} = CRUD(defaultCrudOptions)

crudHook.beforeToEdit = (form: any) => {
  let temp: any[] = []
  if (form.limit_game) {
    const tempLimit = JSON.parse(form.limit_game)
    temp = Object.keys(tempLimit).map((limitKey: string) => {
      return {
        game_id: +limitKey,
        amount: +tempLimit[limitKey],
      }
    })
  }
  Object.assign(proxyForm, {
    config_arr_temp: JSON.parse(form.config_arr),
    limit_game_arr: temp,
  })
  return true
}

crudHook.beforeToAdd = () => {
  Object.assign(proxyForm, {
    config_arr_temp: [
      {
        amount: 0,
        points: null,
      },
      {
        amount: 1000000,
        points: null,
      },
      {
        amount: 3000000,
        points: null,
      },
    ],
  })
  return true
}

crudHook.beforeValidateCU = (form: any) => {
  form.config_arr = JSON.stringify(form.config_arr_temp)
  form.limit_game_arr = form.limit_game_arr.filter((limit: any) => {
    return limit.game_id && limit.amount
  })
  if (form.limit_game_arr.length > 0) {
    form.limit_game = ''
    const temp: any = {}
    form.limit_game_arr.forEach((lt: any) => {
      temp[String(lt.game_id)] = lt.amount
    })
    form.limit_game = temp
  }
  else {
    form.limit_game = ''
  }
  return true
}

const { proxyList } = getProxyListHook()

const { companyList } = getCompanyList()

const { currencyList } = getCurrencyTypeHook()

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()

const { isDisableOptions, isNot, companyTypeOptions, limitMoneyTypeOptions }
  = dictionary()

const { gameList } = getGameListHook(false, false)

function editProxyName(row: any) {
  const isLoading = ref(false)
  const matchLevelForm = reactive<any>({
    id: null,
    proxy_id: null,
    proxy_name: null,
  })
  Object.assign(matchLevelForm, {
    id: +row.id,
    proxy_id: +row.proxy_id,
    proxy_name: row.proxy_name,
  })
  const options: any[] = []
  for (const matchLevel of proxyList.value) {
    options.push(
      h(ElOption, {
        value: matchLevel.id,
        label: matchLevel.proxy_name,
      }),
    )
  }
  ElMessageBox({
    title: `${i18n.global.t('crud.edit')}${i18n.global.t('table.agent_name')}`,
    showCancelButton: true,
    beforeClose: (action, instance, done) => {
      if (action === 'cancel') {
        done()
      }
      if (action === 'confirm') {
        if (isLoading.value) {
          return
        }
        isLoading.value = true
        Api.editAgentConfig(matchLevelForm)
          .then((res: any) => {
            if (+res.code === 1) {
              row.proxy_id = matchLevelForm.proxy_id
              row.proxy_name = matchLevelForm.proxy_name
              done()
            }
          })
          .finally(() => {
            setTimeout(() => {
              isLoading.value = false
            }, 500)
          })
      }
    },
    // Should pass a function if VNode contains dynamic props
    message: () =>
      h(
        ElSelect,
        {
          'modelValue': matchLevelForm.proxy_id,
          'onUpdate:modelValue': (val: boolean | string | number) => {
            matchLevelForm.proxy_id = +val
          },
          'filterable': true,
          'onChange': (val: any) => {
            const theMatch = proxyList.value.find((match) => {
              return +match.id === +val
            })
            if (!theMatch) {
              return
            }
            matchLevelForm.proxy_name = theMatch.proxy_name
          },
        },
        () => options,
      ),
  })
}

const { proxy }: any = getCurrentInstance()

function openChangePoints(row: any) {
  proxy.mittBus.emit('changeCompanyPointsBus', row)
}

function openChangeConfig(row: any) {
  proxy.mittBus.emit('changeCompanyConfigBus', row)
}
function addLimit() {
  proxyForm.limit_game_arr.push({
    game_id: null,
    amount: null,
  })
}

function deleteLimit(idx: number) {
  proxyForm.limit_game_arr.splice(idx, 1)
}

function gameIdChange(idx: any) {
  const hasGameId = proxyForm.limit_game_arr.some((limit: any, index: number) => {
    return index !== idx && limit.game_id === proxyForm.limit_game_arr[idx].game_id
  })
  if (hasGameId) {
    proxyForm.limit_game_arr[idx].game_id = null
    ElMessage.warning(i18n.global.t('table.game_already_exists'))
  }
}
</script>

<template>
  <PageMain
    :title="$t('router.company-manage')"
    :has-tool="true"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.is_disable')" prop="is_disable">
          <ElSelect
            v-model="crudQuery.is_del"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
          >
            <ElOption
              v-for="item in isNot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item :label="$t('table.agent_name' /**所属代理 */)">
          <ElSelect
            v-model="crudQuery.proxy_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <ElOption
              v-for="pro in proxyList"
              :key="pro.id"
              :label="pro.proxy_name"
              :value="pro.id"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item :label="$t('table.partner_code')" prop="partner_code">
          <el-input
            v-model="crudQuery.partner_code"
            :placeholder="$t('table.partner_code')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.company_name')">
          <ElSelect
            v-model="crudQuery.company_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <ElOption
              v-for="company in companyList"
              :key="company.id"
              :label="company.company_name"
              :value="company.id"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item :label="$t('table.company_type_name')">
          <ElSelect
            v-model="crudQuery.type"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <ElOption
              v-for="company in companyTypeOptions"
              :key="company.value"
              :label="company.label"
              :value="company.value"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item :label="$t('table.money_type')">
          <ElSelect
            v-model="crudQuery.money_currency_type"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <ElOption
              v-for="company in currencyList"
              :key="company.id"
              :label="company.name"
              :value="company.id"
            />
          </ElSelect>
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
          min-width="60"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('company_name')"
          prop="company_name"
          :label="$t('table.company_name')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('type_name')"
          prop="type_name"
          :label="$t('table.company_type_name')"
          min-width="100"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('partner_code')"
          prop="partner_code"
          :label="$t('table.partner_code')"
          min-width="100"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('proxy_name')"
          prop="proxy_name"
          :label="$t('table.proxy_name')"
          min-width="160"
          align="center"
        >
          <template #default="scope">
            <span style="margin-right: 12px">{{ scope.row.proxy_name }}</span>
            <el-button
              size="small"
              type="primary"
              :icon="Edit"
              circle
              @click="editProxyName(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('currency_desc')"
          prop="currency_desc"
          :label="$t('table.currency_desc')"
          min-width="360"
          align="left"
        />
        <el-table-column
          v-if="getColumnShow('create_username')"
          prop="create_username"
          :label="$t('table.create_name')"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('create_time')"
          prop="create_time"
          :label="$t('table.create_time')"
          min-width="190"
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
          v-if="getColumnShow('update_username')"
          prop="update_username"
          :label="$t('table.action_name')"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('update_time')"
          prop="update_time"
          :label="$t('table.update_time1')"
          min-width="190"
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
          v-if="getColumnShow('is_del')"
          prop="is_del"
          :label="$t('table.is_disable')"
          width="150"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.id"
              :init-value="scope.row.is_del"
              :options="isDisableOptions"
              :default-param="{
                id: scope.row.id,
                del: scope.row.is_del,
              }"
              param-key="del"
              :change-fun="changeStatus"
              emit-fun-name="isDisable"
              :permission="tablePermission.status"
            />
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
                    <el-button
                      v-only="otherPermission.edit"
                      type="primary"
                      size="small"
                      @click="openChangePoints(scope.row)"
                    >
                      {{ $t("table.change_com_points") }}
                    </el-button>
                    <el-button
                      v-only="otherPermission.edit"
                      type="primary"
                      size="small"
                      @click="openChangeConfig(scope.row)"
                    >
                      {{ $t("table.change_com_config") }}
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
      <ChangeCompanyConfig @change="refresh" />
      <ChangeCompanyPoints @change="refresh" />
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
            :label="$t('table.partner_code')"
            prop="partner_code"
            :rules="[
              {
                required: true,
                message: $t('table.partner_code') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.partner_code"
              :placeholder="$t('table.partner_code')"
              style="width: 220px"
              clearable
            />
            <br>
            <div style="position: absolute; line-height: 16px; top: -36px">
              一经保存，不可修改（请输入4位字符串和数字组合）
            </div>
          </el-form-item>
          <el-form-item
            :label="`${$t('table.company_name')}(zh)`"
            prop="company_name_cn"
            :rules="[
              {
                required: true,
                message: $t('table.company_name') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.company_name_cn"
              :placeholder="$t('table.company_name')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="`${$t('table.company_name')}(en)`"
            prop="company_name_en"
            :rules="[
              {
                required: true,
                message: $t('table.company_name') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.company_name_en"
              :placeholder="$t('table.company_name')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="`${$t('table.balance_type')}`"
            prop="balance_type"
          >
            <el-radio-group
              v-model="proxyForm.balance_type"
              style="width: 220px"
            >
              <el-radio
                v-for="item in isNot"
                :key="item.value"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :label="`${$t('table.single_wallet_status')}`"
            prop="single_wallet_status"
          >
            <el-radio-group
              v-model="proxyForm.single_wallet_status"
              style="width: 220px"
              :disabled="!!proxyForm.id"
            >
              <el-radio
                v-for="item in isNot"
                :key="item.value"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="proxyForm.single_wallet_status"
            :label="`${$t('table.single_wallet_detail')}`"
            prop="single_wallet_detail"
          >
            <el-radio-group
              v-model="proxyForm.single_wallet_detail"
              style="width: 220px"
            >
              <el-radio
                v-for="item in isNot"
                :key="item.value"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="proxyForm.single_wallet_status"
            :label="`${$t('table.single_wallet_api_url')}`"
            prop="single_wallet_api_url"
          >
            <el-input
              v-model="proxyForm.single_wallet_api_url"
              :placeholder="$t('table.single_wallet_api_url')"
              style="width: 632px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="`${$t('table.limit_money_type')}`"
            prop="limit_money_type"
          >
            <el-radio-group
              v-model="proxyForm.limit_money_type"
              style="width: 220px"
            >
              <el-radio
                v-for="item in limitMoneyTypeOptions"
                :key="item.value"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :label="`${
              +proxyForm.limit_money_type
                ? $t('table.limit_money_pr')
                : $t('table.limit_money_amount')
            }`"
            prop="odd_limit_money"
          >
            <el-input
              v-model="proxyForm.odd_limit_money"
              :placeholder="
                +proxyForm.limit_money_type
                  ? $t('table.limit_money_pr')
                  : $t('table.limit_money_amount_pl')
              "
              style="width: 220px"
              type="number"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.volume_scale')" prop="volume_scale">
            <el-input
              v-model="proxyForm.volume_scale"
              :placeholder="$t('table.volume_scale_pl')"
              style="width: 220px"
              type="number"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.competition_limit')"
            prop="competition_limit"
          >
            <el-input
              v-model="proxyForm.competition_limit"
              :placeholder="$t('table.competition_limit_pl')"
              style="width: 220px"
              type="number"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.company_type_name')">
            <ElSelect
              v-model="proxyForm.type"
              style="width: 220px"
              :placeholder="$t('lib.all')"
              popper-class="user-select"
              filterable
            >
              <ElOption
                v-for="company in companyTypeOptions"
                :key="company.value"
                :label="company.label"
                :value="company.value"
              />
            </ElSelect>
          </el-form-item>
          <el-form-item :label="$t('table.is_disable')" prop="is_del">
            <ElSelect
              v-model="proxyForm.is_del"
              style="width: 220px"
              popper-class="user-select"
              :placeholder="$t('lib.all')"
            >
              <ElOption
                v-for="item in isNot"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </el-form-item>
          <el-form-item :label="$t('table.online_time')" prop="online_time">
            <el-date-picker
              v-model="proxyForm.online_time"
              type="date"
              :placeholder="$t('table.online_time')"
              value-format="X"
            />
          </el-form-item>
          <el-table
            :data="proxyForm.config_arr_temp"
            style="width: 100%; width: 1200px"
            border
          >
            <el-table-column
              :label="$t('table.config_level')"
              min-width="120"
              align="center"
            >
              <template #default="scope">
                <div>
                  {{ scope.$index + 1 }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              :label="$t('other.amount')"
              min-width="260"
              align="center"
            >
              <template #default="scope">
                <el-input
                  v-model="scope.row.amount"
                  :placeholder="$t('other.amount')"
                  style="width: 220px"
                  type="number"
                  clearable
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              :label="$t('table.point_level')"
              min-width="260"
              align="center"
            >
              <template #default="scope">
                <el-input
                  v-model="scope.row.points"
                  :placeholder="$t('table.point_level')"
                  style="width: 220px"
                  type="number"
                  clearable
                >
                  <template #append>
                    %
                  </template>
                </el-input>
              </template>
            </el-table-column>
          </el-table>
          <!-- :label="$t('table.limit_game' /**累计限额 */)" -->
          <el-form-item prop="limit_game">
            <el-table
              :data="proxyForm.limit_game_arr"
              border
              style="width: 1200px; margin-top: 8px"
            >
              <el-table-column
                prop="game_id"
                align="center"
                :label="$t('other.game')"
                min-width="220"
              >
                <template #default="scope">
                  <ElSelect
                    v-model="scope.row.game_id"
                    :placeholder="$t('table.to-select')"
                    style="width: 190px"
                    filterable
                    @change="gameIdChange(scope.$index)"
                  >
                    <ElOption
                      v-for="role in gameList"
                      :key="role.id"
                      :label="role.game_name"
                      :value="role.id"
                    />
                  </ElSelect>
                </template>
              </el-table-column>
              <el-table-column
                prop="amount"
                align="center"
                :label="$t('table.limit_game')"
                min-width="220"
              >
                <template #default="scope">
                  <el-input
                    v-model="scope.row.amount"
                    :placeholder="$t('other.pls_input')"
                    style="width: 190px"
                    type="number"
                    clearable
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="amount"
                align="center"
                :label="$t('table.limit_game')"
                width="120"
              >
                <template #header>
                  <el-button
                    type="primary"
                    :icon="Plus"
                    circle
                    size="small"
                    @click="addLimit"
                  />
                </template>
                <template #default="scope">
                  <el-button
                    type="danger"
                    :icon="Delete"
                    circle
                    size="small"
                    @click="deleteLimit(scope.$index)"
                  />
                </template>
              </el-table-column>
            </el-table>
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
    </template>
  </PageMain>
</template>
