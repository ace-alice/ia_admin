import type { RouteRecordRaw } from 'vue-router'
import { i18n } from '@/i18n'
const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/handicap-record',
  component: Layout,
  redirect: '/handicap-record/invalid-record',
  name: 'handicapRecord',
  meta: {
    title: i18n.global.t('router.handicap-record'),
    icon: 'sidebar-breadcrumb',
    auth: 'handicap-record',
  },
  children: [
    {
      path: 'invalid-record',
      name: 'invalidRecord',
      component: () => import('@/views/handicap-record/invalid-record/index.vue'),
      meta: {
        title: i18n.global.t('router.invalid-record'),
        icon: 'sidebar-breadcrumb',
        auth: 'invalid-record',
      },
    },
  ],
}

export default routes
