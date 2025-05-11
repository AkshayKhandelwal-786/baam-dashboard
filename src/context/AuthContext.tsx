// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'
import useConstantStore from 'src/features/constants/constants.service'
import toast from 'react-hot-toast'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  const getConstant = useConstantStore(state => state.get)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: 'Bearer ' + storedToken
            }
          })
          .then(async response => {
            console.log('response: ', response.data)
            // await getConstant('all' as any)
            // await getConstant('FORMATS')
            // await getConstant('COMPETITION_STATUSES')
            // await getConstant('MATCH_STATUSES')
            // await getConstant('INNING_STATUSES')
            // await getConstant('INNING_RESULTS')
            // await getConstant('ROUND_TYPES')
            // await getConstant('GENDERS')
            // await getConstant('ROLES')
            // await getConstant('OUT_TYPES')
            // await getConstant('COVERAGE')
            
            setUser({ ...response.data.data })
            setLoading(false)
          })
          .catch(() => {
            setLoading(false)
            localStorage.removeItem('adminData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        const json = response.data
        console.log('json: ', json)

        if (json?.status) {
          window.localStorage.setItem(authConfig.storageTokenKeyName, json.data.token)

          const returnUrl = router.query.returnUrl
          setUser({ ...json.data })
          window.localStorage.setItem('adminData', JSON.stringify(json.data))
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
          router.replace(redirectURL as string)
        } else {
          toast.error(json.message || 'Phone or password is invalid')

          
        }
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('adminData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
