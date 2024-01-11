import type { Ref } from 'vue'
import { wcsUpload } from 'wcs-js-sdk'
import { getWcsToken } from '@/api/file-manage/file-config'

export default function () {
  // 上传进度
  const percent = ref(0)

  const uploadSize = ref(0)

  const uploadObj: Ref<any> = ref(null)

  const fileData: Ref<any> = ref(null)

  function toUpload(file: File, name: string, mimeType: any) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const token: any = await getWcsToken()
      if (+token.code !== 1) {
        resolve(false)
        return
      }
      const uploadUrl = import.meta.env.VITE_UPLOAD_URL
      const extraConfig = {
        timeout: 15000,
        concurrentRequestLimit: 10,
        retryCount: 0,
        key: name,
        mimeType,
      }
      uploadObj.value = wcsUpload(
        file,
        token.data.token,
        uploadUrl,
        extraConfig,
      )
      uploadObj.value.putFile()
      uploadObj.value.uploadProgress = function uploadProgress(progress: any) {
        percent.value = progress.total.percent
        uploadSize.value = progress.total.size
      }
      uploadObj.value.onComplete = function (res: any) {
        fileData.value = res.data
        resolve(true)
        uploadObj.value = null
      }
      uploadObj.value.onError = function () {
        resolve(false)
        uploadObj.value = null
      }
    })
  }

  return { toUpload, uploadObj }
}
