<route lang="yaml">
name: fileList
meta:
  title: 上传配置
  constant: false
  layout: true
</route>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElNotification } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { Back, Check, Close } from '@element-plus/icons-vue'
import { getUploadInfo, saveUploadInfo } from '@/api/file-manage/upload-config'

const loading = ref(false)
const route = useRoute()
const router = useRouter()

const form = reactive({
  aliyun_access_key_id: '',
  aliyun_access_key_secret: '',
  aliyun_bucket: '',
  aliyun_bucket_domain: '',
  aliyun_endpoint: '',
  audio_ext: '',
  audio_size: '',
  baidu_access_key: '',
  baidu_bucket: '',
  baidu_domain: '',
  baidu_endpoint: '',
  baidu_secret_key: '',
  create_time: '',
  delete_time: 0,
  image_ext: '',
  image_size: '',
  other_ext: '',
  other_size: '',
  qiniu_access_key: '',
  qiniu_bucket: '',
  qiniu_domain: '',
  qiniu_secret_key: '',
  setting_id: '',
  storage: '',
  tencent_bucket: '',
  tencent_domain: '',
  tencent_region: '',
  tencent_secret_id: '',
  tencent_secret_key: '',
  update_time: null,
  video_ext: '',
  video_size: '',
  word_ext: '',
  word_size: '',
})

const group_name = computed(() => {
  return route.query.group_name
})

const storage = reactive({})

const storageList = computed(() => {
  const result: any[] = []
  if (Object.keys(storage).length > 0) {
    for (const keyL of Object.keys(storage)) {
      result.push({ label: (storage as any)[keyL], value: keyL })
    }
  }
  return result
})

function toQuery() {
  loading.value = true
  getUploadInfo({ group_id: route.query.group_id })
    .then((result: any) => {
      if (+result.code === 1) {
        Object.assign(form, result.data.setting)
        Object.assign(storage, result.data.storage)
      }
    })
    .finally(() => {
      loading.value = false
    })
}
function saveHandle() {
  loading.value = true
  saveUploadInfo(form)
    .then((result: any) => {
      if (+result.code === 1) {
        ElNotification.success(result.msg)
      }
    })
    .finally(() => {
      toQuery()
      loading.value = false
    })
}

function back() {
  router.push({ path: '/file-manage/file-group-manage' })
}

onMounted(() => {
  toQuery()
})
</script>

<template>
  <div class="upload-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div>
            <el-button type="primary" @click="back">
              <el-icon><Back /></el-icon> {{ $t("table.back") }}
            </el-button>
            {{ group_name }}
          </div>
          <div>
            <el-button type="primary" :loading="loading" @click="saveHandle">
              <el-icon><Check /></el-icon> {{ $t("crud.save") }}
            </el-button>
            <el-button :loading="loading" @click="toQuery">
              <el-icon><Close /></el-icon> {{ $t("crud.reset") }}
            </el-button>
          </div>
        </div>
      </template>
      <el-form
        ref="ruleFormRef"
        v-loading="loading"
        :model="form"
        label-width="120px"
        inline
      >
        <el-form-item :label="$t('table.storage')">
          <el-select
            v-model="form.storage"
            style="width: 206px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in storageList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-card shadow="never">
          <template #header>
            <span>{{ $t("table.image") }}</span>
          </template>
          <el-form-item :label="$t('table.file_ext')">
            <el-input
              v-model="form.image_ext"
              :placeholder="$t('table.file_ext_pl')"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.file_size')">
            <el-input
              v-model="form.image_size"
              :placeholder="$t('table.file_size_pl')"
              clearable
            />
          </el-form-item>
        </el-card>
        <el-card shadow="never">
          <template #header>
            <span>{{ $t("table.video") }}</span>
          </template>
          <el-form-item :label="$t('table.file_ext')">
            <el-input
              v-model="form.video_ext"
              :placeholder="$t('table.file_ext_pl')"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.file_size')">
            <el-input
              v-model="form.video_size"
              :placeholder="$t('table.file_size_pl')"
              clearable
            />
          </el-form-item>
        </el-card>
        <el-card shadow="never">
          <template #header>
            <span>{{ $t("table.audio") }}</span>
          </template>
          <el-form-item :label="$t('table.file_ext')">
            <el-input
              v-model="form.audio_ext"
              :placeholder="$t('table.file_ext_pl')"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.file_size')">
            <el-input
              v-model="form.audio_size"
              :placeholder="$t('table.file_size_pl')"
              clearable
            />
          </el-form-item>
        </el-card>
        <el-card shadow="never">
          <template #header>
            <span>{{ $t("table.word") }}</span>
          </template>
          <el-form-item :label="$t('table.file_ext')">
            <el-input
              v-model="form.word_ext"
              :placeholder="$t('table.file_ext_pl')"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.file_size')">
            <el-input
              v-model="form.word_size"
              :placeholder="$t('table.file_size_pl')"
              clearable
            />
          </el-form-item>
        </el-card>
        <el-card shadow="never">
          <template #header>
            <span>{{ $t("table.other_file") }}</span>
          </template>
          <el-form-item :label="$t('table.file_ext')">
            <el-input
              v-model="form.other_ext"
              :placeholder="$t('table.file_ext_pl')"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.file_size')">
            <el-input
              v-model="form.other_size"
              :placeholder="$t('table.file_size_pl')"
              clearable
            />
          </el-form-item>
        </el-card>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.upload-container {
  margin: 10px;
  height: calc(100% - 10px);
  overflow: scroll;
  .card-header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
