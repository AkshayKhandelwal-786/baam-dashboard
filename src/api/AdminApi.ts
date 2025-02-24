import api from 'src/configs/api'
import { ApiError, OpenAPI } from './v3/index'
OpenAPI.BASE = (api.baseUrl as string)

if (OpenAPI.BASE && OpenAPI.BASE.includes("localhost")) {
  OpenAPI.BASE = OpenAPI.BASE.replace('/admin', '')
} else {
  OpenAPI.BASE = OpenAPI.BASE.replace('m/admin', 'm')
}

OpenAPI.TOKEN = async () => {
  console.log('HELLO')

  return localStorage.getItem('accessToken') as any
}

OpenAPI.interceptors.response.use(req => {
  console.log('🚀 ~ OpenAPI.interceptors.response.use ~ req:', req)
  if (req.status == 422) {
    req.statusText = req.data?.message
    throw new ApiError(req as any, req.data, req.data?.message)
  }

  return req
})

export { ApiError } from './v3/core/ApiError'
export type { ApiResult } from './v3/core/ApiResult'
export { CancelablePromise, CancelError } from './v3/core/CancelablePromise'
export { OpenAPI, type OpenAPIConfig } from './v3/core/OpenAPI'
export * from './v3/services'
