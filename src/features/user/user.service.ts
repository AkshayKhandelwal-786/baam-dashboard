import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'
import { UserService } from 'src/api/AdminApi'
import { UserData } from 'src/api/v3/models'

export type User = UserData['responses']['Detail']['data']

export enum BankStatus {
  PENDING = "PENDING", REJECTED = "REJECTED", APPROVED = "APPROVED"
}
export enum KycStatus {
  PENDING = "PENDING", REJECTED = "REJECTED", APPROVED = "APPROVED"
}


let timeOut: any

const useUserStore = create(
  combine(
    {
      astrologer: {
        id: null as any,
        list: [] as User[],
        detail: null as unknown as User,
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
          try {
              const res = await UserService.list({
                query: { page: `${page}`, size: `${size}` }
              })
            
              set(prev => ({
                astrologer: {
                  ...prev.astrologer,
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
            useUserStore.getState().get.list()
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
        detail: async (_id: any) => {

          toast.promise(
            UserService.detail({
              query: {
                id: _id
              },
            }),
            {
              loading: 'loading...',
              success: res => {

                set(prev => ({
                  astrologer: {
                    ...prev.astrologer,
                    detail: res?.data,
                  }
                }))


                return res?.message
              },
              error: err => {
                return err?.message
              }
            }
          )
        },



      },
      select: (id: any) => set(prev => ({ astrologer: { ...prev.astrologer, id: id } })),

      add: async (bodyData: any) => {
        let id = get().astrologer.id

        if (id) {
          if (typeof bodyData.image == 'string') {
            delete bodyData.image
          }
        }

        toast.promise(
          id
            ? UserService.update({
              query: {
                id: id
              },
              requestBody: bodyData
            })
            : UserService.create({
              requestBody: bodyData
            }),
          {
            loading: id ? 'Updating' : 'Adding',
            success: res => {
              if (res.status == false) {
                throw new Error(res.message || 'Something went wrong');
              } else {
                useUserStore.getState().get.paginate({})
                return id ? 'User updated successfully.' : 'User added successfully.'
              }              
              
            },
            error: err => {
              console.log("<err",err);
              
              return err?.message
            }
          }
        )
      },
      delete: async () => {
        let id = get().astrologer.id

        if (!id) return toast.error('No plan to delete')

        toast.promise(UserService.delete({ query: { id: id } }), {
          loading: 'deleting',
          success: res => {
            useUserStore.getState().get.paginate({})
            return "Users deleted successfully."
          },
          error: err => {
            return err?.message
          }
        })
      },

      approveDistributor: async (id: any) => {

        toast.promise(UserService.updateDistributor({ query: { id: id } }), {
          loading: 'approving...',
          success: res => {
            useUserStore.getState().get.paginate({})
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

export default useUserStore
