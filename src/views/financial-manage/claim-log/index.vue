<route lang="yaml">
name: ClaimLog
meta:
  title: 认领记录报表
  constant: false
  layout: true
</route>

<script lang="ts" setup name="ClaimLog">
import { RefreshRight, Search } from '@element-plus/icons-vue'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/financial-manage/claim-log'
import { i18n } from '@/i18n'
import { parseTime } from '@/utils/formatTime'
import { getLabel } from '@/utils'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.claim-log'),
  defaultQuery: {
    type: null,
    game_id: null,
    handle_time_start: null,
    handle_time_end: null,
    point_id: null,
  },
  crudMethod: { ...Api },
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

const typeOptions = ref<any[]>([])

function getType() {
  Api.getTypeList().then((res: any) => {
    if (+res.code === 1) {
      (res.data as any).forEach((data: any, index: number) => {
        typeOptions.value.push({
          value: index,
          label: data,
        })
      })
    }
  })
}

const router = useRouter()

function toSeeCompDetail(row: any) {
  router.push({
    name: 'In-playSub-marketReport',
    query: {
      play_id: +row.point_id || null,
    },
  })
}

onMounted(() => {
  getType()
})
</script>

<template>
  <PageMain
    :title="$t('router.claim-log')"
    :has-add="false"
    :has-tool="false"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery">
        <el-form-item :label="$t('table.type')">
          <el-select
            v-model="crudQuery.type"
            style="width: 200px"
            :placeholder="$t('lib.all')"
            popper-class="user-select"
            clearable
            filterable
          >
            <el-option
              v-for="game in typeOptions"
              :key="game.value"
              :label="game.label"
              :value="game.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.game_id')">
          <el-input
            v-model="crudQuery.game_id"
            type="number"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.play_Id')">
          <el-input
            v-model="crudQuery.play_id"
            type="number"
            clearable
            :placeholder="$t('other.pls_input')"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.game_time')">
          <dateTimePickerQuery
            start-key="handle_time_start"
            end-key="handle_time_end"
            :prop-time="[
              crudQuery.handle_time_start,
              crudQuery.handle_time_end,
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
      </el-form>
    </template>
    <template #pageBody>
      <el-table
        v-loading="queryLoading"
        :data="crudData"
        stripe
        style="width: 100%"
        height="100%"
        border
        resizable
      >
        <el-table-column
          prop="handle_name"
          :label="$t('table.operator')"
          min-width="160"
          align="center"
        />
        <el-table-column
          prop="handle_time"
          :label="$t('table.operator_time')"
          min-width="160"
          align="center"
        >
          <template #default="scope">
            <div v-if="scope.row.handle_time">
              {{ parseTime(scope.row.handle_time) }}
            </div>
            <div v-else>
              --
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="game_id"
          :label="$t('table.game_id')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="point_id"
          :label="$t('table.play_Id')"
          min-width="120"
          align="center"
        >
          <template #default="scope">
            <div v-if="+scope.row.point_id">
              {{ scope.row.point_id }}
            </div>
            <div v-else>
              --
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="type_name"
          :label="$t('table.type')"
          min-width="160"
          align="center"
        >
          <template #default="scope">
            {{ getLabel(scope.row.type, typeOptions) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="operate"
          :label="$t('table.operate')"
          min-width="140"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              type="warning"
              link
              @click="toSeeCompDetail(scope.row)"
            >
              {{ $t("lib.view") }}
            </el-button>
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
