import type { RouteRecordRaw } from 'vue-router'
import { i18n } from '@/i18n'
const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/partner-manage',
  component: Layout,
  redirect: '/partner-manage/company-manage',
  name: 'PartnerManage',
  meta: {
    title: i18n.global.t('router.partner-manage'),
    icon: 'sidebar-breadcrumb',
    auth: 'partner-manage',
  },
  children: [
    {
      path: 'company-manage',
      name: 'CompanyManage',
      component: () => import('@/views/partner-manage/company-manage/index.vue'),
      meta: {
        title: i18n.global.t('router.company-manage'),
        icon: 'sidebar-breadcrumb',
        auth: 'company-manage',
      },
    },
    {
      path: 'admin-account',
      name: 'AdminAccount',
      component: () => import('@/views/partner-manage/admin-account/index.vue'),
      meta: {
        title: i18n.global.t('router.admin-account'),
        icon: 'sidebar-breadcrumb',
        auth: 'admin-account',
      },
    },
    {
      path: 'proxy-manage',
      name: 'ProxyManage',
      component: () => import('@/views/partner-manage/proxy-manage/index.vue'),
      meta: {
        title: i18n.global.t('router.proxy-manage'),
        icon: 'sidebar-breadcrumb',
        auth: 'proxy-manage',
      },
    },
  ],
}

export default routes
