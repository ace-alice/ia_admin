<script lang="ts" setup name="NormalImageUpload">
import type { Ref } from 'vue'
import { reactive, ref } from 'vue'
import type { FormInstance, UploadInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import {
  BellFilled,
  CircleCheckFilled,
  Delete,
  Plus,
  UploadFilled,
} from '@element-plus/icons-vue'
import { getFileGroupListHook } from '@/hooks/getFileGroupList'
import wcsUpload from '@/service/wcs'
import fileConfigApi from '@/api/file-manage/file-config'
import { i18n } from '@/i18n'

const props = defineProps({
  formLabel: {
    type: String,
    default: '图片上传',
  },
  imgkey: {
    type: String,
    default: 'key',
  },
  isRequire: {
    type: Boolean,
    default: true,
  },
  data: {
    type: String,
  },
  params: {
    type: String,
    default: 'pathName',
  },
  typeList: {
    type: Array,
    default: () => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  pxSize: {
    type: String,
  },
  maxSize: {
    type: Number,
    default: 2048,
  },
  imgUrlKey: {
    type: String,
    default: 'file_url',
  },
  gropId: {
    type: Number,
    default: 3,
  },
})

const emit = defineEmits(['setImage'])

interface ImageDataType {
  group_id: number | string
  file_name: string
  file_type: 'image'
  is_front: 0
}

const defaultImageData: ImageDataType = {
  group_id: props.gropId,
  file_name: '',
  file_type: 'image',
  is_front: 0,
}

const dialogKey = `Keys${new Date().valueOf()}`

const { toUpload } = wcsUpload()

const uploadRef = ref<UploadInstance>()

const ruleFormRef = ref<FormInstance>()

const imgCache: Ref<any> = ref(null)

const uploadVisible = ref(false)

const { fileGroupList } = getFileGroupListHook()

function openUploadTab() {
  uploadVisible.value = true
}

function getTypeName() {
  return props.typeList.join('、')
}

const imageData: ImageDataType = reactive(Object.assign({}, defaultImageData))

function handleClose() {
  imgCache.value = null
  Object.assign(imageData, defaultImageData)
  uploadVisible.value = false
}

// 上传前回调
function beforeImageUpload(file: any): Promise<boolean> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const isImage = props.typeList.includes(file.type)
    const isLtMaxSize = file.size / 1024 < props.maxSize
    if (!isImage) {
      ElMessage.error(
        `${i18n.global.t('other.upload_only')}${getTypeName()} ${i18n.global.t(
          'other.format',
        )}`,
      )
    }
    if (!isLtMaxSize) {
      ElMessage.error(
        `${i18n.global.t('other.upload_only_size')}${
          props.maxSize
        }${i18n.global.t('other.k')}`,
      )
    }
    if (!isImage || !isLtMaxSize) {
      resolve(false)
      return false
    }
    const tempName = file.name.substring(file.name.lastIndexOf('.') + 1)
    const fileName = `image${new Date().getTime()}_${file.size}.${tempName}`
    if (!fileName || !tempName) {
      resolve(false)
      return false
    }
    const isSuccess = await toUpload(file, fileName, file.type)
    if (isSuccess) {
      imgCache.value = null
      imgCache.value = URL.createObjectURL(file)
      imageData.file_name = fileName
    }
    resolve(false)
  })
}

// 确定上传内容
function toSetImage() {
  if (!imgCache.value || !imageData.file_name) {
    return false
  }
  ruleFormRef.value
    && ruleFormRef.value.validate((valid: any) => {
      if (valid) {
        fileConfigApi.add(imageData).then((res: any) => {
          if (+res.code === 1) {
            emit('setImage', {
              [props.imgkey]: res.data.file_id,
              [props.imgUrlKey]: `${res.data.file_name}`,
            })
            uploadVisible.value = false
          }
        })
      }
      else {
        return false
      }
    })
}

function removeImage() {
  imgCache.value = null
  emit('setImage', { [props.imgkey]: null, [props.imgUrlKey]: '' })
}

function handlePaste(event: any) {
  const { items } = event.clipboardData
  if (items.length) {
    for (const item of items) {
      if (item.type.includes('image')) {
        const file = item.getAsFile()
        if (file) {
          beforeImageUpload(file)
        }
      }
      else {
        ElMessage('请选择图片类型的文件上传')
      }
    }
  }
  return false
}
</script>

