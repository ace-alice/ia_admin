<route lang="yaml">
name: oddsBettingReport
meta:
  title: 赔率投注报表
  constant: false
  layout: true
</route>

<script lang="ts" setup name="oddsBettingReport">
import { RefreshRight, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import ExpandTable from './components/ExpandTable.vue'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/financial-manage/odds-betting-report'
import { i18n } from '@/i18n'
import { dictionary } from '@/hooks/lib'
const route = useRoute()

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.odds-betting-report'),
  defaultQuery: {
    category_id: +(route.query.category_id || 0) || 2,
    game_id: route.query.game_id || null,
    play_id: null,
  },
  crudMethod: { ...Api },
}

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  crudHook,
  queryLoading,
  reQuery,
  crudResData,
} = CRUD(defaultCrudOptions)

crudHook.beforeRefresh = () => {
  if (!crudQuery.game_id) {
    ElMessage.warning(
      i18n.global.t('table.game_id') + i18n.global.t('table.not_empty'),
    )
    return false
  }
  return true
}

const gameInfo = computed(() => {
  if (crudResData.base_info) {
    const crudDataTemp: any = crudResData.base_info || {}
    return `${crudDataTemp.game_type_name || ''}  ${
      crudDataTemp.event_name || ''
    }   ${crudDataTemp.vs_info || ''}`
  }
  return ''
})

const { categoryOption } = dictionary()
</script>

<template>
  <PageMain
    :title="$t('router.odds-betting-report')"
    :has-add="false"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery">
        <el-form-item :label="$t('table.betting_type')">
          <el-select
            v-model="crudQuery.category_id"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            filterable
          >
            <el-option
              v-for="pro in categoryOption"
              :key="pro.value"
              :label="pro.label"
              :value="pro.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.game_id')">
          <el-input
            v-model="crudQuery.game_id"
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.play_Id')">
          <el-input
            v-model="crudQuery.play_id"
            :placeholder="$t('other.pls_input')"
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
        default-expand-all
      >
        <el-table-column type="expand">
          <template #default="props">
            <ExpandTable :crud-data="props.row.list" :teams="props.row.team" />
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <span>{{ gameInfo }}</span>
          </template>
          <el-table-column
            prop="play_id"
            :label="$t('table.play_Id')"
            width="120"
            align="right"
          />
          <el-table-column
            prop="play_name"
            :label="$t('table.play_name')"
            min-width="350"
            align="left"
          />
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
