import type { Ref } from 'vue'
import { getAllRiskLabel } from '@/api/user-manage/user-list'

export default function () {
  const allRiskList: Ref<any[]> = ref([])

  function getAllRiskLabelFun() {
    getAllRiskLabel().then((result: any) => {
      if (+result.code === 1) {
        allRiskList.value = result.data
      }
    })
  }

  onMounted(() => {
    getAllRiskLabelFun()
  })

  return { allRiskList }
}
