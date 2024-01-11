<route lang="yaml">
name: userIpList
meta:
  title: 用户ip列表
  constant: false
  layout: true
</route>

<script lang="ts" setup name="userIpList">
import { RefreshRight, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { otherPermission } from './hooks/permission'
import ToBlackList from './components/ToBlackList.vue'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/user-manage/user-ip-list'
import getCompanyList from '@/hooks/getCompanyList'

const i18n = useI18n()

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.t('router.user-ip-list'),
  crudOptShow: {
    add: true,
    formSize: '800px',
  },
  defaultQuery: {
    username: null,
    company_id: null,
    ip_address: null,
  },
  crudMethod: { ...Api },
  defaultForm: {},
  crudCreateQuery: false,
  crudTag: 'user:ip:',
}

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  crudHook,
  reQuery,
} = CRUD(defaultCrudOptions)

const { companyList } = getCompanyList()

crudHook.beforeRefresh = () => {
  if (crudQuery.username || crudQuery.ip_address) {
    return true
  }
  else {
    ElMessage.warning(
      `${i18n.t('table.username')}， ip， ${i18n.t('table.one_not_empty')}`,
    )
    return false
  }
}

const { proxy }: any = getCurrentInstance()

function seeToBlack(user_id: number | string) {
  proxy.mittBus.emit('ToBlackBus', user_id)
}
</script>

<template>
  <PageMain
    :title="$t('router.user-ip-list')"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.comp_name')">
          <el-select
            v-model="crudQuery.company_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="company in companyList"
              :key="company.id"
              :label="company.company_name"
              :value="company.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.username')" prop="username">
          <el-input
            v-model="crudQuery.username"
            :placeholder="$t('table.username')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item label="Ip" prop="ip_address">
          <el-input
            v-model="crudQuery.ip_address"
            placeholder="Ip"
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
      >
        <el-table-column
          prop="username"
          :label="$t('table.username')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="company_name"
          :label="$t('table.comp_name')"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="ip"
          :label="$t('table.bet_ip')"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <span v-only="otherPermission.edit">
              <el-button type="info" link @click="seeToBlack(scope.row.user_id)">
                {{ $t("table.see_to_black") }}
              </el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_black"
          :label="$t('table.is_black')"
          min-width="150"
          align="center"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.is_black" type="danger" effect="dark">
              {{ $t("lib.yes") }}
            </el-tag>
            <el-tag v-else type="success" effect="dark">
              {{ $t("lib.no") }}
            </el-tag>
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
      <ToBlackList @close="refresh" />
    </template>
  </PageMain>
</template>

<style lang="scss" scoped></style>
