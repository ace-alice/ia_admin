import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { getMatchNameApi } from '@/api/global/gameInfo'
export default function (game_id: number | string) {
  const roundList: Ref<string[]> = ref([])

  function getRoundListFun() {
    getMatchNameApi({ game_id }).then((result: any) => {
      if (+result.code === 1) {
        roundList.value = result.data
      }
    })
  }

  onMounted(() => {
    getRoundListFun()
  })

  return { roundList }
}
