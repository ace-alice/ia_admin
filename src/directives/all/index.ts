import useUserStore from '@/store/modules/user'
const userStore = useUserStore()

export default function permission(el: Node, binding: { value: any }) {
  const { value } = binding
  const roles = userStore.roles
  if (value && Array.isArray(value) && value.length > 0) {
    const permissionRoles = value

    const hasPermission = roles.every((role: string) => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
  else {
    // throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    if (!roles.includes(value)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
