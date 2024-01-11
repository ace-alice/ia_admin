import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { getAllOrderType } from '@/api/global/gameInfo'
export default function () {
  const allOrderTypeList: Ref<any[]> = ref([])

  function getAllOrderTypeFun() {
    getAllOrderType().then((result: any) => {
      if (+result.code === 1) {
        const keys: string[] = Object.keys(result.data)
        allOrderTypeList.value = keys.map((keyL) => {
          return {
            id: +keyL,
            label: result.data[keyL],
          }
        })
      }
    })
  }

  onMounted(() => {
    getAllOrderTypeFun()
  })

  return { allOrderTypeList }
}
