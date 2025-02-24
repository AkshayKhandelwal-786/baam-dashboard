import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'https://reward-api.baam.com.baam.co.in/swagger-admin/json',
  output: 'src/api/v3',
  client: 'axios',
  debug: true,
  serviceResponse: 'body',
  format: true,
  lint: true,
  experimental: true
})
