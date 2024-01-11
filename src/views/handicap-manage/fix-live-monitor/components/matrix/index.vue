<script lang="ts" setup>
import { ref } from 'vue'
const activeName = ref('')
</script>

<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="赔率变化折线图" name="chart" />
  </el-tabs>
</template>

<style scoped lang="scss"></style>
