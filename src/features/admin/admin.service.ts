import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import toast from 'react-hot-toast'
import { AdminService } from 'src/api/v3'

export type Admin = AsyncReturnType<typeof AdminService.adminList>['data'][0]
////
let timeOut: any

const path = '/admins'

const useAdminStore = create(
  combine(
    {
      admin: {
        id: null as any,
        list: [] as Admin[],
        total: 0,
        page: 0,
        size: 10,
        search: null as string | null,
        paginate: true as boolean
        // timeOut: null as any
      }
    },
    (set, get) => ({
      get: {
        list: async () => {
          const {
            admin: { page, size, search, paginate }
          } = get()

          toast.promise(AdminService.adminList({ query: { page: `${page}`, size: `${size}` } }), {
            loading: 'fetching...',
            success: res => {
              console.log('🚀 ~ toast.promise ~ res:', res)
              set(prev => ({
                admin: {
                  ...prev.admin,
                  list: res?.data,
                  total: res?.meta?.total
                }
              }))
              return res?.message || 'fetched'
            },
            error: err => {
              return err
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
          set(prev => ({ admin: { ...prev.admin, search: search || '' } }))

          clearTimeout(timeOut)

          const init = () => {
            set(prev => ({
              admin: {
                ...prev.admin,
                page: page || prev.admin.page,
                size: size || prev.admin.size,
                search: search || prev.admin.search,
                paginate: paginate ?? true
              }
            }))
            useAdminStore.getState().get.list()
          }

          if (search) {
            timeOut = setTimeout(() => {
              init()
            }, 1000)
            set(prev => ({ admin: { ...prev.admin, search: search } }))
            return
          }
          init()
        }
      },
      select: (id: any) => set(prev => ({ admin: { ...prev.admin, id: id } })),
      add: async (bodyData: any) => {
        let id = get().admin.id

        toast.promise(
          id
            ? AdminService.adminUpdate({ query: { id: id }, requestBody: bodyData })
            : AdminService.adminCreate({ requestBody: bodyData }),
          {
            loading: id ? 'Updating' : 'Adding',
            success: res => {
              useAdminStore.getState().get.paginate({})
              return res?.message
            },
            error: err => {
              return err?.message
            }
          }
        )
      },
      delete: async () => {
        let id = get().admin.id

        if (!id) return toast.error('No plan to delete')

        toast.promise(AdminService.adminDelete({ query: { id: id } }), {
          loading: 'deleting',
          success: res => {
            useAdminStore.getState().get.paginate({})
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

export default useAdminStore
