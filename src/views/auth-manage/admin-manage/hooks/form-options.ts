import { i18n } from '@/i18n'

export const roleStatus = [
  { label: '全部', data: -1 },
  { label: '开启', data: 0 },
  { label: '禁用', data: 1 },
]

// 是否
export const isNot = ref([
  { label: i18n.global.t('lib.yes'), value: 1 },
  { label: i18n.global.t('lib.no'), value: 0 },
])
