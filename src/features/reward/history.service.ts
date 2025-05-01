import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import toast from 'react-hot-toast'
// import { Competition } from '../competitions/competition.service'
import { RewardData } from 'src/api/v3/models'
import { RewardHistoryService, RewardService } from 'src/api/AdminApi'


let timeOut: any

const useRewardHistoryStore = create(
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


                    try {
                        const res = await RewardHistoryService.list({
                            query: { page: `${page}`, size: `${size}`, user: `${user_id}` }
                        })
                      
                        set(prev => ({
                            history: {
                                ...prev.history,
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
                        useRewardHistoryStore.getState().get.list()
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


        })
    )
)

export default useRewardHistoryStore
