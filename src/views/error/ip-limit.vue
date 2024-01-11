<route lang="yaml">
name: ipLimit
meta:
  title: 找不到页面
  constant: true
  layout: false
      </route>

<script lang="ts" setup>
//
</script>

<template>
  <div class="notfound" name="ipLimit">
    <svg-icon name="404" class="icon" />
    <div class="content">
      <h1>{{ $t('router.ip-limit') }}</h1>
    </div>
  </div>
</template>

      <style lang="scss" scoped>
      .notfound {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        width: 700px;

        @include position-center(xy);

        .icon {
          width: 400px;
          height: 400px;
        }

        .content {
          h1 {
            margin: 0;
            font-size: 48px;
            color: var(--el-text-color-primary);
          }

          .desc {
            margin: 20px 0 30px;
            font-size: 20px;
            color: var(--el-text-color-secondary);
          }
        }
      }
      </style>

