<script setup lang="ts" name="ChangeCompanyPoints">
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'
import { editPointConfig } from '@/api/partner-manage/company-manage'

const emits = defineEmits(['change'])

const { proxy }: any = getCurrentInstance()

const defaultForm = {
  id: null,
  config_arr: [
    {
      amount: null,
      points: null,
    },
    {
      amount: null,
      points: null,
    },
    {
      amount: null,
      points: null,
    },
  ],
}

const { t } = useI18n()

const formData = reactive(Object.assign({}, defaultForm))

function addLevel() {
  formData.config_arr.push({
    amount: null,
    points: null,
  })
}

const dialogVisible = ref(false)

function submitHandle() {
  editPointConfig(
    Object.assign({}, formData, {
      config_arr: JSON.stringify(formData.config_arr),
    }),
  ).then(async (res: any) => {
    if (+res.code === 1) {
      ElNotification({
        title: t('crud.Editsuccessfully'),
        type: 'success',
      })
      resetCrudStatus()
      emits('change')
    }
  })
}

function resetCrudStatus() {
  dialogVisible.value = false
  Object.assign(formData, defaultForm)
}

onMounted(() => {
  proxy.mittBus.on('changeCompanyPointsBus', (row: any) => {
    Object.assign(formData, {
      id: row.id,
      config_arr: JSON.parse(row.config_arr) || defaultForm.config_arr,
    })
    dialogVisible.value = true
  })
})
onUnmounted(() => {
  proxy.mittBus.off('changeCompanyPointsBus')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="修改收款点位配置"
    :before-close="resetCrudStatus"
    width="1000px"
    destroy-on-close
  >
    <el-table
      :data="formData.config_arr"
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
    <template #footer>
      <span class="dialog-footer">
        <el-button
          v-if="formData.config_arr.length < 3"
          :icon="Plus"
          @click="addLevel"
        />
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
