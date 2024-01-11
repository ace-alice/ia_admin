import type { RouteRecordRaw } from 'vue-router'
import { i18n } from '@/i18n'
const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/user-manage',
  component: Layout,
  redirect: '/user-manage/user-list',
  name: 'userManage',
  meta: {
    title: i18n.global.t('router.user-manage'),
    icon: 'sidebar-breadcrumb',
    auth: 'user-manage',
  },
  children: [
    {
      path: 'user-list',
      name: 'userList',
      component: () =>
        import('@/views/user-manage/user-list/index.vue'),
      meta: {
        title: i18n.global.t('router.user-list'),
        icon: 'sidebar-breadcrumb',
        auth: 'user-list',
        cache: true,
      },
    },
    {
      path: 'user-group',
      name: 'userGroup',
      component: () =>
        import('@/views/user-manage/user-group/index.vue'),
      meta: {
        title: i18n.global.t('router.user-group'),
        icon: 'sidebar-breadcrumb',
        auth: 'user-group',
        cache: true,
      },
    },
    {
      path: 'user-ip-list',
      name: 'userIpList',
      component: () =>
        import('@/views/user-manage/user-ip-list/index.vue'),
      meta: {
        title: i18n.global.t('router.user-ip-list'),
        icon: 'sidebar-breadcrumb',
        auth: 'user-ip-list',
        cache: true,
      },
    },
  ],
}

export default routes
