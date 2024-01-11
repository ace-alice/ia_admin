import type { RouteRecordRaw } from 'vue-router'
import { i18n } from '@/i18n'
const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/website-manage',
  component: Layout,
  redirect: '/website-manage/currency-list',
  name: 'websiteManage',
  meta: {
    title: i18n.global.t('router.website-manage'),
    icon: 'sidebar-breadcrumb',
    auth: 'website-manage',
  },
  children: [
    {
      path: 'currency-list',
      name: 'currencyList',
      component: () => import('@/views/website-manage/currency-list/index.vue'),
      meta: {
        title: i18n.global.t('router.currency-list'),
        icon: 'sidebar-breadcrumb',
        auth: 'currency-list',
      },
    },
    {
      path: 'announcement-manage',
      name: 'announcementManage',
      component: () => import('@/views/announcement-manage/announcement-manage/index.vue'),
      meta: {
        title: i18n.global.t('router.announcement-manage'),
        icon: 'sidebar-breadcrumb',
        auth: 'announcement-manage',
      },
    },
    {
      path: 'single-Wallet-log',
      name: 'SingleWalletLog',
      component: () => import('@/views/website-manage/single-wallet-log/index.vue'),
      meta: {
        title: i18n.global.t('router.single-Wallet-log'),
        icon: 'sidebar-breadcrumb',
        auth: 'single-Wallet-log',
      },
    },
    {
      path: 'e-sport-rule',
      name: 'eSportRule',
      component: () => import('@/views/website-manage/e-sport-rule/index.vue'),
      meta: {
        title: i18n.global.t('router.e-sport-rule'),
        icon: 'sidebar-breadcrumb',
        auth: 'e-sport-rule',
      },
    },
    {
      path: 'exchange-rate-update-log',
      name: 'ExchangeRateUpdateLog',
      component: () => import('@/views/website-manage/exchange-rate-update-log/index.vue'),
      meta: {
        title: i18n.global.t('router.exchange-rate-update-log'),
        icon: 'sidebar-breadcrumb',
        auth: 'exchange-rate-update-log',
      },
    },
    {
      path: 'domain-manage',
      name: 'DomainManage',
      component: () => import('@/views/website-manage/domain-manage/index.vue'),
      meta: {
        title: i18n.global.t('router.domain-manage'),
        icon: 'sidebar-breadcrumb',
        auth: 'domain-manage',
      },
    },
  ],
}

export default routes
