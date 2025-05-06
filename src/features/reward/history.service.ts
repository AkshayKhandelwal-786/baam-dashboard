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
                        const res = await RewardHistoryService.list({
                            query: { page: `${page}`, size: `${size}`, keyword }
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
                                paginate: paginate ?? true,
                                filter: filter || null
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
