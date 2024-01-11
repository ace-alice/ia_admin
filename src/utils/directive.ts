import type { App } from 'vue'
import { all, only, permission, some, tooltip, waves } from '@/directives'

export default function directive(app: App) {
  // 注册 v-auth 和 v-auth-all 指令
  app.directive('auth', {
    mounted: (el, binding) => {
      if (!useAuth().auth(binding.value)) {
        el.remove()
      }
    },
  })
  app.directive('auth-all', {
    mounted: (el, binding) => {
      if (!useAuth().authAll(binding.value)) {
        el.remove()
      }
    },
  })

  app.directive('all', all)

  app.directive('only', only)

  app.directive('permission', permission)

  app.directive('some', some)

  app.directive('waves', waves)

  app.directive('tooltip', tooltip)
}
