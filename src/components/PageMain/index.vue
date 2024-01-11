<script lang="ts" setup name="PageMain">
import type { Ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  collaspe: {
    type: Boolean,
    default: false,
  },
  hasTool: {
    type: Boolean,
    default: false,
  },
  hasSearch: {
    type: Boolean,
    default: true,
  },
  hasFooter: {
    type: Boolean,
    default: false,
  },
})

const collaspeData = ref(props.collaspe)
function toggleCollaspe() {
  collaspeData.value = !collaspeData.value
}
const searchHeight = ref(0)

const searchBoxRef: Ref<HTMLDivElement | null> = ref(null)

onMounted(() => {
  nextTick(() => {
    if (searchBoxRef.value) {
      searchHeight.value = searchBoxRef.value.clientHeight
    }
  })
})
</script>

<template>
  <div class="page-main" :style="{ '--search-height': searchHeight }">
    <div
      class="search-box"
      :class="{
        'is-collaspe': collaspeData,
      }"
    >
      <div ref="searchBoxRef" class="search-content">
        <div class="search-title">
          <div>{{ title }}</div>
          <el-icon v-if="hasSearch" class="search-up" @click.stop="toggleCollaspe">
            <svg-icon name="ep:caret-bottom" />
          </el-icon>
        </div>
        <div class="search-group">
          <slot name="searchBox" />
        </div>
      </div>
    </div>
    <div v-if="hasTool" class="page-tool">
      <slot name="pageTool" />
    </div>
    <div class="page-body">
      <slot name="pageBody" />
    </div>
    <div class="tatol-body">
      <slot name="tatolBody" />
    </div>
    <div v-if="hasFooter" class="has-footer">
      <slot name="pageFooter" />
    </div>
    <slot name="other" />
  </div>
</template>

<style lang="scss" scoped>
.page-main {
  position: relative;
  margin: 10px;
  padding: 10px;
  background-color: var(--g-app-bg);
  transition: background-color 0.3s;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 52px);

  & > div + div {
    margin-top: 10px;
  }

  .page-body {
    width: 100%;
    flex-grow: 1;
    overflow: hidden;
    border-radius: 6px;
    box-shadow: 0 0 2px var(--g-header-bg) inset;
  }

  .page-footer,
  .page-tool {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .is-collaspe {
    height: calc(var(--search-height) * 1px) !important;

    .search-up {
      transform: rotateZ(180deg);
    }
  }

  .search-box {
    overflow: hidden;
    height: 30px;
    transition: height 0.1s linear;
    flex-shrink: 0;
    border-radius: 6px;

    .search-group {
      padding: 20px 10px 0;
    }

    .search-title {
      height: 30px;
      padding: 0 10px;
      line-height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      border-radius: 6px;

      .search-up {
        height: 24px;
        width: 24px;
        transition: all 0.2s ease-in-out;
      }

      &:hover {
        box-shadow: 0 0 2px var(--g-header-bg) inset;
      }
    }
  }

  .has-footer {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
  }
}
</style>
