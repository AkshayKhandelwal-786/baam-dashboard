import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'
// import { Competition } from '../competitions/competition.service'
import { RewardData } from 'src/api/v3/models'
import { RewardService } from 'src/api/AdminApi'

export type QR = RewardData['responses']['List']['data'][0]

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

const useRewardStore = create(
  combine(
    {
      reward: {
        id: null as any,
        list: [] as QR[],
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
            const res = await RewardService.list({
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
            useRewardStore.getState().get.list()
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
          if (typeof bodyData.image == 'string') {
            delete bodyData.image
          }


          if (typeof bodyData.qr == 'string') {
            delete bodyData.qr
          }
        }

        return await toast.promise(
          id
            ? RewardService.update({
              query: {
                id: id
              },
              formData: bodyData
            })
            : RewardService.create({
              formData: bodyData,
            }),
          {
            loading: id ? 'Updating' : 'Adding',
            success: res => {
              useRewardStore.getState().get.paginate({})
              return id ? 'Reward updated successfully.' : 'Reward added successfully.'
            },
            error: err => {
              return err?.message
            }
          }
        )
      },
      delete: async () => {
        let id = get().reward.id

        if (!id) return toast.error('No plan to delete')

        toast.promise(RewardService.delete({ query: { id: id } }), {
          loading: 'deleting',
          success: res => {
            useRewardStore.getState().get.paginate({})
            return "Reward deleted successfully"
          },
          error: err => {
            return err?.message
          }
        })
      },

    })
  )
)

export default useRewardStore
