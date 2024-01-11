// 该文件为系统默认配置，请勿修改！！！

import type { RecursiveRequired, Settings } from '#/global'

const globalSettingsDefault: RecursiveRequired<Settings.all> = {
  app: {
    colorScheme: 'dark',
    elementSize: 'default',
    iconifyOfflineUse: true,
    enablePermission: true,
    enableProgress: true,
    enableDynamicTitle: true,
    routeBaseOn: 'frontend',
  },
  home: {
    enable: false,
    title: 'Home',
  },
  layout: {
    enableMobileAdaptation: true,
  },
  menu: {
    baseOn: 'frontend',
    menuMode: 'single',
    switchMainMenuAndPageJump: true,
    subMenuUniqueOpened: true,
    subMenuCollapse: false,
    enableSubMenuCollapseButton: true,
    enableHotkeys: true,
  },
  topbar: {
    mode: 'fixed',
  },
  toolbar: {
    enableFullscreen: true,
    enablePageReload: true,
    enableColorScheme: true,
    enableAppSetting: true,
  },
  breadcrumb: {
    enable: true,
  },
  navSearch: {
    enable: true,
    enableHotkeys: true,
  },
  copyright: {
    enable: false,
    dates: '2022-xx',
    company: 'IA ESPORT',
    website: 'https://demo.ilustretest.com/',
    beian: '',
  },
}

export default globalSettingsDefault
