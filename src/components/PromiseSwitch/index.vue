<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getLabel } from '@/utils'

function changeName() {}

export default defineComponent({
  props: {
    options: {
      required: true,
      type: Array,
      default: () => [],
    },
    initValue: {
      type: [String, Number],
      default: 0,
    },
    activeValue: {
      type: [String, Number],
      default: 1,
    },
    inactiveValue: {
      type: [String, Number],
      default: 0,
    },
    paramKey: { required: true, type: String, default: 'status' },
    defaultParam: {
      required: true,
      type: Object,
      default: () => {},
    },
    emitFunName: { required: true, type: String, default: 'emitFunName' },
    changeFun: {
      required: true,
      type: Function,
      default: changeName,
    },
    permission: { type: String, default: '' },
  },
  setup(props) {
    const statusValue = ref(props.initValue)

    const loading = ref(false)

    // 获取反值

    function getReverseValue(value: any) {
      return +value === +props.activeValue
        ? props.inactiveValue
        : props.activeValue
    }

    async function beforeChange(): Promise<boolean> {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        loading.value = true
        const isSuccess = await props.changeFun(
          props.emitFunName,
          Object.assign(props.defaultParam, {
            [props.paramKey]: getReverseValue(statusValue.value),
          }),
        )
        if (isSuccess) {
          resolve(true)
        }
        else {
          resolve(false)
        }
        loading.value = false
      })
    }

    return { statusValue, getLabel, beforeChange, loading }
  },
})
</script>

<template>
  <span class="promise-switch">
    <el-switch
      v-model="statusValue"
      v-only="permission"
      :active-value="activeValue"
      :inactive-value="inactiveValue"
      :loading="loading"
      :before-change="beforeChange"
    />
    <el-tag type="warning" effect="plain">{{
      getLabel(statusValue, options, 'data')
    }}</el-tag>
  </span>
</template>

<style lang="scss" scoped>
.promise-switch {
  position: relative;
  .wimple {
    position: absolute;
    // background-color: #ff000030;
    height: 100%;
    width: 100%;
    // z-index: 100;
    bottom: 0;
  }
}
:deep(.el-tag) {
  margin-left: 5px;
}
</style>
