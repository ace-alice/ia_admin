import type { RouteRecordRaw } from 'vue-router'
import { i18n } from '@/i18n'
const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/financial-manage',
  component: Layout,
  redirect: '/financial-manage/account-change-list',
  name: 'financialManage',
  meta: {
    title: i18n.global.t('router.financial-manage'),
    icon: 'sidebar-breadcrumb',
    auth: 'financial-manage',
  },
  children: [
    {
      path: 'user-report',
      name: 'UserReport',
      component: () => import('@/views/financial-manage/user-report/index.vue'),
      meta: {
        title: i18n.global.t('router.user-report'),
        icon: 'sidebar-breadcrumb',
        // cache: true,
        auth: 'user-report',
      },
    },
    {
      path: 'account-change-list',
      name: 'accountChangeList',
      component: () =>
        import('@/views/financial-manage/account-change-list/index.vue'),
      meta: {
        title: i18n.global.t('router.account-change-list'),
        icon: 'sidebar-breadcrumb',
        auth: 'account-change-list',
      },
    },
    {
      path: 'company-report',
      name: 'companyReport',
      component: () =>
        import('@/views/financial-manage/company-report/index.vue'),
      meta: {
        title: i18n.global.t('router.company-report'),
        icon: 'sidebar-breadcrumb',
        auth: 'company-report',
      },
    },
    {
      path: 'odds-betting-report',
      name: 'oddsBettingReport',
      component: () =>
        import('@/views/financial-manage/odds-betting-report/index.vue'),
      meta: {
        title: i18n.global.t('router.odds-betting-report'),
        icon: 'sidebar-breadcrumb',
        auth: 'odds-betting-report',
      },
    },
    {
      path: 'in-play-sub-market-report',
      name: 'In-playSub-marketReport',
      component: () =>
        import('@/views/financial-manage/in-play-sub-market-report/index.vue'),
      meta: {
        title: i18n.global.t('router.in-play-sub-market-report'),
        icon: 'sidebar-breadcrumb',
        auth: 'in-play-sub-market-report',
      },
    },
    {
      path: 'bill-view',
      name: 'BillView',
      component: () => import('@/views/financial-manage/bill-view/index.vue'),
      meta: {
        title: i18n.global.t('router.bill-view'),
        icon: 'sidebar-breadcrumb',
        auth: 'bill-view',
      },
    },
    {
      path: 'charge-settlement-report-company',
      name: 'ChargeSettlementReportCompany',
      component: () =>
        import(
          '@/views/financial-manage/charge-settlement-report-company/index.vue'
        ),
      meta: {
        title: i18n.global.t('router.charge-settlement-report-company'),
        icon: 'sidebar-breadcrumb',
        cache: true,
        auth: 'charge-settlement-report-company',
      },
    },
    {
      path: 'charge-settlement-report-agent',
      name: 'ChargeSettlementReportAgent',
      component: () =>
        import(
          '@/views/financial-manage/charge-settlement-report-agent/index.vue'
        ),
      meta: {
        title: i18n.global.t('router.charge-settlement-report-agent'),
        icon: 'sidebar-breadcrumb',
        cache: true,
        auth: 'charge-settlement-report-agent',
      },
    },
    {
      path: 'bill-wallet',
      name: 'BillWallet',
      component: () => import('@/views/financial-manage/bill-wallet/index.vue'),
      meta: {
        title: i18n.global.t('router.bill-wallet'),
        icon: 'sidebar-breadcrumb',
        // cache: true,
        auth: 'bill-wallet',
      },
    },
    {
      path: 'game-report',
      name: 'GameReport',
      component: () => import('@/views/financial-manage/game-report/index.vue'),
      meta: {
        title: i18n.global.t('router.game-report'),
        icon: 'sidebar-breadcrumb',
        // cache: true,
        auth: 'game-report',
      },
    },
    {
      path: 'play-report',
      name: 'PlayReport',
      component: () => import('@/views/financial-manage/play-report/index.vue'),
      meta: {
        title: i18n.global.t('router.play-report'),
        icon: 'sidebar-breadcrumb',
        // cache: true,
        auth: 'play-report',
      },
    },
    {
      path: 'claim-log',
      name: 'ClaimLog',
      component: () => import('@/views/financial-manage/claim-log/index.vue'),
      meta: {
        title: i18n.global.t('router.claim-log'),
        icon: 'sidebar-breadcrumb',
        // cache: true,
        auth: 'claim-log',
      },
    },
    {
      path: 'game-statistics',
      name: 'GameStatistics',
      component: () => import('@/views/financial-manage/game-statistics/index.vue'),
      meta: {
        title: i18n.global.t('router.game-statistics'),
        icon: 'sidebar-breadcrumb',
        // cache: true,
        auth: 'game-statistics',
      },
    },
    //////
    {
      path: 'risk-report',
      name: 'RiskReport',
      component: () => import('@/views/financial-manage/risk-report/index.vue'),
      meta: {
        title: i18n.global.t('router.risk-report'),
        icon: 'sidebar-breadcrumb',
        // cache: true,
        auth: 'risk-report',
      },
    },
    {
      path: 'game-play-report',
      name: 'GamePlayReport',
      component: () => import('@/views/financial-manage/game-play-report/index.vue'),
      meta: {
        title: i18n.global.t('router.game-play-report'),
        icon: 'sidebar-breadcrumb',
        // cache: true,
        auth: 'game-play-report',
      },
    },
    //////
    // {
    //   path: 'finish-count-report',
    //   name: 'FinishCountReport',
    //   component: () => import('@/views/financial-manage/finish-count-report/index.vue'),
    //   meta: {
    //     title: i18n.global.t('router.finish-count-report'),
    //     icon: 'sidebar-breadcrumb',
    //     // cache: true,
    //     auth: 'finish-count-report',
    //   },
    // },
    {
      path: 'finish-report',
      name: 'FinishReport',
      component: () => import('@/views/financial-manage/finish-report/index.vue'),
      meta: {
        title: i18n.global.t('router.finish-report'),
        icon: 'sidebar-breadcrumb',
        // cache: true,
        auth: 'finish-report',
      },
    },
    // {
    //   path: 'two-setwinner-logs',
    //   name: 'TwoSetwinnerLogs',
    //   component: () => import('@/views/financial-manage/two-setwinner-logs/index.vue'),
    //   meta: {
    //     title: i18n.global.t('router.two-setwinner-logs'),
    //     icon: 'sidebar-breadcrumb',
    //     // cache: true,
    //     auth: 'two-setwinner-logs',
    //   },
    // },
    {
      path: 'refinish-report',
      name: 'RefinishReport',
      component: () => import('@/views/financial-manage/refinish-report/index.vue'),
      meta: {
        title: i18n.global.t('router.refinish-report'),
        icon: 'sidebar-breadcrumb',
        // cache: true,
        auth: 'refinish-report',
      },
    },
    ////
    {
      path: 'win-lose-day-report',
      name: 'WinLoseDayReport',
      component: () => import('@/views/financial-manage/win-lose-day-report/index.vue'),
      meta: {
        title: i18n.global.t('router.win-lose-day-report'),
        icon: 'sidebar-breadcrumb',
        // cache: true,
        auth: 'win-lose-day-report',
      },
    }, ////
    {
      path: 'win-lose-month-report',
      name: 'WinLoseMonthReport',
      component: () => import('@/views/financial-manage/win-lose-month-report/index.vue'),
      meta: {
        title: i18n.global.t('router.win-lose-month-report'),
        icon: 'sidebar-breadcrumb',
        // cache: true,
        auth: 'win-lose-month-report',
      },
    },
    {
      path: 'risk-detail',
      name: 'RiskDetail',
      component: () => import('@/views/financial-manage/risk-detail/index.vue'),
      meta: {
        title: i18n.global.t('router.risk-detail'),
        icon: 'sidebar-breadcrumb',
        hidden: true,
      },
    },
  ],
}

export default routes
