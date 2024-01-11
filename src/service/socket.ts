import io from 'socket.io-client'
import { ElNotification } from 'element-plus'
import socketEdge from './scoketEdge'
import { getLocal } from '@/utils/storage'
import useUserStore from '@/store/modules/user'
import { i18n } from '@/i18n'
interface DataType {
  room_type: string
  message_type: string
  content: any
}

const finishTypeList = [
  '',
  i18n.global.t('table.score'),
  i18n.global.t('table.play_time'),
  i18n.global.t('lib.win_lose_1'),
]
export default function webSocketService(proxy?: any) {
  const {
    close,
    disconnect,
    error,
    connectError,
    reconnectFailed,
    reconnectError,
    reconnectAttempt,
    reconnecting,
    reconnect,
    connectTimeout,
    ping,
    pong,
    joinRoomCallBack,
    leaveRoomCallBack,
  } = socketEdge()
  const socket = io(import.meta.env.VITE_APP_SOCKET_API, {
    transports: ['websocket'],
    auth: {
      token: getLocal('token') || '123',
    },
  })

  socket.on('ping', ping)
  socket.on('pong', pong)
  socket.on('close', close)
  socket.on('connect', initRoomConnect)
  socket.on('disconnect', disconnect)
  socket.on('connect-error', connectError)
  socket.on('error', error)
  socket.on('reconnect-failed', reconnectFailed)
  socket.on('reconnect-error', reconnectError)
  socket.on('reconnect-attempt', reconnectAttempt)
  socket.on('reconnecting', reconnecting)
  socket.on('reconnect', reconnect)
  socket.on('connect-timeout', connectTimeout)
  socket.on('joinRoomCallBack', joinRoomCallBack)
  socket.on('leaveRoomCallBack', leaveRoomCallBack)
  socket.on('roomMessageCallBack', roomMessageCallBack)

  const route = useRoute()

  const router = useRouter()

  const { roles } = storeToRefs(useUserStore())

  /**
   * @description 加入房间
   * @param room_type 房间类型
   * @param handicap_id 房间id
   * */
  function joinRoom(room_type: string) {
    if (!socket.connected) {
      return
    }
    socket.emit('RoomJoin', {
      room_type,
    })
  }

  /**
   * @description 初始化房间连接
   * */
  function initRoomConnect(name = 'room_type_operate_push') {
    joinRoom(name)
  }

  /**
   * @description 离开房间
   * @param room_type 房间类型
   * @param handicap_id 房间id
   * */
  function leaveRoom(room_type: string, handicap_id?: number) {
    if (!socket.connected) {
      return
    }
    socket.emit('RoomLeave', {
      room_type,
      handicap_id,
    })
  }
  /**
   * @description 接收信息后的操作
   * @param data {type:DataType} 推送的数据
   * */
  function roomMessageCallBack(data: DataType) {
    switch (data.message_type) {
      // 赔率变换
      case 'message_type_push_point_change':
        if (
          !data.content
          || +(route.query?.game_id || 0) !== +data.content.game_id
        ) {
          return
        }
        proxy.mittBus.emit('fixLiveMonitorBus', {
          type: 'message_type_push_point_change',
          data: data.content,
        })
        break
      // 拒单（注单内容）
      case 'message_trader_rejects_order_push':
        if (!data.content) {
          return false
        }
        if (
          data.content
          && +(route.query?.game_id || 0) !== +data.content.game_id
        ) {
          return
        }
        proxy.mittBus.emit(`pushBetData${data.content.winner}`, {
          type: 'message_trader_rejects_order_push',
          data: data.content,
        })
        break
      case 'message_trader_rejects_order_auto_accept_push':
        if (!data.content) {
          return false
        }
        proxy.mittBus.emit(`pushBetData${data.content.winner}`, {
          type: 'message_trader_rejects_order_auto_accept_push',
          data: data.content,
        })
        break

      case 'message_trader_game_admin_taken_push':
        if (!data.content) {
          return false
        }
        if (
          data.content
          && +(route.query?.game_id || 0) !== +data.content.game_id
        ) {
          return
        }
        proxy.mittBus.emit('fixLiveMonitorBus', {
          type: 'message_trader_game_admin_taken_push',
          data: data.content,
        })
        break
      case 'message_type_bet_item_single_lock':
        if (!data.content) {
          return false
        }
        if (
          data.content
          && +(route.query?.game_id || 0) !== +data.content.game_id
        ) {
          return
        }
        proxy.mittBus.emit('fixLiveMonitorBus', {
          type: 'message_type_bet_item_single_lock',
          data: data.content,
        })
        break
      case 'message_type_point_display_on':
        if (!data.content) {
          return false
        }
        if (
          data.content
          && +(route.query?.game_id || 0) !== +data.content.game_id
        ) {
          return
        }
        proxy.mittBus.emit('fixLiveMonitorBus', {
          type: 'message_type_point_display_on',
          data: data.content,
        })
        break
      case 'message_type_point_display_off':
        if (!data.content) {
          return false
        }
        if (
          data.content
          && +(route.query?.game_id || 0) !== +data.content.game_id
        ) {
          return
        }
        proxy.mittBus.emit('fixLiveMonitorBus', {
          type: 'message_type_point_display_on',
          data: data.content,
        })
        break
      case 'message_trader_edit_reject_time__push':
        if (!data.content) {
          return false
        }
        if (
          data.content
          && +(route.query?.game_id || 0) !== +data.content.game_id
        ) {
          return
        }
        proxy.mittBus.emit('gameInfoSettingBus', {
          type: 'message_trader_edit_reject_time__push',
          data: data.content,
        })
        break
      case 'message_type_game_play_edit':
        if (!data.content) {
          return false
        }
        if (
          data.content
          && +(route.query?.game_id || 0) !== +data.content.game_id
        ) {
          return
        }
        proxy.mittBus.emit('gameInfoSettingBus', {
          type: 'message_type_game_play_edit',
          data: data.content,
        })
        break
      case 'message_type_team_score_set':
        if (!data.content) {
          return false
        }
        if (
          data.content
          && +(route.query?.game_id || 0) !== +data.content.game_id
        ) {
          return
        }
        proxy.mittBus.emit('gameInfoSettingBus', {
          type: 'message_type_team_score_set',
          data: data.content,
        })
        break
      case 'message_trader_profit_loss_value_push':
        if (!data.content) {
          return false
        }
        if (
          data.content
          && +(route.query?.game_id || 0) !== +data.content.game_id
        ) {
          return
        }
        proxy.mittBus.emit('fixLiveMonitorBus', {
          type: 'message_trader_profit_loss_value_push',
          data: data.content,
        })
        break
      case 'message_type_game_play_set_recommend':
        if (!data.content) {
          return false
        }
        if (
          data.content
          && +(route.query?.game_id || 0) !== +data.content.game_id
        ) {
          return
        }
        proxy.mittBus.emit('fixLiveMonitorBus', {
          type: 'message_type_game_play_set_recommend',
          data: data.content,
        })
        break
      case 'message_type_handicap_edit':
        if (!data.content) {
          return false
        }
        if (
          data.content
          && +(route.query?.game_id || 0) !== +data.content.game_id
        ) {
          return
        }
        proxy.mittBus.emit('fixLiveMonitorBus', {
          type: 'message_type_handicap_edit',
          data: data.content,
        })
        break
      case 'message_time_to_time_project_push':
        if (!data.content || route.name !== 'ProgressBetList') {
          return false
        }
        proxy.mittBus.emit('progressBetListBus', data.content)
        break
      case 'message_type_diff_result_set':
        // eslint-disable-next-line no-case-declarations
        const hasPer = roles.value.includes('settle:normal:finishSetThree')
        if (data.content && hasPer) {
          ElNotification({
            title: i18n.global.t('table.enter_final_results'),
            message: `
              <div>${i18n.global.t('table.event_name')}: <strong>${
              data.content.event_name
            }</strong></div>
              <div>${i18n.global.t('table.team_vs')}: <strong>${
              data.content.vs_info
            }</strong></div>
              <div>${i18n.global.t('table.round_name')}: <strong>${
              data.content.match
            }</strong></div>
              <div>${i18n.global.t('table.finish_type')}: <strong>${
              finishTypeList[+data.content.type || 0]
            }</strong></div>
            `,
            dangerouslyUseHTMLString: true,
            position: 'bottom-right',
            type: 'warning',
            duration: 0,
            onClick() {
              const routePage = router.resolve({
                name: 'normaHandicapSettle',
                query: {
                  game_id: data.content.game_id,
                  match: data.content.match,
                  type: data.content.type,
                  event_name: data.content.event_name,
                  vs_info: data.content.vs_info,
                },
              })
              window.open(routePage.href, '_blank')
            },
          })
        }
        break
    }
  }
  return {
    initRoomConnect,
    leaveRoom,
  }
}
