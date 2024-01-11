import { ElMessage } from 'element-plus'
import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { list, roleLists } from '@/api/auth-manage/role-config'

export default function RoleListHook() {
  const roleList: Ref<any[]> = ref([])

  function getRoleList() {
    roleLists()
      .then((result: any) => {
        if (result.code === 1) {
          roleList.value = result.data
        }
        else {
          ElMessage({
            type: 'warning',
            message: '角色列表获取失败',
          })
        }
      })
      .catch(() => {
        ElMessage({
          type: 'warning',
          message: '角色列表获取失败',
        })
      })
  }

  function setRoleName(id: number) {
    let name = '未分配'
    if (+id === 0) {
      return 'superAdmin'
    }
    if (roleList.value.length > 0) {
      roleList.value.forEach((role: any) => {
        if (+role.role_id === +id) {
          name = role.role_name
        }
      })
    }
    return name
  }

  // onMounted(() => {
  //   getRoleList()
  // })

  return { roleList, getRoleList, setRoleName }
}
