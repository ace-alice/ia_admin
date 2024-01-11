<script lang="ts">
import type { Ref } from 'vue'
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DatePickerType } from '@/components/dateComponents/lib/interface'
import { parseTime } from '@/utils/formatTime'

const datePickerType: DatePickerType = {
  datePicker: '{y}-{m}-{d}',
}
export default {
  name: 'DatePickerQuery',
  props: {
    startKey: {
      type: String,
      default: 'startTime',
    },
    endKey: {
      type: String,
      default: 'endTime',
    },
    valueFormat: {
      type: String,
      default: 'X',
    },
    formatType: {
      type: String,
      default: datePickerType.datePicker,
    },
    propTime: {
      type: Array,
      default: () => [],
    },
    isToQuery: {
      type: Boolean,
      default: false,
    },
    defaultTime: {
      type: String,
      default: '',
    },
  },
  emits: ['setTime', 'search'],
  setup(props: any, { emit }: any) {
    const { proxy } = getCurrentInstance() as any
    const createTime: Ref<any> = ref([])
    const i18n = useI18n()

    const shortcutsOptions = ref([
      {
        text: i18n.t('table.today'),
        value: (() => {
          const end = new Date()
          const start = new Date()
          return [start, end]
        })(),
      },
      {
        text: i18n.t('table.yesterday'),
        value: (() => {
          const end = new Date()
          end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
          return [start, end]
        })(),
      },
      {
        text: i18n.t('table.recent_week'),
        value: (() => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          return [start, end]
        })(),
      },
      {
        text: i18n.t('table.recent_month'),
        value: (() => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          return [start, end]
        })(),
      },
      {
        text: i18n.t('table.recent_season'),
        value: (() => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          return [start, end]
        })(),
      },
    ])

    watch(
      () => props.propTime,
      (newVal) => {
        if (newVal && newVal.length > 0) {
          for (const i of newVal) {
            if (!i) {
              createTime.value = []
            }
            else {
              createTime.value = newVal
            }
          }
        }
      },
    )

    function timeChangeHandle() {
      let parma: any = {
        [props.startKey]: null,
        [props.endKey]: null,
      }
      if (createTime.value && createTime.value.length === 2) {
        if (createTime.value[0] && createTime.value[1]) {
          if (props.formatType === datePickerType.datePicker) {
            parma = {
              [props.startKey]: parseTime(
                createTime.value[0],
                datePickerType.datePicker,
              ),
              [props.endKey]: parseTime(
                createTime.value[1],
                datePickerType.datePicker,
              ),
            }
          }
          else {
            parma = {
              [props.startKey]: createTime.value[0],
              [props.endKey]: createTime.value[1],
            }
          }
        }
        else {
          createTime.value = []
        }
      }

      emit('setTime', parma)
      search()
    }
    function chartChange(e: any) {
      proxy.$forceUpdate(e)
    }
    function search() {
      if (props.isToQuery) {
        emit('search')
      }
    }
    onMounted(() => {
      if (props.propTime && props.propTime.length === 2) {
        if (props.propTime[0] && props.propTime[1]) {
          createTime.value = [
            new Date(props.propTime[0] as any),
            new Date(props.propTime[1] as any),
          ]
        }
        else {
          switch (props.defaultTime) {
            case 'today':
              createTime.value = shortcutsOptions.value[0].value
              timeChangeHandle()
              break
            case 'yesterday':
              createTime.value = shortcutsOptions.value[1].value
              timeChangeHandle()
              break
            case 'week':
              createTime.value = shortcutsOptions.value[2].value
              timeChangeHandle()
              break
            case 'month':
              createTime.value = shortcutsOptions.value[3].value
              timeChangeHandle()
              break
          }
        }
      }
    })
    return {
      shortcutsOptions,
      createTime,
      timeChangeHandle,
      chartChange,
      // eslint-disable-next-line vue/no-dupe-keys
      valueFormat: props.valueFormat,
    }
  },
}
</script>

<template>
  <!-- 用法 -->
  <!-- <datePickerQuery
            @setTime="crudSetQueryKey"
            :propTime="[crudQuery.startTime, crudQuery.endTime]"
            :isToQuery="true"
            defaultTime="week"
            @search="toQuery"
          /> -->
  <el-date-picker
    ref="datepicker"
    v-model="createTime"
    type="daterange"
    unlink-panels
    :value-format="valueFormat"
    :range-separator="$t('table.to')"
    :start-placeholder="$t('table.start_date')"
    :end-placeholder="$t('table.end_date')"
    class="max-Width-class"
    :shortcuts="shortcutsOptions"
    @change="timeChangeHandle"
  />
</template>

<style lang="scss" scoped>
.max-Width-class {
  max-width: 100px;
  min-width: 100px;
}
</style>
