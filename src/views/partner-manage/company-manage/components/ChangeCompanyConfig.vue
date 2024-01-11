<script setup lang="ts" name="ChangeCompanyConfig">
import { ElInput, ElMessage, ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { editConfig } from '@/api/partner-manage/company-manage'
import currencyTypeHook from '@/hooks/currencyTypeHook'
import { dictionary } from '@/hooks/lib'

const emits = defineEmits(['change'])

const { proxy }: any = getCurrentInstance()

const defaultForm = {
  id: null,
  api_ip_list: [],
  domain_list: [],
  ip_list: [],
  rate: null,
  currency_id: [],
  secret_key: null,
  secret_iv: null,
  default_lang: 1,
  partner_code: null,
  company_name: null,
  old_rate: null,
}

const { t } = useI18n()

const { currencyTypeList } = currencyTypeHook()

const { langOptions } = dictionary()

const formData = reactive<any>(Object.assign({}, defaultForm))

const dialogVisible = ref(false)

function submitHandle() {
  editConfig(
    Object.assign({}, formData, {
      api_ip_list: JSON.stringify(formData.api_ip_list) || [],
      domain_list: JSON.stringify(formData.domain_list) || [],
      ip_list: JSON.stringify(formData.ip_list) || [],
      currency_id: formData.currency_id.join(','),
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

function handleCloseApiIp(tag: string) {
  formData.api_ip_list.splice(formData.api_ip_list.indexOf(tag), 1)
}

function handleCloseIp(tag: string) {
  formData.ip_list.splice(formData.ip_list.indexOf(tag), 1)
}

function handleCloseDomain(tag: string) {
  formData.domain_list.splice(formData.domain_list.indexOf(tag), 1)
}

const inputValue = ref('')

const apiIpInputVisible = ref(false)

const InputApiIpRef = ref<InstanceType<typeof ElInput>>()

function showApiIpInput() {
  apiIpInputVisible.value = true
  nextTick(() => {
    InputApiIpRef.value!.input!.focus()
  })
}

function handleApiIpConfirm() {
  if (!inputValue.value) {
    return
  }
  const inputValueList = inputValue.value.split(',')
  const newList = inputValueList.filter((ip) => {
    return !formData.domain_list.includes(ip)
  })
  if (newList.length > 0) {
    formData.api_ip_list = [...formData.api_ip_list, ...newList]
    apiIpInputVisible.value = false
    inputValue.value = ''
  }
  else {
    ElMessage.warning('Ips has add !')
  }
}

const ipInputVisible = ref(false)

const InputIpRef = ref<InstanceType<typeof ElInput>>()

function showIpInput() {
  ipInputVisible.value = true
  nextTick(() => {
    InputIpRef.value!.input!.focus()
  })
}

function handleIpConfirm() {
  if (!inputValue.value) {
    return
  }
  const inputValueList = inputValue.value.split(',')
  const newList = inputValueList.filter((ip) => {
    return !formData.domain_list.includes(ip)
  })
  if (newList.length > 0) {
    formData.ip_list = [...formData.ip_list, ...newList]
    ipInputVisible.value = false
    inputValue.value = ''
  }
  else {
    ElMessage.warning('Ips has add !')
  }
}

const domainInputVisible = ref(false)

const InputDomainRef = ref<InstanceType<typeof ElInput>>()

function showDomainInput() {
  domainInputVisible.value = true
  nextTick(() => {
    InputDomainRef.value!.input!.focus()
  })
}

function handleDomainConfirm() {
  if (!inputValue.value) {
    return
  }
  const inputValueList = inputValue.value.split(',')
  const newList = inputValueList.filter((ip) => {
    return !formData.domain_list.includes(ip)
  })
  if (newList.length > 0) {
    formData.domain_list = [...formData.domain_list, ...newList]
    domainInputVisible.value = false
    inputValue.value = ''
  }
  else {
    ElMessage.warning('Ips has add !')
  }
}

onMounted(() => {
  proxy.mittBus.on('changeCompanyConfigBus', (row: any) => {
    Object.assign(formData, {
      id: row.id,
      api_ip_list: row.admin_ip_list ? JSON.parse(row.admin_ip_list) : [],
      domain_list: row.domain_list ? JSON.parse(row.domain_list) : [],
      ip_list: row.ip_list ? JSON.parse(row.ip_list) : [],
      rate: +row.rate,
      old_rate: +row.rate,
      currency_id: (row.currency_id as string).split(',').map(id => +id) || [],
      secret_key: row.secret_key,
      secret_iv: row.secret_iv,
      default_lang: +row.default_lang,
      partner_code: row.partner_code,
      company_name: row.company_name,
    })
    dialogVisible.value = true
  })
})
onUnmounted(() => {
  proxy.mittBus.off('changeCompanyConfigBus')
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="修改收款点位配置"
    :before-close="resetCrudStatus"
    width="800px"
    destroy-on-close
  >
    <el-form
      ref="crudDefaultFormRef"
      :model="formData"
      label-width="160px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('table.partner_code')" prop="partner_code">
        <ElInput
          v-model="formData.partner_code"
          :placeholder="$t('table.partner_code')"
          style="width: 420px"
          disabled
        />
      </el-form-item>
      <el-form-item :label="$t('table.company_name')" prop="company_name">
        <ElInput
          v-model="formData.company_name"
          :placeholder="$t('table.company_name')"
          style="width: 420px"
          disabled
        />
      </el-form-item>
      <el-form-item :label="$t('table.rate')" prop="rate">
        <ElInput
          v-model.number="formData.rate"
          :placeholder="$t('table.rate')"
          style="width: 420px"
          type="number"
          :disabled="formData.old_rate"
        />
      </el-form-item>
      <el-form-item :label="$t('table.currency_name')" prop="currency_id">
        <el-checkbox-group v-model="formData.currency_id">
          <el-checkbox
            v-for="currency in currencyTypeList"
            :key="currency.id"
            style="margin: 4px"
            :label="currency.id"
            border
          >
            {{ currency.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item :label="$t('table.default_lang')" prop="default_lang">
        <el-radio-group v-model="formData.default_lang">
          <el-radio
            v-for="lang in langOptions"
            :key="lang.value"
            :label="lang.value"
            style="margin: 4px"
            border
          >
            {{ lang.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="`${$t('table.secret_key')}`"
        prop="secret_key"
        :rules="[
          {
            required: true,
            message: $t('table.secret_key') + $t('table.not_empty'),
          },
        ]"
      >
        <ElInput
          v-model="formData.secret_key"
          :placeholder="$t('table.secret_key')"
          style="width: 420px"
          type="password"
          show-password
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('table.secret_iv')}`"
        prop="secret_iv"
        :rules="[
          {
            required: true,
            message: $t('table.secret_iv') + $t('table.not_empty'),
          },
        ]"
      >
        <ElInput
          v-model="formData.secret_iv"
          :placeholder="$t('table.secret_iv')"
          style="width: 420px"
          type="password"
          show-password
          clearable
        />
      </el-form-item>
      <el-form-item :label="`${$t('table.api_ip_list')}`" prop="api_ip_list">
        <div class="list-box">
          <el-tag
            v-for="tag in formData.api_ip_list"
            :key="tag"
            style="margin: 4px"
            closable
            effect="dark"
            type="warning"
            :disable-transitions="false"
            @close="handleCloseApiIp(tag)"
          >
            {{ tag }}
          </el-tag>
          <ElInput
            v-if="apiIpInputVisible"
            ref="InputApiIpRef"
            v-model.trim="inputValue"
            size="small"
            :placeholder="$t('table.user_ids_pl')"
            @keyup.enter="handleApiIpConfirm"
            @blur="handleApiIpConfirm"
          />
          <el-button
            v-else
            class="button-new-tag ml-1"
            size="small"
            @click="showApiIpInput"
          >
            + {{ $t("table.api_ip_list") }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item :label="`${$t('table.ip_list')}`" prop="ip_list">
        <div class="list-box">
          <el-tag
            v-for="tag in formData.ip_list"
            :key="tag"
            style="margin: 4px"
            closable
            effect="dark"
            type="warning"
            :disable-transitions="false"
            @close="handleCloseIp(tag)"
          >
            {{ tag }}
          </el-tag>
          <ElInput
            v-if="ipInputVisible"
            ref="InputIpRef"
            v-model.trim="inputValue"
            class="ml-1 w-20"
            size="small"
            :placeholder="$t('table.user_ids_pl')"
            @keyup.enter="handleIpConfirm"
            @blur="handleIpConfirm"
          />
          <el-button
            v-else
            class="button-new-tag ml-1"
            size="small"
            @click="showIpInput"
          >
            + {{ $t("table.ip_list") }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item :label="`${$t('table.domain_list')}`" prop="domain_list">
        <div class="list-box">
          <el-tag
            v-for="tag in formData.domain_list"
            :key="tag"
            style="margin: 4px"
            closable
            effect="dark"
            type="warning"
            :disable-transitions="false"
            @close="handleCloseDomain(tag)"
          >
            {{ tag }}
          </el-tag>
          <ElInput
            v-if="domainInputVisible"
            ref="InputDomainRef"
            v-model.trim="inputValue"
            class="ml-1 w-20"
            size="small"
            :placeholder="$t('table.user_ids_pl')"
            @keyup.enter="handleDomainConfirm"
            @blur="handleDomainConfirm"
          />
          <el-button
            v-else
            class="button-new-tag ml-1"
            size="small"
            @click="showDomainInput"
          >
            + {{ $t("table.ip_list") }}
          </el-button>
        </div>
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

<style lang="scss" scoped>
.list-box {
  padding: 5px 10px;
  width: 580px;
  min-height: 64px;
  border: 1px solid #dfaaaa;
  border-radius: 10px;
}
</style>
