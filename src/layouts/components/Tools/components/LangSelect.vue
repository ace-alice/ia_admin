<script setup lang="ts">
import { getLocal, setLocal } from '@/utils/storage'

const langOptions = [
  { code: 'zh_cn', id: 1, name: '简体中文' },
  { code: 'us_en', id: 2, name: 'English' },
]

const currentLangId = ref(getLocal('lang') || 1)

const currentLangName = computed(() => {
  return langOptions.find((lang) => {
    return +lang.id === +currentLangId.value
  })?.name || ''
})

function handleCommand(command: number) {
  currentLangId.value = command
  setLocal('lang', currentLangId.value)
  window.location.reload()
}
</script>

<template>
  <el-dropdown class="item" popper-class="filter-column" @command="handleCommand">
    <span class="el-dropdown-link">
      {{ currentLangName }}
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in langOptions" :key="item.id" :command="item.id"
          :disabled="+currentLangId === +item.id"
        >
          {{ item.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.item{
  margin: 0 20px;
}
</style>
