import type { RouteRecordRaw } from 'vue-router'
import { i18n } from '@/i18n'
const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/base-data-manage',
  component: Layout,
  redirect: '/base-data-manage/team-manage',
  name: 'baseDataManage',
  meta: {
    title: i18n.global.t('router.competition-data'),
    icon: 'sidebar-breadcrumb',
    auth: 'base-data-manage',
  },
  children: [
    {
      path: 'team-manage',
      name: 'teamManage',
      component: () => import('@/views/base-data-manage/team-manage/index.vue'),
      meta: {
        title: i18n.global.t('router.team-manage'),
        icon: 'sidebar-breadcrumb',
        auth: 'team-manage',
        cache: true,
      },
    },
    {
      path: 'game-manage',
      name: 'gameManage',
      component: () => import('@/views/base-data-manage/game-manage/index.vue'),
      meta: {
        title: i18n.global.t('router.game-manage'),
        icon: 'sidebar-breadcrumb',
        auth: 'game-manage',
        cache: true,
      },
    },
    {
      path: 'event-manage',
      name: 'eventManage',
      component: () =>
        import('@/views/base-data-manage/event-manage/index.vue'),
      meta: {
        title: i18n.global.t('router.competition-manage'),
        icon: 'sidebar-breadcrumb',
        auth: 'event-manage',
        cache: true,
      },
    },
    {
      path: 'play-manage',
      name: 'playManage',
      component: () => import('@/views/base-data-manage/play-manage/index.vue'),
      meta: {
        title: i18n.global.t('router.play-manage'),
        icon: 'sidebar-breadcrumb',
        auth: 'play-manage',
        cache: true,
      },
    },
    {
      path: 'rule-manage',
      name: 'ruleManage',
      component: () => import('@/views/base-data-manage/rule-manage/index.vue'),
      meta: {
        title: i18n.global.t('router.play-rule-manage'),
        icon: 'sidebar-breadcrumb',
        auth: 'rule-manage',
        cache: true,
      },
    },
    {
      path: 'data-source-play-list',
      name: 'dataSourcePlayList',
      component: () => import('@/views/base-data-manage/data-source-play-list/index.vue'),
      meta: {
        title: i18n.global.t('router.data-source-play-list'),
        icon: 'sidebar-breadcrumb',
        auth: 'data-source-play-list',
        // cache: true,
      },
    },
  ],
}

export default routes
