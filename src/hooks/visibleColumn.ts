import type { Ref } from 'vue'
import { ref } from 'vue'
import type { ElTable } from 'element-plus'
import { type TableColumnCtx } from 'element-plus'

export default function visibleColumn() {
  const tableRef = ref<InstanceType<typeof ElTable>>()

  const columnInfo: Ref<
    Array<{ property: string; label: string; show: boolean }>
  > = ref([])

  function filterHeaderColumn({ column }: { column: TableColumnCtx<any> }) {
    const cellInfo = columnInfo.value.find((cell) => {
      return cell.property === column.property
    })
    if (!cellInfo && column.property) {
      columnInfo.value.push({
        show: true,
        property: column.property,
        label: column.label,
      })
    }
    return {}
  }

  function getColumnShow(property: string) {
    const cellInfo = columnInfo.value.find((cell) => {
      return cell.property === property
    })
    if (cellInfo) {
      return cellInfo.show
    }
    else {
      return true
    }
  }

  return { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
}
