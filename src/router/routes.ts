import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import type { RouteRecordRaw } from 'vue-router'
import handicapManage from './modules/handicap.manage'
import baseDataManage from './modules/base.data.manage'
import authManage from './modules/auth.manage'
import fileManage from './modules/file.manage'
import userManage from './modules/user.manage'
import betManage from './modules/bet.manage'
import handicapRecord from './modules/handicap.record'
import websiteManage from './modules/website.manage'
import financialManage from './modules/financial.manage'
import riskManage from './modules/risk.manage'
import announcementManage from './modules/announcement.manage'
import partnerManage from './modules/partner.manage'
import type { Route } from '#/global'
import useSettingsStore from '@/store/modules/settings'
import { i18n } from '@/i18n'

// 固定路由（默认路由）
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: i18n.global.t('lib.login'),
    },
  },
  {
    path: '/limit',
    name: 'ipLimit',
    component: () => import('@/views/error/ip-limit.vue'),
    meta: {
      title: i18n.global.t('router.ip-limit'),
    },
  },
  {
    path: '/:all(.*)*',
    name: 'notFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: i18n.global.t('router.notFound'),
    },
  },
]

// 系统路由
const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/index.vue'),
    meta: {
      title: () => useSettingsStore().home.title,
      breadcrumb: false,
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: () => useSettingsStore().home.title,
          breadcrumb: false,
        },
      },
      {
        path: 'reload',
        name: 'reload',
        component: () => import('@/views/reload.vue'),
        meta: {
          title: '重新加载',
          breadcrumb: false,
        },
      },
      {
        path: 'setting',
        name: 'personalSetting',
        component: () => import('@/views/personal/index.vue'),
        meta: {
          title: i18n.global.t('router.personal-settings'),
        },
      },
      {
        path: '/upload-config',
        name: 'uploadConfig',
        component: () => import('@/views/file-manage/upload-config/index.vue'),
        meta: {
          title: '上传配置',
        },
      },
    ],
  },
]

// 动态路由（异步路由、导航栏路由）
const asyncRoutes: Route.recordMainRaw[] = [
  {
    meta: {
      title: '操盘管理',
      icon: 'sidebar-default',
      // auth: 'handicap-manage',
    },
    children: [handicapManage],
  },
  {
    meta: {
      title: '用户管理',
      icon: 'sidebar-default',
      // auth: 'handicap-manage',
    },
    children: [userManage],
  },
  {
    meta: {
      title: '注单管理',
      icon: 'sidebar-default',
      // auth: 'bet-manage',
    },
    children: [betManage],
  },
  {
    meta: {
      title: '风控管理',
      icon: 'sidebar-default',
      // auth: 'handicap-manage',
    },
    children: [riskManage],
  },
  {
    meta: {
      title: '盘口记录',
      icon: 'sidebar-default',
      // auth: 'handicap-record',
    },
    children: [handicapRecord],
  },
  {
    meta: {
      title: '财务管理',
      icon: 'sidebar-default',
      // auth: 'financial-manage',
    },
    children: [financialManage],
  },
  {
    meta: {
      title: '赛事数据',
      icon: 'sidebar-default',
      // auth: 'handicap-manage',
    },
    children: [baseDataManage],
  },
  {
    meta: {
      title: '后台管理',
      icon: 'sidebar-default',
      // auth: 'auth-manage',
    },
    children: [authManage],
  },
  {
    meta: {
      title: '文件管理',
      icon: 'sidebar-default',
      // auth: 'handicap-manage',
    },
    children: [fileManage],
  },
  {
    meta: {
      title: '网站管理',
      icon: 'sidebar-default',
      // auth: 'handicap-manage',
    },
    children: [websiteManage],
  },
  {
    meta: {
      title: '公告管理',
      icon: 'sidebar-default',
      // auth: 'handicap-manage',
    },
    children: [announcementManage],
  },
  {
    meta: {
      title: '合作伙伴',
      icon: 'sidebar-default',
      // auth: 'handicap-manage',
    },
    children: [partnerManage],
  },
]

const constantRoutesByFilesystem = generatedRoutes.filter((item) => {
  return item.meta?.enabled !== false && item.meta?.constant === true
})

const asyncRoutesByFilesystem = setupLayouts(
  generatedRoutes.filter((item) => {
    return (
      item.meta?.enabled !== false
      && item.meta?.constant !== true
      && item.meta?.layout !== false
    )
  }),
)

export {
  constantRoutes,
  systemRoutes,
  asyncRoutes,
  constantRoutesByFilesystem,
  asyncRoutesByFilesystem,
}