<template>
  <!-- <NormalImageUpload
            @setImage="setTheForm"
            formLabel="角色头像"
            :data="proxyForm.headImg"
            imgkey="headImg"
            imgUrlKey="file_path"
          /> -->
  <el-form-item
    :label="formLabel"
    :prop="imgUrlKey"
    class="form-box"
    :rules="[{ required: isRequire, message: $t('other.please_upload_img') }]"
  >
    <el-card
      :body-style="{ 'padding': '10px', 'min-width': '180px' }"
      shadow="hover"
    >
      <div class="image-box">
        <el-image
          v-if="data || imgCache"
          :src="imgCache || data"
          class="image"
          fit="contain"
          :preview-src-list="[imgCache || data]"
        >
          <template #error>
            <div class="image-slot">
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                style="height: 100px; width: 100px"
                alt=""
              >
            </div>
          </template>
        </el-image>
        <div v-else class="image" @click="openUploadTab">
          <el-icon><Plus /></el-icon>
        </div>
        <div>
          <div style="margin-bottom: 5px">
            <el-button type="primary" circle @click="openUploadTab">
              <el-icon><UploadFilled /></el-icon>
            </el-button>
          </div>
          <div style="margin-bottom: 5px">
            <el-button type="danger" circle @click="removeImage">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
          <div>
            <el-tooltip effect="dark" placement="bottom">
              <template #content>
                <p>
                  <el-icon><CircleCheckFilled /></el-icon>{{ $t("lib.upload_img_type") }}{{ getTypeName() }}
                </p>
                <p v-if="pxSize">
                  <el-icon><CircleCheckFilled /></el-icon>{{ $t("lib.upload_img_size") }}{{ pxSize }}
                </p>
                <p>
                  <el-icon><CircleCheckFilled /></el-icon>{{ $t("lib.upload_img_max") }}{{ maxSize }}k
                </p>
              </template>
              <el-icon><BellFilled /></el-icon>
            </el-tooltip>
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog
      :key="dialogKey"
      v-model="uploadVisible"
      :title="$t('other.upload_img')"
      destroy-on-close
      append-to-body
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="ruleFormRef" :model="imageData">
        <el-tabs type="border-card">
          <el-tab-pane :label="$t('other.local_img')">
            <div class="upload-box">
              <el-form-item
                prop="file_name"
                :rules="[
                  {
                    required: true,
                    message: i18n.global.t(
                      'lib.pls_upload_img_url', /**请上传图片地址 */
                    ),
                  },
                ]"
              >
                <el-upload
                  ref="uploadRef"
                  class="uploader-box"
                  drag
                  :show-file-list="false"
                  :before-upload="beforeImageUpload"
                  :disabled="!imageData.group_id"
                >
                  <img v-if="imgCache" :src="imgCache" class="image" alt="">
                  <el-icon v-else class="el-icon-plus image plus">
                    <Plus />
                  </el-icon>
                </el-upload>
              </el-form-item>
              <div class="pasted" tabindex="0" @paste="handlePaste($event)">
                where the picture is pasted
              </div>
              <el-form-item
                :label="$t('table.group_name')"
                prop="group_id"
                :rules="[
                  {
                    required: true,
                    message: i18n.global.t(
                      'lib.upload_img_group', /**请选择图片分组 */
                    ),
                  },
                ]"
              >
                <el-select
                  v-model="imageData.group_id"
                  style="width: 200px"
                  popper-class="user-select"
                >
                  <el-option
                    v-for="item in fileGroupList"
                    :key="item.group_id"
                    :label="item.group_name"
                    :value="item.group_id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <el-divider />
            <div>
              <p class="danger">
                {{
                  $t(
                    "lib.upload_img_tips", /**注意：请先选择分组，再上传图片！ */
                  )
                }}
              </p>
              <p>
                <i class="el-icon-warning-outline" />{{
                  $t("lib.upload_img_type")
                }}{{ getTypeName() }}
              </p>
              <p v-if="pxSize">
                <i class="el-icon-warning-outline" />{{
                  $t("lib.upload_img_size")
                }}{{ pxSize }}
              </p>
              <p>
                <i class="el-icon-warning-outline" />{{
                  $t("lib.upload_img_max")
                }}{{ maxSize }}k
              </p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">{{
            $t("crud.cancel" /**取消 */)
          }}</el-button>
          <el-button type="primary" @click="toSetImage">{{
            $t("crud.sure" /**确定 */)
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </el-form-item>
</template>

<style lang="scss" scoped>
.form-box {
  margin-bottom: 18px !important;
}

.image-box {
  display: flex;
  justify-content: center;
  align-items: center;

  .image {
    width: 100px;
    height: 100px;
    border: 1px dotted rgb(172 168 168);
    border-radius: 10px;
    overflow: hidden;
    margin: 0 10px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .plus {
      font-size: 28px;
      color: rgb(140 147 157);
      width: 100px;
      line-height: 100px;
      text-align: center;
    }
  }
}

.pasted {
  min-height: 60px;
  width: 152px;
  background-color: #fdb00b;
  margin-bottom: 20px;
  border-radius: 12px;
  display: flex;
  word-break: keep-all;
  justify-content: center;
  align-items: center;
  padding: 20px;
  &:focus-within {
    box-shadow:0 0 10px #fff;
  }
}

.upload-box {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .image {
    height: 150px;
    width: 150px;
    border: 1px dotted rgb(172 168 168);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .plus {
    font-size: 28px;
    color: rgb(194 204 218);
    width: 150px;
    line-height: 150px;
    text-align: center;
  }
}

.warn {
  color: #fdb00b;
  font-size: 16px;
}

.danger {
  color: red;
}
:deep(.el-upload-dragger) {
  padding: 0;
}
</style>
