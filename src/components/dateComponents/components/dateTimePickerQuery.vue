<script lang="ts">
import type { Ref } from 'vue'
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DatePickerType } from '@/components/dateComponents/lib/interface'
import { parseTime } from '@/utils/formatTime'
const datePickerType: DatePickerType = {
  dateTimePicker: '{y}-{m}-{d} {h}:{i}:{s}',
}
export default {
  name: 'DatePickerQuery',
  props: {
    startKey: {
      type: String,
      default: 'start_time',
    },
    isQueryForm: {
      type: Boolean,
      default: true,
    },
    disabledDate: {
      type: Function,
      default: null,
    },
    endKey: {
      type: String,
      default: 'end_time',
    },
    pickerType: {
      type: String,
      default: 'datetimerange',
    },
    valueFormat: {
      type: String,
      default: 'X',
    },
    formatType: {
      type: String,
      default: datePickerType.dateTimePicker,
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
          const start = new Date(
            `${parseTime(new Date(), '{y}-{m}-{d}')} 00:00:00`,
          )
          const end = new Date(
            `${parseTime(new Date(), '{y}-{m}-{d}')} 23:59:59`,
          )
          return [start, end]
        })(),
      },
      {
        text: i18n.t('table.yesterday'),
        value: (() => {
          const start = new Date(
            `${parseTime(
              new Date().getTime() - 3600 * 1000 * 24 * 1,
              '{y}-{m}-{d}',
            )} 00:00:00`,
          )
          const end = new Date(
            `${parseTime(
              new Date().getTime() - 3600 * 1000 * 24 * 1,
              '{y}-{m}-{d}',
            )} 23:59:59`,
          )
          return [start, end]
        })(),
      },
      {
        text: i18n.t('table.recent_week'),
        value: (() => {
          const start = new Date(
            `${parseTime(
              new Date().getTime() - 3600 * 1000 * 24 * 7,
              '{y}-{m}-{d}',
            )} 00:00:00`,
          )
          const end = new Date(
            `${parseTime(new Date(), '{y}-{m}-{d}')} 23:59:59`,
          )
          return [start, end]
        })(),
      },
      {
        text: i18n.t('table.recent_month'),
        value: (() => {
          let start: any = new Date(
            `${parseTime(
              new Date().getTime() - 3600 * 1000 * 24 * 30,
              '{y}-{m}-{d}',
            )} 00:00:00`,
          )
          let end: any = new Date(
            `${parseTime(new Date(), '{y}-{m}-{d}')} 23:59:59`,
          )
          if (props.pickerType === 'monthrange') {
            start = `${parseTime(
              new Date().getTime() - 3600 * 1000 * 24 * 90,
              '{y}-{m}',
            )}`
            end = `${parseTime(new Date(), '{y}-{m}')}`
          }
          return [start, end]
        })(),
      },
      {
        text: i18n.t('table.recent_season'),
        value: (() => {
          let start: any = new Date(
            `${parseTime(
              new Date().getTime() - 3600 * 1000 * 24 * 90,
              '{y}-{m}-{d}',
            )} 00:00:00`,
          )
          let end: any = new Date(
            `${parseTime(new Date(), '{y}-{m}-{d}')} 23:59:59`,
          )
          if (props.pickerType === 'monthrange') {
            start = `${parseTime(
              new Date().getTime() - 3600 * 1000 * 24 * 90,
              '{y}-{m}',
            )}`
            end = `${parseTime(new Date(), '{y}-{m}')}`
          }
          return [start, end]
        })(),
      },
    ])

    watch(
      () => props.propTime,
      (newVal) => {
        if (newVal && newVal.length > 0) {
          if (props.isQueryForm) {
            for (const i of newVal) {
              if (!i) {
                createTime.value = []
              }
              else {
                createTime.value = newVal
              }
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
          if (props.valueFormat) {
            parma = {
              [props.startKey]: createTime.value[0],
              [props.endKey]: createTime.value[1],
            }

            emit('setTime', parma)
            search()
            return
          }
          if (props.formatType === datePickerType.dateTimePicker) {
            parma = {
              [props.startKey]: parseTime(
                createTime.value[0],
                datePickerType.dateTimePicker,
              ),
              [props.endKey]: parseTime(
                createTime.value[1],
                datePickerType.dateTimePicker,
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
      pickerType: props.pickerType,
      // eslint-disable-next-line vue/no-dupe-keys
      valueFormat: props.valueFormat,
      // eslint-disable-next-line vue/no-dupe-keys
      disabledDate: props.disabledDate,
    }
  },
}
</script>

<template>
  <!-- 用法 -->
  <!-- <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            :propTime="[crudQuery.startTime, crudQuery.endTime]"
            :isToQuery="true"
            defaultTime="week"
            @search="toQuery"
          /> -->
  <el-date-picker
    ref="datetimepicker"
    v-model="createTime"
    :type="pickerType"
    unlink-panels
    :value-format="valueFormat"
    :range-separator="$t('table.to')"
    :start-placeholder="$t('table.start_date')"
    :end-placeholder="$t('table.end_date')"
    class="max-Width-class"
    :disabled-date="disabledDate"
    :shortcuts="shortcutsOptions"
    :default-time="[
      new Date(2000, 1, 1, 0, 0, 0),
      new Date(2000, 2, 1, 23, 59, 59),
    ]"
    @change="timeChangeHandle"
  />
</template>

<style lang="scss" scoped>
.max-Width-class {
  max-width: 100px;
  min-width: 100px;
}
</style>
