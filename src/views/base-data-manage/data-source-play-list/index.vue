<route lang="yaml">
name: eventManage
meta:
  title: 数据源玩法数据列表
  constant: false
  layout: true
  </route>

<script lang="ts" setup name="eventManage">
import { RefreshRight, Search } from '@element-plus/icons-vue'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api, { getThreeGameList } from '@/api/match-data-manage/data-source-play-list'
import { dictionary } from '@/hooks/lib'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '数据源玩法数据列表',
  crudOptShow: {
    add: true,
    formSize: '50%',
  },
  defaultQuery: {
    game_id: null,
    status: null,
  },
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'event:manage:',
}

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  reQuery,
} = CRUD(defaultCrudOptions)

const { bindStatusOptions, getLabel } = dictionary()

const gameList = ref<any[]>([])

onMounted(() => {
  getThreeGameList().then((res: any) => {
    if (+res.code === 1) {
      gameList.value = res.data
    }
  })
})
</script>

<template>
  <PageMain
    :title="$t('router.data-source-play-list')"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.game_name' /**所属游戏 */)">
          <el-select
            v-model="crudQuery.game_id"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in gameList"
              :key="item.id"
              :label="item.tag"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.status' /**状态 */)">
          <el-select
            v-model="crudQuery.status"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in bindStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
          prop="sort_index"
          :label="$t('table.sort_index')"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="game_name"
          :label="$t('table.game_name')"
          min-width="130"
          align="center"
        />
        <el-table-column
          prop="id"
          :label="$t('table.play_Id')"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="name_cn"
          :label="$t('table.play_name_cn')"
          min-width="160"
          align="center"
        />

        <el-table-column
          prop="name_en"
          :label="$t('table.play_name_en')"
          min-width="160"
          align="center"
        />
        <el-table-column
          prop="match_stage_name"
          :label="$t('table.match_stage_name')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="tag_name"
          :label="$t('table.tag_name')"
          min-width="130"
          align="center"
        />
        <el-table-column
          prop="value"
          :label="$t('table.option_value')"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="status"
          :label="$t('table.status')"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            <el-tag :type="+scope.row.status ? 'warning' : ''">
              {{ getLabel(+scope.row.status, bindStatusOptions) }}
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
  </PageMain>
</template>

  <style lang="scss" scoped>
  .el-dialog__body {
    .el-form-item {
      width: 100%;
    }
  }
  </style>
