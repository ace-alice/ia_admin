import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { getAllCompanyApi } from '@/api/global/gameInfo'
export default function () {
  const companyList: Ref<any[]> = ref([])

  function getAllCompanyFun() {
    getAllCompanyApi().then((result: any) => {
      if (+result.code === 1) {
        companyList.value = result.data
      }
    })
  }

  onMounted(() => {
    getAllCompanyFun()
  })

  return { companyList }
}
