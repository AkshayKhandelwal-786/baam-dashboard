import { ModulePermission } from 'src/features/roles/role.service'

declare global {
  interface GlobalProps extends ModulePermission {
    // Add more global props as needed
  }
  type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R>
    ? R
    : any
}
