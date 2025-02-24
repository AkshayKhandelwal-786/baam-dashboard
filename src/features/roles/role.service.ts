import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import toast from 'react-hot-toast'
import { RoleService } from 'src/api/AdminApi'
import { RoleData } from 'src/api/v3/models'

export type Role = RoleData['responses']['List']['data'][0]

export type Abilities = 1 | 2 | 3 | 4

export type Ability = Abilities[]

export interface Permission {
  [module: string]: ModulePermission
}

export interface ModulePermission {
  ids: Array<number | string>
  ability: Ability
  can?: (mId: number, gIds: number[]) => boolean
  moduleId?: number
  gameIds?: number[]
  read?: boolean
  write?: boolean
  update?: boolean
  del?: boolean
}

let timeOut: any

const path = '/roles'

const useRoleStore = create(
  combine(
    {
      role: {
        id: null as any,
        list: [] as unknown as Role[],
        total: 0,
        page: 0,
        size: 10,
        search: null as string | null,
        paginate: true as boolean,
        detail: undefined as Role | undefined,
        isUser: false as boolean
        // timeOut: null as any
      }
    },
    (set, get) => ({
      get: {
        list: async () => {
          const {
            role: { page, size, search, paginate }
          } = get()

          toast.promise(RoleService.list({ query: { page: `${page}`, size: `${size}` } }), {
            loading: 'fetching...',
            success: res => {
              set(prev => ({
                role: {
                  ...prev.role,
                  list: res.data,
                  total: res?.meta?.total
                }
              }))
              return res?.message || 'fetched'
            },
            error: err => {
              return 'err'
            }
          })
        },
        paginate: ({
          page,
          size,
          search,
          paginate
        }: {
          page?: number
          size?: number
          search?: string
          paginate?: boolean
        }) => {
          set(prev => ({ role: { ...prev.role, search: search || '' } }))

          clearTimeout(timeOut)

          const init = () => {
            set(prev => ({
              role: {
                ...prev.role,
                page: page || prev.role.page,
                size: size || prev.role.size,
                search: search || prev.role.search,
                paginate: paginate ?? true
              }
            }))
            useRoleStore.getState().get.list()
          }

          if (search) {
            timeOut = setTimeout(() => {
              init()
            }, 1000)
            set(prev => ({ role: { ...prev.role, search: search } }))
            return
          }
          init()
        },
        detail: async (id?: number | string, data?: Role, isUser?: boolean) => {
          set(prev => ({
            ...prev,
            role: {
              ...prev.role,
              detail: data,
              id: data?._id,
              isUser: !!isUser
            }
          }))
        }
      },
      select: (id: any) => set(prev => ({ role: { ...prev.role, id: id } })),
      add: async (bodyData: any) => {
        let id = get().role.id
        let isUser = get().role.isUser

        toast.promise(
          id
            ? RoleService.update({
                query: { id: id },
                requestBody: bodyData
              })
            : RoleService.create({
                requestBody: bodyData
              }),
          {
            loading: id ? 'Updating' : 'Adding',
            success: res => {
              console.log('🚀 ~ add: ~ res:', res)
              useRoleStore.getState().get.paginate({})
              return res?.message
            },
            error: err => {
              console.log('🚀 ~ add: ~ err:', err)
              return err?.message
            }
          }
        )
      },
      delete: async () => {
        let id = get().role.id

        if (!id) return toast.error('No plan to delete')
        console.log('🚀 ~ delete: ~ id:', id)

        toast.promise(RoleService.delete({ query: { id: id } }), {
          loading: 'deleting',
          success: res => {
            useRoleStore.getState().get.paginate({})
            return res?.message
          },
          error: err => {
            return err?.message
          }
        })
      }
    })
  )
)

export default useRoleStore
