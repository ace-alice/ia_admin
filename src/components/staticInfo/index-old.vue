<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { pendingInfo } from '@/api/handicap-manage/champoin-list'
import auditSource from '@/assets/audio/alert_unsettle.mp3'
import { i18n } from '@/i18n'
export default defineComponent({
  setup() {
    const dialogVisible = ref(false)

    const info = ref<any>({})

    const selfControl = ref(false)

    const activeName = ref('pending_abort')

    const openDialog = (title: string) => {
      dialogVisible.value = !dialogVisible.value
      activeName.value = title
    }

    function getInfo() {
      pendingInfo()
        .then((res: any) => {
          if (+res.code === 1) {
            info.value = res.data
          }
        })
        .finally(() => {
          setTimeout(() => {
            getInfo()
          }, 10000)
        })
    }

    const infoList = computed(() => {
      return Object.keys(info.value).map((keyl) => {
        return {
          name: keyl,
          list: info.value[keyl].info,
          total: info.value[keyl].total,
        }
      })
    })

    const voidNum = computed(() => {
      let count = 0
      Object.keys(info.value).forEach((keyL) => {
        if (['pending_abort', 'champion_pending_abort'].includes(keyL)) {
          if (!Number.isNaN(Number(info.value[keyL].total))) {
            count += Number(info.value[keyL].total)
          }
        }
      })
      return count
    })

    const setWinnerNum = computed(() => {
      let count1 = 0
      let count2 = 0
      Object.keys(info.value).forEach((keyL) => {
        if (['pending_set_winner', 'pending_confirm'].includes(keyL)) {
          if (!Number.isNaN(Number(info.value[keyL].total))) {
            count1 += Number(info.value[keyL].total)
          }
        }
        if (
          ['champion_pending_set_winner', 'champion_pending_confirm'].includes(
            keyL,
          )
        ) {
          if (!Number.isNaN(Number(info.value[keyL].total))) {
            count2 += Number(info.value[keyL].total)
          }
        }
      })
      return `${count1}/${count2}`
    })

    const earlyStopGame = computed(() => {
      if (info.value.early_stop_game) {
        return info.value.early_stop_game.total || 0
      }
      else {
        return 0
      }
    })

    const earlyGameProfit = computed(() => {
      if (info.value.early_game_profit) {
        return info.value.early_game_profit.total || 0
      }
      else {
        return 0
      }
    })

    const earlyGameProjects = computed(() => {
      if (info.value.early_game_projects) {
        return info.value.early_game_projects.total || 0
      }
      else {
        return 0
      }
    })

    const championStopGame = computed(() => {
      if (info.value.champion_stop_game) {
        return info.value.champion_stop_game.total || 0
      }
      else {
        return 0
      }
    })

    const audioEle = new Audio(auditSource)

    audioEle.loop = true

    const audioSwitch = ref('off')

    watch(
      () => info.value,
      () => {
        const infoD: any[] = Object.values(info.value)
        if (infoD.length !== 0) {
          const isHas = infoD.some((inf: any) => {
            return (+inf || 0) > 0
          })
          if (isHas) {
            audioEle.volume = 1
          }
          else {
            audioEle.volume = 0
          }
        }
      },
      { deep: true },
    )

    function audioSwitchChange() {
      selfControl.value = true
      if (audioSwitch.value === 'on') {
        audioEle.play()
      }
      else {
        audioEle.pause()
      }
    }

    function isOpenSound() {
      ElMessageBox.confirm(i18n.global.t('other.is_turn_on_sound'), '', {
        confirmButtonText: i18n.global.t('table.turn_on'),
        cancelButtonText: i18n.global.t('crud.closure'),
        type: 'warning',
      })
        .then(() => {
          audioSwitch.value = 'on'
          audioEle.play()
        })
        .catch(() => {
          audioSwitch.value = 'off'
        })
    }

    onMounted(() => {
      getInfo()
      isOpenSound()
    })
    return {
      dialogVisible,
      activeName,
      openDialog,
      infoList,
      voidNum,
      setWinnerNum,
      earlyStopGame,
      earlyGameProfit,
      earlyGameProjects,
      audioSwitch,
      audioSwitchChange,
      championStopGame,
    }
  },
})
</script>

<template>
  <div class="drop-item">
    <el-radio-group
      v-model="audioSwitch"
      style="margin: 0 4px"
      size="small"
      @change="audioSwitchChange"
    >
      <el-radio-button label="on" />
      <el-radio-button label="off" />
    </el-radio-group>
    <el-button type="warning" text @click="openDialog('pending_abort')">
      {{ $t("other.cancelled") }}:<span>{{ voidNum }}</span>
    </el-button>
    <el-button type="danger" text @click="openDialog('pending_set_winner')">
      {{ $t("other.settlement") }}:<span>{{ setWinnerNum }}</span>
    </el-button>
    <el-button type="primary" text @click="openDialog('early_game_projects')">
      {{ $t("other.early_game_projects") }}:<span>{{ earlyGameProjects }}</span>
    </el-button>
    <el-button type="success" text @click="openDialog('early_game_profit')">
      {{ $t("other.early_game_profit") }}:<span>{{ earlyGameProfit }}</span>
    </el-button>
    <el-button type="info" text @click="openDialog('early_stop_game')">
      {{ $t("other.early_stop_game") }}:<span>{{ earlyStopGame }}</span>
    </el-button>
    <el-button type="info" text @click="openDialog('champion_stop_game')">
      {{ $t("other.champion_stop_game") }}:<span>{{ championStopGame }}</span>
    </el-button>
    <el-dialog
      v-model="dialogVisible"
      width="86%"
      append-to-body
      :title="$t(`other.${activeName}`)"
    >
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane
          v-for="infoV in infoList"
          :key="infoV.name"
          :name="infoV.name"
          lazy
        >
          <template #label>
            {{ $t(`other.${infoV.name}`) }}
            <span style="color: red">{{ infoV.total }}</span>
          </template>
          <el-table :data="infoV.list" style="width: 100%" height="500px">
            <el-table-column
              prop="game_id"
              label="Game Id"
              min-width="180"
              align="center"
            />
            <el-table-column
              prop="name"
              label="Name"
              min-width="180"
              align="center"
            />
            <el-table-column
              prop="count"
              label="count"
              min-width="180"
              align="center"
            />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.drop-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  span {
    font-size: 14px;
    color: #cfd3dc;
    margin: 0 5px;
  }
}
.el-button + .el-button {
  margin: 0;
}
.el-button {
  padding: 8px 8px;
}
</style>
