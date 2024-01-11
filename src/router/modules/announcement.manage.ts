import type { RouteRecordRaw } from 'vue-router'
import { i18n } from '@/i18n'
const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw = {
  path: '/announcement-manage',
  component: Layout,
  redirect: '/announcement-manage/announcement-manage',
  name: 'AnnouncementManage',
  meta: {
    title: i18n.global.t('router.announcement-manage'),
    icon: 'sidebar-breadcrumb',
    auth: 'announcement-manage-f',
  },
  children: [
    {
      path: 'announcement-manage',
      name: 'announcementManage',
      component: () => import('@/views/announcement-manage/announcement-manage/index.vue'),
      meta: {
        title: i18n.global.t('router.announcement-manage'),
        icon: 'sidebar-breadcrumb',
        auth: 'announcement-manage-old',
      },
    },
  ],
}

export default routes
