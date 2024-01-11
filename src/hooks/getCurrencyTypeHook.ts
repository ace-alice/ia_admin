import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { getCurrencyType } from '@/api/financial-manage/account-change-list'
export default function () {
  const currencyList: Ref<any[]> = ref([])

  function getCurrencyTypeFun() {
    getCurrencyType().then((result: any) => {
      if (+result.code === 1) {
        currencyList.value = result.data
      }
    })
  }

  onMounted(() => {
    getCurrencyTypeFun()
  })

  return { currencyList }
}
