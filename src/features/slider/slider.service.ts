import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import toast from 'react-hot-toast'
import { SliderService } from 'src/api/AdminApi'
import { SliderData } from 'src/api/v3/models'
import { getBase64 } from 'src/helpers/common'
export type Slider = SliderData['responses']['Detail']['data']

let timeOut: any

const useSliderStore = create(
  combine(
    {
      astrologer: {
        id: null as any,
        list: [] as Slider[],
        detail: null as unknown as Slider,
        total: 0,
        page: 0,
        size: 10,
        search: null as string | null,
        paginate: true as boolean,
        filter: null as string | null,
      }
    },
    (set, get) => ({
      get: {
        list: async () => {
          const {
            astrologer: { page, size, search, paginate }
          } = get()

          toast.promise(
            SliderService.list({
              query: { page: `${page}`, size: `${size}` }
            }),
            {
              loading: 'fetching...',
              success: res => {
                set(prev => ({
                  astrologer: {
                    ...prev.astrologer,
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
          filter
        }: {
          page?: number
          size?: number
          search?: string
          paginate?: boolean
          filter?: string
        }) => {
          set(prev => ({ astrologer: { ...prev.astrologer, search: search || '' } }))

          clearTimeout(timeOut)

          const init = () => {
            set(prev => ({
              astrologer: {
                ...prev.astrologer,
                page: page ?? prev.astrologer.page,
                size: size || prev.astrologer.size,
                search: search || prev.astrologer.search,
                paginate: paginate ?? true,
                filter: filter || null
              }
            }))
            useSliderStore.getState().get.list()
          }

          if (search) {
            timeOut = setTimeout(() => {
              init()
            }, 200)
            set(prev => ({ astrologer: { ...prev.astrologer, search: search } }))
            return
          }
          init()
        },



      },
      select: (id: any) => set(prev => ({ astrologer: { ...prev.astrologer, id: id } })),

      add: async (bodyData: any) => {
        let id = get().astrologer.id
        
        bodyData.file = await getBase64(bodyData.file);
        
        if (id) {
          if (typeof bodyData.image == 'string') {
            delete bodyData.image
          }
        }
        return await toast.promise(
          SliderService.create({
            requestBody: bodyData,
          }),
          {
            loading: id ? 'Updating' : 'Adding',
            success: res => {
              useSliderStore.getState().get.paginate({})
              return res?.message
            },
            error: err => {
              return err?.message
            }
          }
        )

      },
      delete: async () => {
        let id = get().astrologer.id
        
        if (!id) return toast.error('No plan to delete')

        toast.promise(SliderService.delete({ query: { id: id } }), {
          loading: 'deleting',
          success: res => {
            useSliderStore.getState().get.paginate({})
            return res?.message
          },
          error: err => {
            return err?.message
          }
        })
      },

    })
  )
)

export default useSliderStore
