<script setup lang="ts" name="keepAliveBar">
import { ElScrollbar, ElTag } from 'element-plus'
import useKeepAliveStore from '@/store/modules/keepAlive'

const keepAliveStore = useKeepAliveStore()

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

const elTagRef = ref<InstanceType<typeof ElTag>[]>()

const route = useRoute()

const router = useRouter()

function changeRouter(path: any) {
  router.push(path)
}

watch(() => route.path, (newVal) => {
  const idx = keepAliveStore.list.findIndex((item) => {
    return newVal === item.path
  })
  if (idx !== -1) {
    let width = 0
    if (Array.isArray(elTagRef.value)) {
      elTagRef.value.forEach((tagRef, index) => {
        if (index <= idx) {
          width += tagRef.$el.clientWidth
        }
      })
    }
    scrollbarRef.value && scrollbarRef.value.setScrollLeft((width % scrollbarRef.value.$el.clientWidth) / 2)
  }
}, { deep: true })

function closeRouter(name: any) {
  keepAliveStore.remove(name)
  if (name === route.name && keepAliveStore.list.length > 0) {
    router.push(keepAliveStore.list[0].path)
  }
}
</script>

<template>
  <div class="keep-alive">
    <ElScrollbar ref="scrollbarRef">
      <div class="keep-alive-box">
        <ElTag
          v-for="item in keepAliveStore.list"
          ref="elTagRef"
          :key="item.name"
          :type="route.path === item.path ? '' : 'info'"
          closable
          effect="dark"
          @click="changeRouter(item.path)"
          @close="closeRouter(item.name)"
        >
          {{ item.title }}
        </ElTag>
      </div>
    </ElScrollbar>
  </div>
</template>

<style scoped lang="scss">
.keep-alive{
  width: calc(100% - 20px);
  margin: auto;
  overflow: hidden;
}
.keep-alive-box {
  height: 24px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  .el-tag{
    cursor: pointer;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
}
</style>
