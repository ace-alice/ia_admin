import type { Ref } from 'vue'
import { ref } from 'vue'
import { getMatchLevelListApi } from '@/api/handicap-manage/handicap-list'

interface MatchLevelType {
  id: string | number
  level: string
  status: 1 | 0
}

export default function () {
  /**
   * @description 赛事等级
   * */
  const matchLevelList: Ref<MatchLevelType[]> = ref([])

  function getMatchLevelList() {
    getMatchLevelListApi().then((res: any) => {
      if (res.code === 1) {
        matchLevelList.value = res.data
      }
    })
  }

  onMounted(() => {
    getMatchLevelList()
  })
  return { matchLevelList }
}
