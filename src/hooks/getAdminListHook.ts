import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { getAdminList } from '@/api/global/gameInfo'
export default function () {
  const adminList: Ref<any[]> = ref([])

  function getAdminListFun() {
    getAdminList().then((result: any) => {
      if (+result.code === 1) {
        adminList.value = result.data
      }
    })
  }

  onMounted(() => {
    getAdminListFun()
  })

  return { adminList }
}
