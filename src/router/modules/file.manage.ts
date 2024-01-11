import type { RouteRecordRaw } from 'vue-router'
import { i18n } from '@/i18n'
const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/file-manage',
  component: Layout,
  redirect: '/file-manage/file-list',
  name: 'fileManage',
  meta: {
    title: i18n.global.t('router.file-manage'),
    icon: 'sidebar-breadcrumb',
    auth: 'file-manage',
  },
  children: [
    {
      path: 'file-list',
      name: 'fileList',
      component: () => import('@/views/file-manage/file-list/index.vue'),
      meta: {
        title: i18n.global.t('router.file-list'),
        icon: 'sidebar-breadcrumb',
        auth: 'file-list',
      },
    },
    {
      path: 'file-recover',
      name: 'fileRecover',
      component: () => import('@/views/file-manage/file-recover/index.vue'),
      meta: {
        title: i18n.global.t('router.file-recycle'),
        icon: 'sidebar-breadcrumb',
        auth: 'file-recover',
      },
    },
    {
      path: 'download-center',
      name: 'downloadCenter',
      component: () => import('@/views/file-manage/download-center/index.vue'),
      meta: {
        title: i18n.global.t('router.download-center'),
        icon: 'sidebar-breadcrumb',
        auth: 'download-center',
      },
    },
    {
      path: 'file-group-manage',
      name: 'fileGroupManage',
      component: () =>
        import('@/views/file-manage/file-group-manage/index.vue'),
      meta: {
        title: i18n.global.t('router.group-manage'),
        icon: 'sidebar-breadcrumb',
        auth: 'file-group-manage',
      },
    },
  ],
}

export default routes
