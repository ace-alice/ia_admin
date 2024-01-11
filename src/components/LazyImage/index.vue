<script lang="ts" name="lazy-image">
import errImg from '../../assets/images/logo-single.png'
export default {
  name: 'LazyImage',
  props: {
    imgUrl: {
      type: String,
      default: '',
    },
    errImg: {
      type: String,
      default: () => errImg,
    },
    fitType: { type: String, default: 'contain' },
  },

  setup() {},
}
</script>

<template>
  <div class="lazy-image">
    <el-image :src="imgUrl" fit="contain">
      <template #error>
        <img :src="errImg" alt="">
      </template>
      <template #placeholder>
        <div />
      </template>
    </el-image>
  </div>
</template>

<style scoped lang="scss">
::v-deep(.el-image) {
  display: block;
  width: 100%;
  height: 100%;
  background: none;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
