import type { RouteRecordRaw } from 'vue-router'
import { i18n } from '@/i18n'
const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/risk-manage',
  component: Layout,
  redirect: '/risk-manage/global-parameter',
  name: 'RiskManage',
  meta: {
    title: i18n.global.t('router.risk-manage'),
    icon: 'sidebar-breadcrumb',
    auth: 'risk-manage',
  },
  children: [
    {
      path: 'global-parameter',
      name: 'globalParameter',
      component: () => import('@/views/risk-manage/global-parameter/index.vue'),
      meta: {
        title: i18n.global.t('router.global-parameter'),
        icon: 'sidebar-breadcrumb',
        auth: 'global-parameter',
      },
    },
    {
      path: 'level-manage',
      name: 'levelManage',
      component: () =>
        import('@/views/base-data-manage/level-manage/index.vue'),
      meta: {
        title: i18n.global.t('router.competition-level-manage'),
        icon: 'sidebar-breadcrumb',
        auth: 'level-manage',
        cache: true,
      },
    },
    {
      path: 'default-setting',
      name: 'defaultSetting',
      component: () =>
        import('@/views/base-data-manage/default-setting/index.vue'),
      meta: {
        title: i18n.global.t('router.default-setting'),
        icon: 'sidebar-breadcrumb',
        auth: 'default-setting',
        cache: true,
      },
    },
    {
      path: 'risk-tags',
      name: 'RiskTags',
      component: () =>
        import('@/views/risk-manage/risk-tags/index.vue'),
      meta: {
        title: i18n.global.t('router.risk-tags'),
        icon: 'sidebar-breadcrumb',
        auth: 'risk-tags',
        // cache: true,
      },
    },
    {
      path: 'risk-parameter',
      name: 'RiskParameter',
      component: () =>
        import('@/views/risk-manage/risk-parameter/index.vue'),
      meta: {
        title: i18n.global.t('router.risk-parameter'),
        icon: 'sidebar-breadcrumb',
        auth: 'risk-parameter',
        cache: true,
      },
    },
    {
      path: 'risk-user',
      name: 'RiskUser',
      component: () =>
        import('@/views/risk-manage/risk-user/index.vue'),
      meta: {
        title: i18n.global.t('router.risk-user'),
        icon: 'sidebar-breadcrumb',
        auth: 'risk-user',
        cache: true,
      },
    },
    {
      path: 'limit-ratio',
      name: 'LimitRatio',
      component: () =>
        import('@/views/risk-manage/limit-ratio/index.vue'),
      meta: {
        title: i18n.global.t('router.limit-ratio'),
        icon: 'sidebar-breadcrumb',
        auth: 'limit-ratio',
        cache: true,
      },
    },
  ],
}

export default routes
