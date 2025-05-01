import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'
// import { Competition } from '../competitions/competition.service'
import { PromotionData } from 'src/api/v3/models'
import { PromotionService } from 'src/api/AdminApi'
import { getBase64 } from 'src/helpers/common'

export type Promotion = PromotionData['responses']['List']['data'][0]

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

const usePromotionStore = create(
  combine(
    {
      reward: {
        id: null as any,
        list: [] as Promotion[],
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
          const {
            reward: { page, size, search, paginate }
          } = get()

          try {
            const res = await PromotionService.list({
              query: { page: `${page}`, size: `${size}` }
            })
          
            set(prev => ({
              reward: {
                ...prev.reward,
                list: res?.data,
                total: res?.meta?.total
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
          set(prev => ({ reward: { ...prev.reward, search: search || '' } }))

          clearTimeout(timeOut)

          const init = () => {
            set(prev => ({
              reward: {
                ...prev.reward,
                page: page ?? prev.reward.page,
                size: size || prev.reward.size,
                search: search || prev.reward.search,
                paginate: paginate ?? true,
                filter: filter || null
              }
            }))
            usePromotionStore.getState().get.list()
          }

          if (search) {
            timeOut = setTimeout(() => {
              init()
            }, 200)
            set(prev => ({ reward: { ...prev.reward, search: search } }))
            return
          }
          init()
        }
      },
      select: (id: any) => set(prev => ({ reward: { ...prev.reward, id: id } })),
      add: async (bodyData: any) => {
        let id = get().reward.id
                
        if (id) {
          console.log("<<",bodyData);
          
          if (bodyData.file) {
            bodyData.file = await getBase64(bodyData.file);
          }
        } else {
          bodyData.file = await getBase64(bodyData.file);
        }
        
        return await toast.promise(
          (id
            ? PromotionService.update({
                query: { id },
                requestBody: bodyData
              })
            : PromotionService.create({
                requestBody: bodyData
              })) as Promise<PromotionData['responses']['Update']>, // ✅ This helps narrow type
          {
            loading: id ? 'Updating' : 'Adding',
            success: res => {
              usePromotionStore.getState().get.paginate({})
              return id ? 'Promotion updated successfully.' : 'Promotion added successfully.'

            },
            error: err => {
              return err?.message || 'Something went wrong.'
            }
          }
        )
        

      },
      delete: async () => {
        let id = get().reward.id

        if (!id) return toast.error('No plan to delete')

        toast.promise(PromotionService.delete({ query: { id: id } }), {
          loading: 'deleting',
          success: res => {
            usePromotionStore.getState().get.paginate({})
            return 'Promotion deleted successfully.'
          },
          error: err => {
            return err?.message
          }
        })
      },

    })
  )
)

export default usePromotionStore
