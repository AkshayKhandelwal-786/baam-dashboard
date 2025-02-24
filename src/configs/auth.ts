import api from './api'

export default {
  meEndpoint: api.baseUrl + '/admin/auth/me',
  loginEndpoint: api.baseUrl + '/admin/auth/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken //
}
