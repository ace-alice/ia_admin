<script lang="ts" setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import usEn from 'element-plus/es/locale/lang/en'
import hotkeys from 'hotkeys-js'
import eventBus from './utils/eventBus'
import { getLocal } from './utils/storage'
import useSettingsStore from '@/store/modules/settings'
import useUserStore from '@/store/modules/user'

const settingsStore = useSettingsStore()

const currentLangId = getLocal('lang') || 1

const buttonConfig = ref({
  autoInsertSpace: true,
})

const userStore = useUserStore()
// 侧边栏主导航当前实际宽度
const mainSidebarActualWidth = computed(() => {
  let actualWidth = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--g-main-sidebar-width'),
  )
  if (['head', 'single'].includes(settingsStore.menu.menuMode)) {
    actualWidth = 0
  }
  return `${actualWidth}px`
})

// 侧边栏次导航当前实际宽度
const subSidebarActualWidth = computed(() => {
  let actualWidth = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--g-sub-sidebar-width'),
  )
  if (settingsStore.menu.subMenuCollapse) {
    actualWidth = 64
  }
  return `${actualWidth}px`
})

watch(
  () => settingsStore.app.colorScheme,
  () => {
    if (settingsStore.app.colorScheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
    else {
      document.documentElement.classList.remove('dark')
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => settingsStore.mode,
  () => {
    if (settingsStore.mode === 'pc') {
      settingsStore.$patch((state) => {
        state.menu.subMenuCollapse = settingsStore.subMenuCollapseLastStatus
      })
    }
    else if (settingsStore.mode === 'mobile') {
      settingsStore.$patch((state) => {
        state.menu.subMenuCollapse = true
      })
    }
    document.body.setAttribute('data-mode', settingsStore.mode)
  },
  {
    immediate: true,
  },
)

watch(
  () => settingsStore.menu.menuMode,
  () => {
    document.body.setAttribute('data-menu-mode', settingsStore.menu.menuMode)
  },
  {
    immediate: true,
  },
)

function setDocTitle() {
  if (settingsStore.app.enableDynamicTitle && settingsStore.title) {
    const title
      = typeof settingsStore.title === 'function'
        ? settingsStore.title()
        : settingsStore.title
    document.title = `${title} - ${userStore.systemInfo.page_title || import.meta.env.VITE_APP_TITLE}`
  }
  else {
    document.title = userStore.systemInfo.page_title || import.meta.env.VITE_APP_TITLE
  }
}

watch([() => settingsStore.app.enableDynamicTitle, () => settingsStore.title], () => {
  setDocTitle()
})

onMounted(async () => {
  settingsStore.setMode(document.documentElement.clientWidth)
  window.onresize = () => {
    settingsStore.setMode(document.documentElement.clientWidth)
  }
  hotkeys('alt+i', () => {
    eventBus.emit('global-system-info-toggle')
  })
  await userStore.getSystemInfo()
  setDocTitle()
})
</script>

<template>
  <el-config-provider
    :locale="+currentLangId === 1 ? zhCn : usEn"
    :size="settingsStore.app.elementSize"
    :button="buttonConfig"
  >
    <RouterView
      :style="{
        '--g-main-sidebar-actual-width': mainSidebarActualWidth,
        '--g-sub-sidebar-actual-width': subSidebarActualWidth,
      }"
    />
    <system-info />
  </el-config-provider>
</template>
