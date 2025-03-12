import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import toast from 'react-hot-toast'
import { RedeemRequestService } from 'src/api/AdminApi'
import { RedeemRequestData } from 'src/api/v3/models'


let timeOut: any

const useRedeemRequestStore = create(
  combine(
    {
      history: {
        id: null as any,
        list: [] as any,
        total: 0,
        page: 0,
        size: 10,
        search: null as string | null,
        paginate: true as boolean,
        user_id: null as string | null
      }
    },
    (set, get) => ({
      get: {
        list: async () => {
          const {
            history: { page, size, search, paginate, user_id }
          } = get()

          toast.promise(
            RedeemRequestService.list({
              query: { page: `${page}`, size: `${size}`, user: `${user_id}` }
            }),
            {
              loading: 'fetching...',
              success: res => {
                set(prev => ({
                  history: {
                    ...prev.history,
                    list: res?.data,
                    total: res?.meta?.total
                  }
                }))
                return res?.message || 'fetched'
              },
              error: err => {
                return err?.message?.message
              }
            }
          )
        },
        paginate: ({
          page,
          size,
          search,
          paginate,
          user_id
        }: {
          page?: number
          size?: number
          search?: string
          paginate?: boolean
          user_id?: string
        }) => {
          set(prev => ({ history: { ...prev.history, search: search || '' } }))

          clearTimeout(timeOut)

          const init = () => {
            set(prev => ({
              history: {
                ...prev.history,
                page: page || prev.history.page,
                size: size || prev.history.size,
                search: search || prev.history.search,
                user_id: user_id || '',
                paginate: paginate ?? true,
              }
            }))
            useRedeemRequestStore.getState().get.list()
          }

          if (search) {
            timeOut = setTimeout(() => {
              init()
            }, 200)
            set(prev => ({ history: { ...prev.history, search: search } }))
            return
          }
          init()
        }
      },
      select: (id: any) => set(prev => ({ history: { ...prev.history, id: id } })),
      add: async (bodyData: any) => {
        let id = get().history.id

        if (id) {
          if (typeof bodyData.image == 'string') {
            delete bodyData.image
          }


          if (typeof bodyData.qr == 'string') {
            delete bodyData.qr
          }
        }

        return await toast.promise(
          id
            ? RedeemRequestService.update({
              query: {
                id: id
              },
              formData: bodyData
            })
            : RedeemRequestService.create({
              formData: bodyData,
            }),
          {
            loading: id ? 'Updating' : 'Adding',
            success: res => {
              useRedeemRequestStore.getState().get.paginate({})
              return res?.message
            },
            error: err => {
              return err?.message
            }
          }
        )
      },
    })
  )
)

export default useRedeemRequestStore
