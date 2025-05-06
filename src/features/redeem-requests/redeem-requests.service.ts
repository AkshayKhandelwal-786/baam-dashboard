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
        filter: null as string | null
      }
    },
    (set, get) => ({
      get: {
        list: async () => {

          const keyword = typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('keyword') || ''
          : ''


          const {
            history: { page, size, search, paginate }
          } = get()


          try {
            const res = await RedeemRequestService.list({
              query: { page: `${page}`, size: `${size}`, keyword }
            })
          
            set(prev => ({
              history: {
                ...prev.history,
                list: res?.data,
                total: res?.meta?.total,
                keyword
              }
            }))
          } catch (err: any) {
            console.error('Fetch error:', err?.message || err)
          }
        },
        paginate: ({
          page,
          size,
          search,
          paginate,
          filter
        }: {
          page?: number
          size?: number
          search?: string
          paginate?: boolean
          filter?: string
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
                filter: filter || '',
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
              return "Redeem Request status changed successfully."
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
