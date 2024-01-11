import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import mitt from 'mitt'
import App from './App.vue'
import pinia from './store'
import router from './router'
import useSettingsStore from './store/modules/settings'
import { i18n } from '@/i18n'

// 自定义指令
import directive from '@/utils/directive'
// 加载 svg 图标
import 'virtual:svg-icons-register'
// 全局样式
import '@/assets/styles/globals.scss'
// 加载 iconify 图标（element plus）
import { downloadAndInstall } from '@/iconify-ep'

// 引入event-bus方法

const app = createApp(App)
// 注册全局 event mitt方法
app.config.globalProperties.mittBus = mitt()

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(i18n)
app.use(pinia)
app.use(router)
directive(app)
if (useSettingsStore().app.iconifyOfflineUse) {
  downloadAndInstall()
}

app.mount('#app')
