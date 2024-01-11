import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { getAllProxy } from '@/api/user-manage/user-list'
export default function () {
  const proxyList: Ref<any[]> = ref([])

  function getProxyListFun() {
    getAllProxy().then((result: any) => {
      if (+result.code === 1) {
        proxyList.value = result.data
      }
    })
  }

  onMounted(() => {
    getProxyListFun()
  })

  return { proxyList }
}
