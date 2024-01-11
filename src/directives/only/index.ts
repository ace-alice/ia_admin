import useUserStore from '@/store/modules/user'
const userStore = useUserStore()

export default function permission(el: Node, binding: { value: any }) {
  const { value } = binding
  const roles = userStore.roles
  // return true;
  if (value && value instanceof String) {
    const permissionRoles: any = value

    const hasPermission = roles.includes(permissionRoles)

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
