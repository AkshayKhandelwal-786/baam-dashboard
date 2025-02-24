import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'
import { ModuleService } from 'src/api/v3'

export type Module = AsyncReturnType<typeof ModuleService.moduleList>['data'][0]

let timeOut: any

const path = '/modules'

const useModuleStore = create(
  combine(
    {
      module: {
        id: null as any,
        list: [] as Module[],
        total: 0,
        page: 0,
        size: 10,
        search: null as string | null,
        paginate: true as boolean,
        game_id: null as any,
        populate: 0 as number
        // timeOut: null as any
      }
    },
    (set, get) => ({
      get: {
        list: async () => {
          const {
            module: { page, size, search, paginate, game_id, populate }
          } = get()

          toast.promise(ModuleService.moduleList({ query: { page: `${page}`, size: `${size}` } }), {
            loading: 'fetching...',
            success: res => {
              console.log('module res: ', res)
              set(prev => ({
                module: {
                  ...prev.module,
                  list: res.data
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
          paginate,
          game_id,
          populate
        }: {
          page?: number
          size?: number
          search?: string
          paginate?: boolean
          game_id?: number
          populate?: number
        }) => {
          set(prev => ({ module: { ...prev.module, search: search || '' } }))

          clearTimeout(timeOut)

          const init = () => {
            set(prev => ({
              module: {
                ...prev.module,
                page: page || prev.module.page,
                size: size || prev.module.size,
                search: search || prev.module.search,
                game_id: game_id || prev.module.game_id,
                paginate: paginate ?? true,
                populate: populate ?? 0
              }
            }))
            useModuleStore.getState().get.list()
          }

          if (search) {
            timeOut = setTimeout(() => {
              init()
            }, 1000)
            set(prev => ({ module: { ...prev.module, search: search } }))
            return
          }
          init()
        }
      },
      select: (id: any) => set(prev => ({ module: { ...prev.module, id: id } })),
      add: async (bodyData: any) => {
        let id = get().module.id

        toast.promise(id ? Api.put(`${path}/${id}`, bodyData) : Api.post(path, bodyData), {
          loading: id ? 'Updating' : 'Adding',
          success: res => {
            useModuleStore.getState().get.paginate({})
            return res?.message
          },
          error: err => {
            return err
          }
        })
      },
      delete: async () => {
        let id = get().module.id

        if (!id) return toast.error('No plan to delete')

        toast.promise(Api.del(`${path}/${id}`), {
          loading: 'deleting',
          success: res => {
            useModuleStore.getState().get.paginate({})
            return res?.message
          },
          error: err => {
            return err
          }
        })
      }
    })
  )
)

export default useModuleStore
