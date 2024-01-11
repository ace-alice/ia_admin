import { debounce } from 'lodash-es'
import { ElMessage } from 'element-plus'
import Api from '@/api/handicap-manage/champoin-list'
export default function championListHook() {
  const route = useRoute()
  const changeDate = (time: number) => {
    Api.setStartTime({
      game_id: route.query?.game_id,
      game_start_time: time,
    }).then((res: any) => {
      ElMessage.success(res.msg)
    })
  }
  // 调整赔率大小
  const changeOdds = (row: any) => {
    const params = {
      point_id: row.id,
      point_1: row.point,
      is_champion: row.is_champion,
    }
    Api.setOdds(params).then((res: any) => {
      if (res && res.code === 1) {
        ElMessage.success(res.msg)
      }
    })
  }
  const handleChange = debounce(changeOdds, 1000)
  return {
    changeDate,
    handleChange,
  }
}
