import type { RouteRecordRaw } from 'vue-router'
import { i18n } from '@/i18n'
const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/handicap-manage',
  component: Layout,
  redirect: '/handicap-manage/handicap-list',
  name: 'handicapManage',
  meta: {
    title: i18n.global.t('router.handicap-manage'),
    icon: 'sidebar-breadcrumb',
    auth: 'handicap-manage',
  },
  children: [
    {
      path: 'handicap-list',
      name: 'handicapList',
      component: () =>
        import('@/views/handicap-manage/handicap-list/index.vue'),
      meta: {
        title: i18n.global.t('router.handicap-list'),
        icon: 'sidebar-breadcrumb',
        auth: 'handicap-list',
        cache: true,
      },
    },
    {
      path: 'fix-live-monitor',
      name: 'fixLiveMonitor',
      component: () =>
        import('@/views/handicap-manage/fix-live-monitor/index.vue'),
      meta: {
        title: i18n.global.t('router.fix-live-monitor'),
        icon: 'sidebar-breadcrumb',
        auth: 'fix-live-monitor',
        hidden: true,
      },
    },
    {
      path: 'champion-list',
      name: 'championList',
      component: () =>
        import('@/views/handicap-manage/champion-list/index.vue'),
      meta: {
        title: i18n.global.t('router.champion-monitor'),
        icon: 'sidebar-breadcrumb',
        auth: 'champion-list',
        hidden: true,
      },
    },
    {
      path: 'normal-handicap-settle',
      name: 'normaHandicapSettle',
      component: () =>
        import('@/views/handicap-manage/normal-handicap-settle/index.vue'),
      meta: {
        title: i18n.global.t('router.normal-handicap-settle'),
        icon: 'sidebar-breadcrumb',
        auth: 'normal-handicap-settle',
        hidden: true,
      },
    },
    {
      path: 'champion-handicap-settle',
      name: 'championHandicapSettle',
      component: () =>
        import('@/views/handicap-manage/champion-handicap-settle/index.vue'),
      meta: {
        title: i18n.global.t('router.champion-handicap-settle'),
        icon: 'sidebar-breadcrumb',
        auth: 'champion-handicap-settle',
        hidden: true,
      },
    },
  ],
}

export default routes
