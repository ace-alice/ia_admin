export default function scoketEventHook() {
  // 赔率变化
  const pushOddsInfo = (oddsInfo: any, sourceData: any) => {
    // console.log("pushOddsInfo",oddsInfo)
    // const find: any = sourceData.find((item: any) => item.id === oddsInfo.play_id)
    // if (!find) {
    //   return false
    // }
    // console.log("findeBefore",find)
    // for (let i = 0; i < find.team.length; i++) {
    //   if (find.team[i].id === oddsInfo.point_id) {
    //     Object.assign(find.team[i], { point: oddsInfo.point })
    //   }
    // }
    // console.log("findAfter",find)
    const index = sourceData.findIndex((row: any) => {
      return +row.id === +oddsInfo.play_id
    })
    if (index !== -1) {
      (sourceData as any[])[index].team.forEach(
        (row: any, idx: number) => {
          if (+row.id === +oddsInfo.point_id) {
            Object.assign(
              (sourceData as any[])[index].team[idx],
              { point: oddsInfo.point },
            )
          }
          // const teamInfo = data.data.team.find((t: any) => {
          //   return +t.id === +row.id
          // })
          // if (teamInfo) {
          //   Object.assign(
          //     (crudData.value as any[])[idxxx].team[index],
          //     teamInfo,
          //   )
          // }
        },
      )
    }
  }
  return {
    pushOddsInfo,
  }
}
