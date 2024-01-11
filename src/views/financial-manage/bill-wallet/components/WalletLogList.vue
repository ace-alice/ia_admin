<script lang="ts" name="WalletLogList" setup>
import { Search } from '@element-plus/icons-vue'
import { getLogList } from '@/api/financial-manage/bill-wallet'
import { parseTime } from '@/utils/formatTime'

const { proxy }: any = getCurrentInstance()

const dialogVisible = ref(false)

const logList = ref<any>([])

const loading = ref(false)

const titleData = reactive({
  id: null,
  title: null,
})

const timeArr = ref<any>('')

const defaultForm = {
  page: 1,
  limit: 10,
  total: 0,
  create_time_start: null,
  create_time_end: null,
}

const form = reactive(Object.assign({}, defaultForm))

function closeHandle() {
  Object.assign(form, defaultForm)
  Object.assign(titleData, { id: null, title: null })
  logList.value = []
  dialogVisible.value = false
}

function getList() {
  loading.value = true
  getLogList(Object.assign({}, form, { id: titleData.id }))
    .then((res: any) => {
      if (+res.code === 1) {
        logList.value = res.data.data
        form.total = res.data.total
      }
    })
    .finally(() => (loading.value = false))
}

function refresh() {
  form.page = 1
  getList()
}

function timeChange(val: any) {
  if (val && Array.isArray(val) && val.length === 2) {
    form.create_time_start = val[0]
    form.create_time_end = val[1]
  }
  else {
    form.create_time_start = null
    form.create_time_end = null
  }
  refresh()
}

onMounted(() => {
  proxy.mittBus.on('getLogListBus', (parmas: { id: number; title: string }) => {
    Object.assign(titleData, parmas)
    dialogVisible.value = true
    getList()
  })
})
onUnmounted(() => {
  proxy.mittBus.off('getLogListBus')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('table.show_log') + titleData.title"
    :before-close="closeHandle"
    width="1200px"
    destroy-on-close
  >
    <div class="dialog-Title">
      <div>{{ $t("table.create_time") }}</div>
      <el-date-picker
        v-model="timeArr"
        type="daterange"
        range-separator="To"
        start-placeholder="Start date"
        end-placeholder="End date"
        value-format="X"
        @change="timeChange"
      />
      <el-button
        :icon="Search"
        :loading="loading"
        type="primary"
        @click="refresh"
      >
        {{ $t('crud.search') }}
      </el-button>
    </div>
    <el-table :data="logList" style="width: 1200px" max-height="65vh" border>
      <el-table-column
        prop="content"
        :label="$t('table.content')"
        min-width="600"
        align="left"
      />
      <el-table-column
        prop="create_username"
        :label="$t('table.create_name')"
        min-width="120"
        align="center"
      />
      <el-table-column
        :label="$t('table.create_time')"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          <div v-if="scope.row.create_time">
            {{ parseTime(scope.row.create_time) }}
          </div>
          <div v-else>
            --
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="form.page"
      v-model:page-size="form.limit"
      style="margin-top: 10px"
      :page-sizes="[10, 50, 100, 500, 1000]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="form.total"
      @size-change="refresh"
      @current-change="getList"
    />
  </el-dialog>
</template>

<style lang="scss" scoped>
.dialog-Title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  width: 700px;
  & > * {
    margin: 0 20px;
  }
}
</style>
