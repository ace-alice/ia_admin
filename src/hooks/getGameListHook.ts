import type { Ref } from 'vue'
import { ref } from 'vue'
import { getEventListApi, getGameListApi } from '@/api/global/gameInfo'
import { getList } from '@/api/match-data-manage/team-manage'

export default function (eve: boolean, team: boolean) {
  const gameList: Ref<any[]> = ref([])

  const eventList: Ref<any[]> = ref([])

  const teamList: Ref<any[]> = ref([])

  function getGameList() {
    getGameListApi().then((res: any) => {
      if (+res.code === 1) {
        gameList.value = res.data
      }
    })
  }

  function getEventList(id: string | number) {
    if (!id) {
      eventList.value = []
      return
    }
    getEventListApi(id).then((res: any) => {
      if (+res.code === 1) {
        eventList.value = res.data
      }
    })
  }

  function getTeamList(game_type_id: number | string) {
    if (!game_type_id) {
      teamList.value = []
      return
    }
    getList({ is_del: 0, game_type_id }).then((res: any) => {
      if (+res.code === 1) {
        teamList.value = res.data
      }
    })
  }

  function gameChange(id: any) {
    if (eve) {
      getEventList(id)
    }
    if (team) {
      getTeamList(id)
    }
  }

  function getGameName(id: number | string) {
    const theTeam = teamList.value.find((game) => {
      return +game.id === +id
    })
    return theTeam ? theTeam.team_name : ''
  }

  function getGameTypeName(id: number | string) {
    const theGame = gameList.value.find((game) => {
      return +game.id === +id
    })
    return theGame ? theGame.game_name : ''
  }

  onMounted(() => {
    getGameList()
  })

  return {
    gameList,
    eventList,
    getEventList,
    getTeamList,
    teamList,
    gameChange,
    getGameName,
    getGameTypeName,
  }
}
