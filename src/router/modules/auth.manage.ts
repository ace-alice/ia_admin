import type { RouteRecordRaw } from 'vue-router'
import { i18n } from '@/i18n'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/auth-manage',
  component: Layout,
  redirect: '/auth-manage/menu-manage',
  name: 'authManage',
  meta: {
    title: i18n.global.t('router.backstage-manage'),
    icon: 'sidebar-breadcrumb',
    auth: 'auth-manage',
  },
  children: [
    {
      path: 'menu-manage',
      name: 'menuManage',
      component: () => import('@/views/auth-manage/menu-manage/index.vue'),
      meta: {
        title: i18n.global.t('router.menu-manage'),
        icon: 'sidebar-breadcrumb',
        auth: 'menu-manage',
      },
    },
    {
      path: 'role-manage',
      name: 'roleManage',
      component: () => import('@/views/auth-manage/role-manage/index.vue'),
      meta: {
        title: i18n.global.t('router.role-manage'),
        icon: 'sidebar-breadcrumb',
        auth: 'role-manage',
      },
    },
    {
      path: 'admin-manage',
      name: 'adminManage',
      component: () => import('@/views/auth-manage/admin-manage/index.vue'),
      meta: {
        title: i18n.global.t('router.admin-manage'),
        icon: 'sidebar-breadcrumb',
        auth: 'admin-manage',
      },
    },
    {
      path: 'operate-history',
      name: 'operateHistory',
      component: () => import('@/views/auth-manage/operate-history/index.vue'),
      meta: {
        title: i18n.global.t('router.operate-history'),
        icon: 'sidebar-breadcrumb',
        auth: 'operate-history',
      },
    },
    {
      path: 'create-dict',
      name: 'createDict',
      component: () => import('@/views/auth-manage/create-dict/index.vue'),
      meta: {
        title: i18n.global.t('router.create-dict'),
        icon: 'sidebar-breadcrumb',
        auth: 'menu-manage',
      },
    },
    {
      path: 'create-dict-group',
      name: 'createDictGroup',
      component: () => import('@/views/auth-manage/create-dict-group/index.vue'),
      meta: {
        title: i18n.global.t('router.create-dict-group'),
        icon: 'sidebar-breadcrumb',
        auth: 'menu-manage',
      },
    },
  ],
}

export default routes
