<script lang="ts" setup>
import type { PropType } from 'vue'
import { defineProps } from 'vue'
const props = defineProps({
  columnInfo: {
    type: Array as PropType<
      Array<{ property: string; label: string; show: boolean }>
    >,
    default: () => [],
  },
})

function handleClick() {
  props.columnInfo?.forEach((column: any) => {
    column.show = true
  })
}
</script>

<template>
  <el-dropdown
    split-button
    type="primary"
    size="small"
    popper-class="filter-column"
    trigger="click"
    @click="handleClick"
  >
    ALL
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="column in columnInfo" :key="column.property">
          <el-checkbox
            v-model="column.show"
            :label="column.label"
            size="large"
          />
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
