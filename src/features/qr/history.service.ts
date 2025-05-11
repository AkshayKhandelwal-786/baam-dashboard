import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import toast from 'react-hot-toast'
// import { Competition } from '../competitions/competition.service'
import { QrHistoryService, RewardHistoryService, RewardService } from 'src/api/AdminApi'
import { QrData } from 'src/api/v3/models'
import { QR } from './qr.service'



let timeOut: any

const useQrHistoryStore = create(
    combine(
        {
            history: {
                id: null as any,
                list: [] as QR[],
                total: 0,
                page: 0,
                size: 10,
                search: null as string | null,
                paginate: true as boolean,
                user_id: null as string | null,
                keyword: null as string | null
            }
        },
        (set, get) => ({
            get: {
                list: async () => {


                    const {
                        history: { page, size, search, paginate, user_id, keyword }
                    } = get()

                    try {
                        const res = await QrHistoryService.list({
                            query: { page: `${page}`, size: `${size}`, user: `${user_id}`, keyword: `${keyword}` }
                        })
                
                        set(prev => ({
                            history: {
                                ...prev.history,
                                list: res?.status === false ? [] : res?.data,
                                total: res?.meta?.total
                            }
                        }))

                        return res?.message || 'fetched'
                    } catch (err: any) {
                        console.error(err)
                        return err?.message?.message
                    }
                
                },
                paginate: ({
                    page,
                    size,
                    search,
                    paginate,
                    user_id,
                    keyword
                }: {
                    page?: number
                    size?: number
                    search?: string
                    paginate?: boolean
                    user_id?: string
                    keyword?:string
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
                                keyword: keyword || '',
                                paginate: paginate ?? true,
                            }
                        }))
                        useQrHistoryStore.getState().get.list()
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

export default useQrHistoryStore
