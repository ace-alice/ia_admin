import type { RouteRecordRaw } from 'vue-router'
import { i18n } from '@/i18n'
const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/bet-manage',
  component: Layout,
  redirect: '/bet-manage/bet-list',
  name: 'betManage',
  meta: {
    title: i18n.global.t('router.bet-manage'),
    icon: 'sidebar-breadcrumb',
    auth: 'bet-manage',
  },
  children: [
    {
      path: 'bet-list',
      name: 'betList',
      component: () => import('@/views/bet-manage/bet-list/index.vue'),
      meta: {
        title: i18n.global.t('router.bet-list'),
        icon: 'sidebar-breadcrumb',
        auth: 'bet-list',
      },
    },
    {
      path: 'bet-void-review',
      name: 'betVoidReview',
      component: () => import('@/views/bet-manage/bet-void-review/index.vue'),
      meta: {
        title: i18n.global.t('router.bet-void-review'),
        icon: 'sidebar-breadcrumb',
        auth: 'bet-void-review',
      },
    },
    {
      path: 'progress-bet-list',
      name: 'ProgressBetList',
      component: () => import('@/views/bet-manage/progress-bet-list/index.vue'),
      meta: {
        title: i18n.global.t('router.progress-bet-list'),
        icon: 'sidebar-breadcrumb',
        auth: 'bet-list',
        hidden: true,
      },
    },
  ],
}

export default routes
