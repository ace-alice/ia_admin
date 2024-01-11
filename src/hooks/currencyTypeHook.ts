import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { getCurrencyType } from '@/api/financial-manage/account-change-list'
export default function () {
  const currencyTypeList: Ref<any[]> = ref([])

  function getCurrencyTypeListFun() {
    getCurrencyType().then((result: any) => {
      if (+result.code === 1) {
        currencyTypeList.value = result.data
      }
    })
  }

  onMounted(() => {
    getCurrencyTypeListFun()
  })

  return { currencyTypeList }
}
