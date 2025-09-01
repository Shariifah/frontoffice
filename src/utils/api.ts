import { ofetch } from 'ofetch'

export const $api = ofetch.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      }
    }
  },
})
