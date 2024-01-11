import type { RouteRecordName, RouteRecordNormalized } from 'vue-router'

interface keepItem {
  path: string
  name?: any
  title: any
}

const useKeepAliveStore = defineStore(
  // 唯一ID
  'keepAlive',
  {
    state: () => ({
      list: [] as keepItem[],
    }),
    getters: {
      keepAliveList: (state) => {
        return state.list.map((rout: keepItem) => {
          return rout.name || ''
        })
      },
    },
    actions: {
      add(route: RouteRecordNormalized) {
        const isHas = this.list.some((rout: keepItem) => {
          return rout.path === route.path
        })
        if (!isHas) {
          this.list.unshift({
            path: route.path,
            name: route.name,
            title: route.meta?.title,
          })
        }
      },
      remove(componentName: RouteRecordName | undefined) {
        this.list = this.list.filter((rout: keepItem) => {
          return rout.name !== componentName
        })
      },
      clean() {
        this.list = []
      },
    },
  },
)

export default useKeepAliveStore
