<route lang="yaml">
name: personalSetting
</route>

<script setup lang="ts">
import { ElMessage, ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Check, Edit, Refresh } from '@element-plus/icons-vue'
import { editUserInfoApi, getLogApi } from '@/api/global/login'
import useUserStore from '@/store/modules/user'
const i18n = useI18n()

const userStore = useUserStore()

const userInfo: any = reactive(Object.assign({}, userStore.userInfo))

const passwordForm = reactive({
  password_old: '',
  password_new: '',
})

const router = useRouter()

async function editPassword() {
  if (!passwordForm.password_old) {
    return ElMessage.warning('请输入当前密码')
  }
  if (!passwordForm.password_new) {
    return ElMessage.warning('请输入新密码')
  }
  const result = await userStore.editPassword(passwordForm)
  if (result) {
    Object.assign(passwordForm, {
      password_old: '',
      password_new: '',
    })
    userStore.logout().then(() => {
      router.push({
        name: 'login',
      })
    })
  }
}

const editLoading = ref(false)

function submitInfo(cKey: string, cn: string) {
  if (userInfo[cKey] && userInfo[cKey] !== userStore.userInfo[cKey]) {
    editLoading.value = true
    editUserInfoApi({ [cKey]: userInfo[cKey], admin_id: userInfo.admin_id })
      .then(async (res: any) => {
        if (+res.code === 1) {
          ElNotification.success(
            i18n.t('crud.edit')
              + i18n.t(`${cn}.${cKey}`)
              + i18n.t('lib.success'),
          )
          await userStore.getPermissions()
          setTimeout(() => {
            Object.assign(userInfo, userStore.userInfo)
          }, 300)
        }
      })
      .finally(() => {
        editLoading.value = false
      })
  }
}

const queryLoading = ref(false)

const logForm = reactive({
  page: 1,
  limit: 10,
  count: 0,
})

const logList = ref<any[]>([])

function refresh() {
  queryLoading.value = true
  getLogApi(logForm).then((res: any) => {
    if (+res.code === 1) {
      logList.value = res.data.data
      logForm.count = res.data.total
    }
  }).finally(() => {
    queryLoading.value = false
  })
}

function reset() {
  logForm.page = 1
  logForm.limit = 10
  logForm.count = 0
  refresh()
}

onMounted(() => {
  refresh()
})
</script>

<template>
  <div class="page-main">
    <div class="box-card-x">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>{{ $t('table.username') }}</span>
          </div>
        </template>
        <el-input
          v-model="userInfo.username"
          :placeholder="$t('table.username')"
        >
          <template #append>
            <el-button
              type="primary"
              :icon="Check"
              :loading="editLoading"
              @click="submitInfo('username', 'table')"
            />
          </template>
        </el-input>
        <el-input
          v-model="userInfo.nickname"
          :placeholder="$t('table.nickname')"
          style="margin-top: 12px;"
        >
          <template #append>
            <el-button
              type="primary"
              :icon="Check"
              :loading="editLoading"
              @click="submitInfo('nickname', 'table')"
            />
          </template>
        </el-input>
        <el-input
          v-model="userInfo.phone"
          :placeholder="$t('table.phone')"
          style="margin-top: 12px;"
        >
          <template #append>
            <el-button
              type="primary"
              :icon="Check"
              :loading="editLoading"
              @click="submitInfo('phone', 'lib')"
            />
          </template>
        </el-input>
        <el-input
          v-model="userInfo.email"
          :placeholder="$t('table.email')"
          style="margin-top: 12px;"
        >
          <template #append>
            <el-button
              type="primary"
              :icon="Check"
              :loading="editLoading"
              @click="submitInfo('email', 'lib')"
            />
          </template>
        </el-input>
      </el-card>
      <el-card class="box-card box-card-pass">
        <template #header>
          <div class="card-header">
            <span>{{ $t('table.init_password') }}</span>
            <el-button
              link
              :icon="Edit"
              :loading="editLoading"
              @click="editPassword"
            >
              {{ $t('crud.sure') }}
            </el-button>
          </div>
        </template>
        <el-divider content-position="left">
          {{ $t('table.password_old') }}
        </el-divider>
        <el-input
          v-model="passwordForm.password_old"
          type="password"
          show-password
          :placeholder="$t('table.password_old')"
        />
        <el-divider content-position="left">
          {{ $t('table.password_new') }}
        </el-divider>
        <el-input
          v-model="passwordForm.password_new"
          type="password"
          show-password
          :placeholder="$t('table.password_new')"
        />
      </el-card>
    </div>
    <el-card style="margin: 0 8px;">
      <template #header>
        <div class="card-header">
          <span>{{ $t('table.self_log') }}</span>
          <el-button type="primary" :icon="Refresh" circle @click="reset" />
        </div>
      </template>
      <el-table
        v-loading="queryLoading"
        :data="logList"
        stripe
        border
        highlight-current-row
      >
        <el-table-column
          prop="username"
          :label="$t('table.username')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="menu_name"
          :label="$t('table.menu_name')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="menu_url"
          :label="$t('table.menu_url')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="request_ip"
          :label="$t('table.request_ip')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="request_method"
          :label="$t('table.request_method')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="response_msg"
          :label="$t('table.response_msg')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="create_time"
          :label="$t('table.create_time')"
          min-width="160"
          align="center"
        />
      </el-table>
      <el-divider />
      <el-pagination
        v-model:current-page="logForm.page"
        v-model:page-size="logForm.limit"
        :page-sizes="[10, 50, 100, 500, 1000]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="logForm.count"
        @size-change="refresh"
        @current-change="refresh"
      />
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.page-main {
  position: relative;
  margin: 10px;
  padding: 10px;
  background-color: var(--g-app-bg);
  transition: background-color 0.3s;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 20px);

  .box-card-x {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    .box-card {
      margin: 8px;
      max-width: 800px;
      min-width: 400px;
    }

    .box-card-pass {
      flex-grow: 1;
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
