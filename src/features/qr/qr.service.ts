import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'
// import { Competition } from '../competitions/competition.service'
import { QrData } from 'src/api/v3/models'
import { QrService } from 'src/api/AdminApi'

export type QR = QrData['responses']['List']['data'][0]

export interface CompTeam {
  competition: object
  player: object
}

export interface Country {
  id: number
  name: string
  created_at: string
  updated_at: string
}

let timeOut: any

const useQrStore = create(
  combine(
    {
      qr: {
        id: null as any,
        list: [] as QR[],
        total: 0,
        page: 0,
        size: 10,
        search: null as string | null,
        paginate: true as boolean,
        filter: null as string | null,
        detail: null as QR | null   
      }
    },
    (set, get) => ({
      get: {
        list: async () => {
          const keyword = typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('keyword') || ''
            : ''

          const {
            qr: { page, size, search, paginate }
          } = get()

          try {
            const res = await QrService.list({
              query: { page: `${page}`, size: `${size}`, keyword }
            })
          
            set(prev => ({
              qr: {
                ...prev.qr,
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
          set(prev => ({ qr: { ...prev.qr, search: search || '' } }))

          clearTimeout(timeOut)

          const init = () => {
            set(prev => ({
              qr: {
                ...prev.qr,
                page: page ?? prev.qr.page,
                size: size || prev.qr.size,
                search: search || prev.qr.search,
                paginate: paginate ?? true,
                filter: filter || null
              }
            }))
            useQrStore.getState().get.list()
          }

          if (search) {
            timeOut = setTimeout(() => {
              init()
            }, 200)
            set(prev => ({ qr: { ...prev.qr, search: search } }))
            return
          }
          init()
        },
        detail: async (_id: any) => {

          try {
            const res = QrService.detail({
              query: {
                id: _id
              },
            });

            set(prev => ({
              qr: {
                ...prev.qr,
                detail: res?.data,
              }
            }))

          } catch (err: any) {
            console.error('Fetch error:', err?.message || err)
          }
        },
      },
      select: (id: any) => set(prev => ({ qr: { ...prev.qr, id: id } })),
      add: async (bodyData: any) => {
        let id = get().qr.id

        if (id) {
          if (typeof bodyData.image == 'string') {
            delete bodyData.image
          }
        }

        toast.promise(
          id
            ? QrService.update({
              query: {
                id: id
              },
              requestBody: bodyData
            })
            : QrService.create({
              requestBody: bodyData
            }),
          {
            loading: id ? 'Updating' : 'Adding',
            success: res => {
              useQrStore.getState().get.paginate({})
              return id ? 'QR updated successfully.' : 'QR added successfully.'
            },
            error: err => {
              return err?.message
            }
          }
        )
      },
      delete: async () => {
        let id = get().qr.id

        if (!id) return toast.error('No plan to delete')

        toast.promise(QrService.delete({ query: { id: id } }), {
          loading: 'deleting',
          success: res => {
            useQrStore.getState().get.paginate({})
            return 'QR deleted successfully'
          },
          error: err => {
            return err?.message
          }
        })
      },

    })
  )
)

export default useQrStore
