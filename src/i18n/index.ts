import { createI18n } from 'vue-i18n'
import nextZhcn from './lang/zh'
import nextEn from './lang/en'
import { getLocal } from '@/utils/storage'

// 定义语言国际化内容
const messages = {
  'zh-CN': nextZhcn,
  'en-US': nextEn,
}

const currentLangId = getLocal('lang') || 1

// 导出语言国际化
export const i18n = createI18n({
  legacy: false,
  locale: +currentLangId === 1 ? 'zh-CN' : 'en-US',
  fallbackLocale: +currentLangId === 1 ? 'zh-CN' : 'en-US',
  messages,
})
